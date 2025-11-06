import { Box, VStack, Avatar, Text, Button, Skeleton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getMe } from '../../services/userService';

export default function UserPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
        <VStack align="stretch" spacing={3}>
          <Skeleton borderRadius="full" width="80px" height="80px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" width="60%" />
        </VStack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
        <Text>Failed to load user</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
      <VStack align="stretch" spacing={3}>
        <VStack spacing={2}>
          <Avatar size="lg" name={user.name || user.username} src={user.avatar} />
          <VStack spacing={0}>
            <Text fontWeight="bold" fontSize="lg">
              {user.name || user.username}
            </Text>
            {user.username && user.name && (
              <Text fontSize="sm" color="gray.500">
                @{user.username}
              </Text>
            )}
            {user.bio && (
              <Text fontSize="sm" color="gray.600" textAlign="center" mt={2}>
                {user.bio}
              </Text>
            )}
          </VStack>
        </VStack>
        <Button colorScheme="blue" variant="outline" size="sm" width="100%">
          Edit Profile
        </Button>
      </VStack>
    </Box>
  );
}

