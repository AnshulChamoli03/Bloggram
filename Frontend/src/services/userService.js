import api from './apiClient';

/**
 * Get current user information
 * @returns {Promise} User data
 */
export async function getMe() {
  const response = await api.get('/api/users/me');
  return response.data;
}

/**
 * Get user connections/friends
 * @param {string} userId - User ID (optional, defaults to current user)
 * @returns {Promise} Array of connections
 */
export async function getConnections(userId = null) {
  const endpoint = userId ? `/api/users/${userId}/connections` : '/api/users/me/connections';
  const response = await api.get(endpoint);
  return response.data;
}

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export async function getUserProfile(userId) {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
}

export async function getSuggestions() {  // Get user suggestions for the current user
  const response = await api.get('/api/users/');
  return response.data;
}
