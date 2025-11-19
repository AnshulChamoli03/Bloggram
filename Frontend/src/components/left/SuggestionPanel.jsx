import { Box, Heading, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getSuggestions } from '../../services/userService';

const SuggestionPanel = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await getSuggestions();
        setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="sm" mb={4}>
        Suggestions
      </Heading>
      {loading ? (
        <Box display="flex" flexDirection="column" gap={3}>
          {[1, 2, 3].map((i) => (
            <Box key={i} display="flex" gap={3}>
              <Box borderRadius="full" width="40px" height="40px" bg="gray.200" />
              <Box display="flex" flexDirection="column" gap={1} flex={1}>
                <Box height="16px" width="60%" bg="gray.200" borderRadius="md" />
                <Box height="12px" width="40%" bg="gray.200" borderRadius="md" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : suggestions.length === 0 ? (
        <Text color="gray.500" fontSize="sm">
          No suggestions yet
        </Text>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {suggestions.slice(0, 10).map((suggestion) => {
            const displayName = suggestion.userName || suggestion.name || suggestion.email || 'Unknown';
            const initials = getInitials(displayName);
            
            return (
              <Box key={suggestion._id || suggestion.id} display="flex" gap={3} alignItems="center">
                <Box
                  width="40px"
                  height="40px"
                  borderRadius="full"
                  bg="blue.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                  backgroundImage={suggestion.profilePicture ? `url(${suggestion.profilePicture})` : 'none'}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  flexShrink={0}
                >
                  {!suggestion.profilePicture && initials}
                </Box>
                <Box display="flex" flexDirection="column" gap={0} flex={1} minWidth={0}>
                  <Text fontSize="sm" fontWeight="medium" isTruncated>
                    {displayName}
                  </Text>
                    {suggestion.email && displayName !== suggestion.email && (
                    <Text fontSize="xs" color="gray.500" isTruncated>
                      {suggestion.email}
                    </Text>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default SuggestionPanel;

