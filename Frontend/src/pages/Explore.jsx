import { Container, Box, Heading } from '@chakra-ui/react';
import Feed from '../components/feed/Feed';
import { getExplore } from '../services/postService';

export default function Explore() {
  return (
    <Container maxW="800px" py={4}>
      <Heading size="lg" mb={4}>
        Explore
      </Heading>
      <Feed fetchPosts={getExplore} />
    </Container>
  );
}

