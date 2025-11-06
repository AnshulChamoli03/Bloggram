import { Box, VStack, HStack, Avatar, Text, Heading, Image, Flex, IconButton } from '@chakra-ui/react';
import { Favorite, Comment, Share, MoreVert } from '@mui/icons-material';
import { useState } from 'react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // TODO: Call API to like/unlike post
  };

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video');
  };

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || (!isVideo(url) && url);
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
      <VStack align="stretch" spacing={3}>
        {/* Post Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar
              size="md"
              name={post.author?.name || post.author?.username}
              src={post.author?.avatar}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="sm">
                {post.author?.name || post.author?.username}
              </Text>
              {post.author?.username && post.author?.name && (
                <Text fontSize="xs" color="gray.500">
                  @{post.author.username}
                </Text>
              )}
              {post.createdAt && (
                <Text fontSize="xs" color="gray.400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              )}
            </VStack>
          </HStack>
          <IconButton
            icon={<MoreVert />}
            variant="ghost"
            size="sm"
            aria-label="More options"
          />
        </HStack>

        {/* Post Content */}
        {(post.content?.text || post.text) && (
          <Text fontSize="md" whiteSpace="pre-wrap">
            {post.content?.text || post.text}
          </Text>
        )}

        {/* Media */}
        {((post.content?.media && post.content.media.length > 0) || (post.mediaUrls && post.mediaUrls.length > 0)) && (
          <Box>
            {(() => {
              const mediaUrls = post.content?.media || post.mediaUrls || [];
              return mediaUrls.length === 1 ? (
                // Single media
                isVideo(mediaUrls[0]) ? (
                  <video
                    controls
                    style={{ width: '100%', borderRadius: '8px', maxHeight: '500px' }}
                  >
                    <source src={mediaUrls[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={mediaUrls[0]}
                    alt="Post media"
                    borderRadius="md"
                    maxH="500px"
                    objectFit="contain"
                    width="100%"
                  />
                )
              ) : (
                // Multiple media - grid layout
                <Box
                  display="grid"
                  gridTemplateColumns={`repeat(${Math.min(mediaUrls.length, 3)}, 1fr)`}
                  gap={2}
                >
                  {mediaUrls.slice(0, 9).map((url, index) => (
                  <Box key={index} position="relative">
                    {isVideo(url) ? (
                      <video
                        controls
                        style={{
                          width: '100%',
                          height: '200px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                        }}
                      >
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={url}
                        alt={`Post media ${index + 1}`}
                        borderRadius="md"
                        height="200px"
                        objectFit="cover"
                        width="100%"
                      />
                    )}
                  </Box>
                  ))}
                </Box>
              );
            })()}
          </Box>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Flex gap={2} flexWrap="wrap">
            {post.tags.map((tag, index) => (
              <Text
                key={index}
                as="span"
                color="blue.500"
                fontSize="sm"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                #{tag}
              </Text>
            ))}
          </Flex>
        )}

        {/* Post Actions */}
        <HStack spacing={4} pt={2} borderTop="1px" borderColor="gray.100">
          <HStack spacing={1}>
            <IconButton
              icon={<Favorite />}
              colorScheme={liked ? 'red' : 'gray'}
              variant={liked ? 'solid' : 'ghost'}
              size="sm"
              onClick={handleLike}
              aria-label="Like"
            />
            <Text fontSize="sm" color="gray.600">
              {likeCount}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <IconButton
              icon={<Comment />}
              variant="ghost"
              size="sm"
              aria-label="Comment"
            />
            <Text fontSize="sm" color="gray.600">
              {post.comments?.length || 0}
            </Text>
          </HStack>
          <IconButton
            icon={<Share />}
            variant="ghost"
            size="sm"
            aria-label="Share"
          />
        </HStack>
      </VStack>
    </Box>
  );
}

