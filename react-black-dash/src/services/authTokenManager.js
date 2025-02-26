/**
 * Authentication Token Manager
 * 
 * This service provides a centralized way to manage authentication tokens
 * outside of React components, allowing non-React services like API
 * to access the current authentication token.
 */

// Token storage
let currentToken = null;

// Exported methods
export const authTokenManager = {
  /**
   * Set the current authentication token
   * @param {string} token - The authentication token
   */
  setToken(token) {
    currentToken = token;
  },

  /**
   * Get the current authentication token
   * @returns {string|null} The current token or null if not set
   */
  getToken() {
    return currentToken;
  },

  /**
   * Clear the current authentication token
   */
  clearToken() {
    currentToken = null;
  }
};

export default authTokenManager;