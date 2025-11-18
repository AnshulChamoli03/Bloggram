import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Search from '../pages/Search';
import CreatePost from '../pages/CreatePost';
import Auth from '../pages/Auth';
import Navbar from '../components/navbar/Navbar';
import UserPanel from '../components/left/UserPanel';
import FriendsPanel from '../components/left/FriendsPanel';
import ProtectedRoute from '../components/ProtectedRoute';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

function AuthenticatedLayout({ children }) {
  return (
    <Box minH="100vh" h="100%" bg="gray.50">
      <Navbar />
      <Grid
        templateColumns={{ base: '1fr', lg: '250px 1fr 250px' }}
        gap={4}
        maxW="1400px"
        mx="auto"
        px={4}
        py={4}
      >
        {/* Left Sidebar */}
        <GridItem display={{ base: 'none', lg: 'block' }}>
          <Box position="sticky" top="80px">
            <UserPanel />
            <FriendsPanel />
          </Box>
        </GridItem>

        {/* Main Content */}
        <GridItem>
          {children}
        </GridItem>

        {/* Right Sidebar (empty for now, can add suggestions later) */}
        <GridItem display={{ base: 'none', xl: 'block' }}></GridItem>
      </Grid>
    </Box>
  );
}

export default function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null; // ProtectedRoute will handle loading state
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - Login/Register */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Explore />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Search />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <CreatePost />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

