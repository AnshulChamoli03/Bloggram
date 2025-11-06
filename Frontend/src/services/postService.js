import api from './apiClient';

/**
 * Get user feed posts
 * @returns {Promise} Feed posts
 */
export async function getFeed() {
  const response = await api.get('/api/posts');
  return response.data;
}

/**
 * Get explore/top posts (currently same as feed, can be enhanced later)
 * @returns {Promise} Top posts
 */
export async function getExplore() {
  // For now, return all posts. Can be enhanced to sort by likes/engagement
  const response = await api.get('/api/posts');
  return response.data;
}

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} postData.text - Post text content
 * @param {string[]} postData.mediaUrls - Array of media URLs from Firebase
 * @param {string[]} postData.tags - Array of hashtags (will be prefixed with # if needed)
 * @param {string} postData.userId - User ID (required)
 * @returns {Promise} Created post
 */
export async function createPost({ text, mediaUrls = [], tags = [], userId }) {
  // Ensure hashtags start with #
  const formattedTags = tags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
  
  const response = await api.post('/api/posts', {
    user: userId,
    content: {
      text,
      media: mediaUrls,
    },
    hashtags: formattedTags,
  });
  return response.data;
}

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @returns {Promise} Post data
 */
export async function getPost(postId) {
  const response = await api.get(`/api/posts/${postId}`);
  return response.data;
}

