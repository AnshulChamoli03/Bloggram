import { Container, Box, VStack, Heading } from '@chakra-ui/react';
import { TextField, InputAdornment, Tabs, Tab, Box as MuiBox } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useState } from 'react';
import { search as searchService } from '../services/searchService';
import PostCard from '../components/feed/PostCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSearch = async (searchType = 'post') => {
    if (!query.trim()) {
      setResults({ users: [], posts: [], hashtags: [] });
      return;
    }

    try {
      setLoading(true);
      const data = await searchService({ q: query, type: searchType });
      
      if (searchType === 'user') {
        setResults((prev) => ({ ...prev, users: Array.isArray(data) ? data : data.users || [] }));
      } else if (searchType === 'hashtag') {
        setResults((prev) => ({ ...prev, hashtags: Array.isArray(data) ? data : data.hashtags || [] }));
      } else {
        setResults((prev) => ({ ...prev, posts: Array.isArray(data) ? data : data.posts || [] }));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const types = ['post', 'user', 'hashtag'];
      handleSearch(types[activeTab]);
    }
  };

  const handlePostDeleted = (postId) => {
    if (!postId) return;
    setResults((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => (post._id || post.id) !== postId),
    }));
  };

  return (
    <Container maxW="800px" py={4}>
      <Heading size="lg" mb={4}>
        Search
      </Heading>
      <Box mb={4}>
        <TextField
          fullWidth
          size="medium"
          placeholder="Search users, hashtags, or posts..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'gray' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <MuiBox sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => {
          setActiveTab(newValue);
          const types = ['post', 'user', 'hashtag'];
          handleSearch(types[newValue]);
        }}>
          <Tab label="Posts" />
          <Tab label="Users" />
          <Tab label="Hashtags" />
        </Tabs>
      </MuiBox>

      {activeTab === 0 && (
        <VStack align="stretch" spacing={0}>
          {loading ? (
            <Box textAlign="center" py={8}>
              Searching...
            </Box>
          ) : results.posts.length === 0 ? (
            <Box textAlign="center" py={8} color="gray.500">
              No posts found
            </Box>
          ) : (
            results.posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))
          )}
        </VStack>
      )}

      {activeTab === 1 && (
        <VStack align="stretch" spacing={3}>
          {loading ? (
            <Box textAlign="center" py={8}>
              Searching...
            </Box>
          ) : results.users.length === 0 ? (
            <Box textAlign="center" py={8} color="gray.500">
              No users found
            </Box>
          ) : (
            results.users.map((user) => (
              <Box
                key={user._id || user.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="sm"
                display="flex"
                gap={3}
                alignItems="center"
              >
                <img
                  src={user.avatar}
                  alt={user.name || user.username}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Box fontWeight="bold">{user.name || user.username}</Box>
                  {user.username && user.name && (
                    <Box fontSize="sm" color="gray.500">
                      @{user.username}
                    </Box>
                  )}
                  {user.bio && (
                    <Box fontSize="sm" color="gray.600" mt={1}>
                      {user.bio}
                    </Box>
                  )}
                </VStack>
              </Box>
            ))
          )}
        </VStack>
      )}

      {activeTab === 2 && (
        <VStack align="stretch" spacing={3}>
          {loading ? (
            <Box textAlign="center" py={8}>
              Searching...
            </Box>
          ) : results.hashtags.length === 0 ? (
            <Box textAlign="center" py={8} color="gray.500">
              No hashtags found
            </Box>
          ) : (
            results.hashtags.map((hashtag, index) => (
              <Box
                key={index}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Box fontWeight="bold" fontSize="lg" color="blue.500">
                  #{hashtag.tag || hashtag}
                </Box>
                {hashtag.count && (
                  <Box fontSize="sm" color="gray.500" mt={1}>
                    {hashtag.count} posts
                  </Box>
                )}
              </Box>
            ))
          )}
        </VStack>
      )}
    </Container>
  );
}

