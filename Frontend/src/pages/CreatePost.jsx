import { Container, Box, Textarea, Button, VStack, HStack, Heading, Text, IconButton, Flex, Spinner, Image } from '@chakra-ui/react';
import { Delete, CloudUpload } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { uploadMedia } from '../services/firebase';
import { createPost } from '../services/postService';
import { getMe } from '../services/userService';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const showToast = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    // Get current user info
    getMe()
      .then((user) => {
        setUserId(user._id || user.id);
        setUserName(user.userName || '');
      })
      .catch(() => {
        // Failed to get user
      });
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Create previews
    const newPreviews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const extractHashtags = (text) => {
    if (!text || !text.trim()) return [];
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    if (!matches) return [];
    // Extract hashtags without #, filter out empty strings
    return matches
      .map((tag) => tag.substring(1))
      .filter((tag) => tag && tag.trim().length > 0);
  };

  const handleSubmit = async () => {
    if (!text.trim() && files.length === 0) {
      showToast('Please add some text or media to your post', 'error');
      return;
    }

    if (!userId || !userName) {
      showToast('User not found. Please refresh and try again.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Upload media to Firebase
      let mediaUrls = [];
      if (files.length > 0) {
        setUploading(true);
        try {
          mediaUrls = await uploadMedia(files, userId);
        } catch (uploadError) {
          showToast(uploadError.message || 'Failed to upload media files. Please check Firebase configuration.', 'error');
          setUploading(false);
          setSubmitting(false);
          return; // Stop here if upload fails
        }
        setUploading(false);
      }

      // Step 2: Extract hashtags from text
      const tags = extractHashtags(text);

      // Step 3: Create post via backend API
      // Text is optional - send empty string if no text provided
      const postText = text.trim();
      
      await createPost({
        text: postText,
        mediaUrls,
        tags,
        userId,
        userName,
      });

      showToast('Post created successfully!', 'success');

      // Reset form and navigate to home
      setText('');
      setFiles([]);
      setPreviews([]);
      navigate('/');
    } catch (error) {
      
      // Extract detailed error message
      let errorMessage = 'Failed to create post. Please try again.';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.details && Array.isArray(errorData.details)) {
          errorMessage = errorData.details.join('. ');
        } else if (errorData.error) {
          errorMessage = errorData.error;
          if (errorData.details) {
            errorMessage += ': ' + (Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxW="800px" py={4}>
      <Heading size="lg" mb={4}>
        Create Post
      </Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <VStack align="stretch" spacing={4}>
          <Textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            resize="vertical"
          />

          {/* File Previews */}
          {previews.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Media ({previews.length})
              </Text>
              <Flex gap={2} flexWrap="wrap">
                {previews.map((preview, index) => (
                  <Box key={index} position="relative" width="150px" height="150px">
                    {preview.type === 'video' ? (
                      <video
                        src={preview.url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                        controls
                      />
                    ) : (
                      <Image
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}
                    {/* <IconButton
                      icon={<Delete />}
                      position="absolute"
                      top={2}
                      right={2}
                      size="sm"
                      colorScheme="red.500"
                      onClick={() => removeFile(index)}
                      aria-label="Remove file"
                    /> */}
                    <IconButton
                      onClick={() => removeFile(index)}
                      aria-label="Remove file"
                      colorScheme="red.500"
                      size="sm"
                      style={{ position: 'absolute', top: '8px', right: '8px' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          {/* File Upload Button */}
          <Box>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              as="label"
              htmlFor="file-upload"
              variant="outline"
              cursor="pointer"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <CloudUpload />
              Add Media
            </Button>
          </Box>

          {/* Submit Button */}
          <HStack justify="flex-end" spacing={3}>
            {uploading && (
              <HStack>
                <Spinner size="sm" />
                <Text fontSize="sm" color="gray.500">
                  Uploading media...
                </Text>
              </HStack>
            )}
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={uploading || submitting}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {submitting && <Spinner size="sm" />}
              {submitting ? 'Creating...' : 'Post'}
            </Button>
          </HStack>
        </VStack>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 5000 : 3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

