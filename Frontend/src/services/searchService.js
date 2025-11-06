import api from './apiClient';

/**
 * Search for users, hashtags, or posts
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.q - Search query
 * @param {string} searchParams.type - Type of search: 'user', 'hashtag', or 'post'
 * @returns {Promise} Search results
 */
export async function search({ q, type = 'post' }) {
  if (type === 'post') {
    // Use the posts search endpoint
    const response = await api.get('/api/posts/search', {
      params: {
        text: q,
        // Can also add hashtags or user params here
      },
    });
    return response.data;
  } else if (type === 'hashtag') {
    // Search posts by hashtag
    const response = await api.get('/api/posts/search', {
      params: {
        hashtags: q.startsWith('#') ? q.substring(1) : q,
      },
    });
    // Transform to hashtag format
    return response.data.map((post) => ({
      tag: post.hashtags?.[0] || q,
      count: 1,
      posts: [post],
    }));
  } else {
    // User search - would need a separate endpoint
    // For now, return empty array
    return [];
  }
}

