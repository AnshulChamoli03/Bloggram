import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import { Home, Explore, Search, Create } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Explore, label: 'Explore', path: '/explore' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Create, label: 'Post', path: '/post' },
  ];

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
        <Flex gap={2}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                colorScheme={isActive ? 'blue' : 'gray'}
                variant={isActive ? 'solid' : 'ghost'}
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
        </Flex>
      </Flex>
    </Box>
  );
}

