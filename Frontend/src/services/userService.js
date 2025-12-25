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

/**
 * Update current user profile
 * Email / mobile should not be changed here; backend can additionally enforce this.
 * @param {Object} updates - Partial user fields to update (e.g. userName, bio, profilePicture)
 * @returns {Promise} Updated user data
 */
export async function updateProfile(updates) {
  const response = await api.put('/api/users/me', updates);
  return response.data;
}

/**
 * Add or remove connection with a user
 * @param {string} userId - User ID to connect/disconnect with
 * @returns {Promise} Connection status
 */
export async function toggleConnection(userId) {
  const response = await api.post(`/api/users/me/connections/${userId}`);
  return response.data;
}