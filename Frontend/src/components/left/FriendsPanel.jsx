import { Box, VStack, Heading, Avatar, Text, Skeleton, SkeletonText } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getConnections } from '../../services/userService';

export default function FriendsPanel() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await getConnections();
      setConnections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="sm" mb={4}>
        Connections
      </Heading>
      {loading ? (
        <VStack align="stretch" spacing={3}>
          {[1, 2, 3].map((i) => (
            <Box key={i} display="flex" gap={3}>
              <Skeleton borderRadius="full" width="40px" height="40px" />
              <VStack align="start" spacing={1} flex={1}>
                <Skeleton height="16px" width="60%" />
                <Skeleton height="12px" width="40%" />
              </VStack>
            </Box>
          ))}
        </VStack>
      ) : connections.length === 0 ? (
        <Text color="gray.500" fontSize="sm">
          No connections yet
        </Text>
      ) : (
        <VStack align="stretch" spacing={3}>
          {connections.slice(0, 10).map((connection) => (
            <Box key={connection._id || connection.id} display="flex" gap={3} alignItems="center">
              <Avatar
                size="sm"
                name={connection.name || connection.username}
                src={connection.avatar}
              />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontSize="sm" fontWeight="medium">
                  {connection.name || connection.username}
                </Text>
                {connection.username && connection.name && (
                  <Text fontSize="xs" color="gray.500">
                    @{connection.username}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

