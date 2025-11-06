import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Search from '../pages/Search';
import CreatePost from '../pages/CreatePost';
import Navbar from '../components/navbar/Navbar';
import UserPanel from '../components/left/UserPanel';
import FriendsPanel from '../components/left/FriendsPanel';
import { Box, Grid, GridItem } from '@chakra-ui/react';

export default function AppRouter() {
  return (
    <BrowserRouter>
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post" element={<CreatePost />} />
            </Routes>
          </GridItem>

          {/* Right Sidebar (empty for now, can add suggestions later) */}
          <GridItem display={{ base: 'none', xl: 'block' }}></GridItem>
        </Grid>
      </Box>
    </BrowserRouter>
  );
}

