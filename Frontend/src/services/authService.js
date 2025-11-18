import api from './apiClient';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Object with user data and token
 */
export async function login(email, password) {
  const response = await api.post('/api/users/login', { email, password });
  
  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return {
    user: response.data.user,
    token: response.data.token
  };
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.userName - Username
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} [userData.profilePicture] - Optional profile picture URL
 * @param {string} [userData.bio] - Optional bio
 * @returns {Promise} User data
 */
export async function register(userData) {
  const response = await api.post('/api/users/register', userData);
  return response.data.user;
}

/**
 * Logout user - clears token from localStorage
 */
export function logout() {
  localStorage.removeItem('token');
}

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} True if token exists
 */
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

