import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getSuggestions, toggleConnection, getConnections } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const SuggestionPanel = ({ onConnectionAdded }) => {
  const { user: currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState(new Set());
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadSuggestions();
    loadConnections();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await getSuggestions();
        setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await getConnections();
      const connectionIds = new Set(
        (Array.isArray(data) ? data : []).map(user => user._id || user.id)
      );
      setConnectedUsers(connectionIds);
    } catch (error) {
      // Failed to load connections
    }
  };

  const handleConnectionToggle = async (userId) => {
    if (processing.has(userId)) return;
    
    setProcessing(prev => new Set(prev).add(userId));
    try {
      const result = await toggleConnection(userId);
      // Reload connections to ensure consistency
      await loadConnections();
      // Notify parent component to refresh connections list
      if (result.connected && onConnectionAdded) {
        onConnectionAdded();
      }
    } catch (error) {
      // Failed to toggle connection
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
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
      ) : (() => {
        // Filter out connected users and current user from suggestions
        const currentUserId = currentUser?._id || currentUser?.id;
        const filteredSuggestions = suggestions.filter((suggestion) => {
          const userId = suggestion._id || suggestion.id;
          // Exclude current user and connected users
          return userId !== currentUserId && !connectedUsers.has(userId);
        });

        return filteredSuggestions.length === 0 ? (
          <Text color="gray.500" fontSize="sm">
            No suggestions yet
          </Text>
        ) : (
          <Box display="flex" flexDirection="column" gap={3} maxHeight="200px" overflowY="auto">
            {filteredSuggestions.map((suggestion) => {
              const displayName = suggestion.userName || suggestion.name || suggestion.email || 'Unknown';
              const initials = getInitials(displayName);
              const userId = suggestion._id || suggestion.id;
              const isProcessing = processing.has(userId);
              
              return (
                <Box key={userId} display="flex" gap={3} alignItems="center">
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
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => handleConnectionToggle(userId)}
                    isLoading={isProcessing}
                    loadingText="Adding"
                    flexShrink={0}
                  >
                    +
                  </Button>
                </Box>
              );
            })}
          </Box>
        );
      })()}
    </Box>
  );
};

export default SuggestionPanel;

