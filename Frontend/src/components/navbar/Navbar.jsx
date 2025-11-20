import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import { Home, Explore, Search, Create, Logout, Login } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Explore, label: 'Explore', path: '/explore' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Create, label: 'Post', path: '/post' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Heading size="md" color="blue.600" cursor="pointer" onClick={() => navigate('/')}>
          Bloggram
        </Heading>
        <Flex gap={2} align="center">
          {isAuthenticated && (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    color={isActive ? 'white' : 'blue.600'}
                    bg={isActive ? 'blue.600' : 'transparent'}
                    variant="solid"
                    onClick={() => navigate(item.path)}
                    size="md"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon />
                    {item.label}
                  </Button>
                );
              })}
              {user && (
                <Button
                  color="white"
                  bg="blue.600"
                  variant="solid"
                  size="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  onClick={handleLogout}
                >
                  <Logout />
                  Logout
                </Button>
              )}
            </>
          )}
          {!isAuthenticated && (
            <Button
              colorScheme="blue"
              variant="solid"
              size="md"
              display="flex"
              alignItems="center"
              gap={2}
              onClick={handleLogin}
            >
              <Login />
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

