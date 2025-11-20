import { VStack, Text, Spinner, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import PostCard from './PostCard';

export default function Feed({ fetchPosts }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [fetchPosts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    if (!postId) return;
    setPosts((prev) => prev.filter((post) => (post._id || post.id) !== postId));
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.500">
          Loading posts...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No posts found</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={0}>
      {posts.map((post) => (
        <PostCard key={post._id || post.id} post={post} onDelete={handlePostDeleted} />
      ))}
    </VStack>
  );
}

