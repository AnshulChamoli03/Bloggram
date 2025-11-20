import { Box, Text } from '@chakra-ui/react';
import { Favorite, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { deletePost as deletePostService } from '../../services/postService';

export default function PostCard({ post, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
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

  const authorName =
    post.userName ||   
    'Unknown';
  const authorAvatar = post.author?.profilePicture || post.author?.avatar || post.user?.profilePicture || post.userAvatar;
  const initials = getInitials(authorName);

  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleDeletePost = async () => {
    if (!post?._id && !post?.id) return;

    try {
      setIsDeleting(true);
      await deletePostService(post._id || post.id);
      window.alert('Post deleted');
      if (typeof onDelete === 'function') {
        onDelete(post._id || post.id);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      window.alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = async () => {
    closeMenu();
    await handleDeletePost();
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={4}>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Post Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={3} alignItems="center">
            <Box
              width="40px"
              height="40px"
              borderRadius="full"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="sm"
              fontWeight="bold"
              backgroundImage={authorAvatar ? `url(${authorAvatar})` : 'none'}
              backgroundSize="cover"
              backgroundPosition="center"
              flexShrink={0}
            >
              {!authorAvatar && initials}
            </Box>
            <Box display="flex" flexDirection="column" gap={0}>
              <Text fontWeight="bold" fontSize="sm">
                {authorName}
              </Text>
              {post.author?.email && authorName !== post.author.email && (
                <Text fontSize="xs" color="gray.500">
                  {post.author.email}
                </Text>
              )}
              {post.createdAt && (
                <Text fontSize="xs" color="gray.400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              )}
            </Box>
          </Box>
          <IconButton
            size="small"
            aria-label="More options"
            onClick={openMenu}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleDeleteClick} disabled={isDeleting} sx={{ color: 'error.main' }}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </MenuItem>
          </Menu>
        </Box>

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
                  <Box
                    as="img"
                    src={mediaUrls[0]}
                    alt="Post media"
                    borderRadius="md"
                    maxH="500px"
                    width="100%"
                    objectFit="contain"
                    style={{ objectFit: 'contain' }}
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
                      <Box
                        as="img"
                        src={url}
                        alt={`Post media ${index + 1}`}
                        borderRadius="md"
                        height="200px"
                        width="100%"
                        style={{ objectFit: 'cover' }}
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
        {(post.tags && post.tags.length > 0) || (post.hashtags && post.hashtags.length > 0) ? (
          <Box display="flex" gap={2} flexWrap="wrap">
            {(post.tags || post.hashtags || []).map((tag, index) => (
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
          </Box>
        ) : null}

        {/* Hashtags */}
        {post.content?.hashtags && post.content.hashtags.length > 0 && (
          <Box display="flex" gap={2} flexWrap="wrap">
            {post.content.hashtags.map((tag, index) => (
              <Text
                key={index}
                as="span"
                color="blue.500"
                fontSize="sm"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                {tag}
              </Text>
            ))}
          </Box>
        )}

        {/* Post Actions */}
        <Box display="flex" gap={4} pt={2} borderTop="1px" borderColor="gray.100" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <IconButton
              size="small"
              onClick={handleLike}
              aria-label="Like"
              color={liked ? 'error' : 'default'}
            >
              <Favorite fontSize="small" />
            </IconButton>
            <Text fontSize="sm" color="gray.600">
              {likeCount}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

