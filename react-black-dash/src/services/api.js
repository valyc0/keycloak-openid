import axios from 'axios';
import { authTokenManager } from './authTokenManager';
import { setupFakeBackend } from './FakeBackendInterceptor';

/**
 * API Configuration and Service Module
 * @module api
 */

// Validate required environment variables
if (!import.meta.env.VITE_EXTERNAL_API_URL) {
  throw new Error('VITE_EXTERNAL_API_URL environment variable is required');
}

// Validate API URL format
try {
  new URL(import.meta.env.VITE_EXTERNAL_API_URL);
} catch (error) {
  throw new Error(`Invalid VITE_EXTERNAL_API_URL format: ${error.message}`);
}

/** @type {import('axios').AxiosInstance} */
const api = axios.create({
  baseURL: import.meta.env.VITE_EXTERNAL_API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// API mode management
let useFakeBackend = import.meta.env.VITE_USE_FAKE_BACKEND === 'true';
let fakeBackendInitialized = false;

/**
 * Initialize the fake backend if enabled by environment or explicitly called
 * @returns {boolean} Whether fake backend is active
 */
export const initFakeBackend = () => {
  if (useFakeBackend && !fakeBackendInitialized) {
    console.log('[API] Initializing fake backend');
    setupFakeBackend(api);
    fakeBackendInitialized = true;
  }
  return useFakeBackend;
};

/**
 * Enable fake backend responses
 */
export const enableFakeBackend = () => {
  if (!fakeBackendInitialized) {
    setupFakeBackend(api);
    fakeBackendInitialized = true;
  }
  useFakeBackend = true;
  console.log('[API] Fake backend enabled');
};

/**
 * Disable fake backend responses (uses real API)
 * Note: Once initialized, interceptors remain active but will pass through to real API
 */
export const disableFakeBackend = () => {
  useFakeBackend = false;
  console.log('[API] Using real backend');
};

/**
 * Check if fake backend is currently enabled
 * @returns {boolean} Whether fake backend is active
 */
export const isFakeBackendEnabled = () => {
  return useFakeBackend;
};

// Request interceptor to add authentication token
api.interceptors.request.use(
  config => {
    // Get token from centralized token manager
    const token = authTokenManager.getToken();

    // Log token status (in development only)
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        tokenPrefix: token ? token.substr(0, 10) + '...' : null
      });
    }

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      console.warn('[API Request] No auth token available');
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Error interceptor for common API errors
api.interceptors.response.use(
  response => {
    // Log successful response data for debugging
    console.log('[API Response]', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    try {
      // Ensure response data is properly parsed JSON
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data);
      }
    } catch (e) {
      console.error('[API Response] Failed to parse JSON:', e);
    }
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with non-2xx status
      console.error('[API Error]', {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config.url,
        headers: error.response.headers,
        hasAuthToken: !!error.config.headers['Authorization'] // Log if request had auth token
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received:', error.request);
    } else {
      // Error in request configuration
      console.error('[API Error] Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Development logging
if (import.meta.env.DEV) {
  console.log('[API] Configuration:', {
    baseURL: import.meta.env.VITE_EXTERNAL_API_URL,
    mockEnabled: import.meta.env.VITE_USE_FAKE_BACKEND === 'true'
  });
}

// Service functions
export const gatewayService = {
  async searchGateways({ query = '', page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' }) {
    const response = await api.get('/gateways/search', {
      params: { query, page, pageSize, sortBy, sortOrder }
    });
    return response.data;
  },

  async getSites() {
    const response = await api.get('/sites');
    return response.data;
  },

  async getMeters() {
    const response = await api.get('/meters');
    return response.data;
  },

  async getMeterParameters(meterId) {
    const response = await api.get('/meters/parameters', {
      params: { meterId }
    });
    return response.data;
  },

  async validateGatewayParameters(params) {
    const response = await api.post('/gateways/validate', params);
    return response.data;
  },

  async saveGatewayConfiguration(config) {
    const response = await api.post('/gateways/configure', config);
    return response.data;
  }
};

export const alarmService = {
  async getAll({ page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc', ...filters }) {
    const response = await api.get('/alarms', { params: { page, pageSize, sortBy, sortOrder, ...filters } });
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      pageSize: response.data?.pageSize || 10
    };
  },

  async create(alarm) {
    const response = await api.post('/alarms', alarm);
    return response.data;
  },

  async update(id, alarm) {
    const response = await api.put(`/alarms/${id}`, alarm);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/alarms/${id}`);
    return response.data;
  },

  async getCallTypes() {
    const response = await api.get('/alarms/call-types');
    return response.data;
  },

  async getCarriers() {
    const response = await api.get('/alarms/carriers');
    return response.data;
  },

  async getStatuses() {
    const response = await api.get('/alarms/statuses');
    return response.data;
  },

  async getSuggestions({ field, query }) {
    const response = await api.get('/alarms/suggestions', {
      params: { field, query }
    });
    return response.data;
  }
};

export default api;
