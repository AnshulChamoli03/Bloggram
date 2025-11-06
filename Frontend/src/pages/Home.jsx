import { Container, Box } from '@chakra-ui/react';
import Feed from '../components/feed/Feed';
import { getFeed } from '../services/postService';

export default function Home() {
  return (
    <Container maxW="800px" py={4}>
      <Feed fetchPosts={getFeed} />
    </Container>
  );
}

