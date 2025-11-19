import { Box, Text, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserPanel() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box borderRadius="full" width="80px" height="80px" bg="gray.200" />
          <Box height="20px" bg="gray.200" borderRadius="md" />
          <Box height="20px" width="60%" bg="gray.200" borderRadius="md" />
        </Box>
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

  const initials = getInitials(user.userName || user.email);

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box
            width="80px"
            height="80px"
            borderRadius="full"
            bg="blue.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            backgroundImage={user.profilePicture ? `url(${user.profilePicture})` : 'none'}
            backgroundSize="cover"
            backgroundPosition="center"
          >
            {!user.profilePicture && initials}
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" gap={0}>
            <Text fontWeight="bold" fontSize="lg" textAlign="center">
              {user.userName || user.email}
            </Text>
            {user.email && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                {user.email}
              </Text>
            )}
            {user.bio && (
              <Text fontSize="sm" color="gray.600" textAlign="center" mt={2}>
                {user.bio}
              </Text>
            )}
          </Box>
        </Box>
        <Button colorScheme="blue" variant="outline" size="sm" width="100%" color="white">
          Edit Profile
        </Button>
      </Box>
    </Box>
  );
}

