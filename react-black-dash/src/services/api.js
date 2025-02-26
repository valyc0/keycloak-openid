import axios from 'axios';
import { mockAlarms, alarmOptions, mockMeters, METER_PARAMETERS, mockSites, mockGateways } from '../mockData/db';

// Create axios instance
const api = axios.create({
  baseURL: '/api'
});

// Response delay to simulate network latency
const DELAY = 500;

// Helper to create delayed response
const delayResponse = (data) => {
  return new Promise(resolve => 
    setTimeout(() => 
      resolve({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      }), 
      DELAY
    )
  );
};

// Helper to parse request data
const parseData = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
};

// Mock API handler
const mockApiHandler = async (config) => {
  const { method, url } = config;
  const data = parseData(config.data);

  // Remove baseURL from url for processing
  const path = url?.replace('/api', '') || '';
  
  // Log the incoming request
  console.log(`[Mock API] Processing ${method?.toUpperCase()} ${path}`);

  // Handle gateway endpoints
  if (path.startsWith('/gateways/search') && method?.toLowerCase() === 'get') {
    const params = config.params || {};
    let filteredGateways = [...mockGateways];
    
    // Apply search filter if query is provided
    if (params.query && params.query.length >= 3) {
      filteredGateways = filteredGateways.filter(gateway =>
        gateway.name.toLowerCase().includes(params.query.toLowerCase()) ||
        gateway.serial.toLowerCase().includes(params.query.toLowerCase())
      );
    }

    // Sorting
    if (params.sortBy) {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
      filteredGateways.sort((a, b) => {
        if (typeof a[params.sortBy] === 'string') {
          return sortOrder * a[params.sortBy].localeCompare(b[params.sortBy]);
        }
        return sortOrder * (a[params.sortBy] - b[params.sortBy]);
      });
    }

    // Pagination
    const start = (Number(params.page) - 1) * Number(params.pageSize);
    const end = start + Number(params.pageSize);
    const paginatedGateways = filteredGateways.slice(start, end);

    return delayResponse({
      data: paginatedGateways,
      total: filteredGateways.length,
      page: Number(params.page),
      pageSize: Number(params.pageSize)
    });
  }

  if (path === '/sites' && method?.toLowerCase() === 'get') {
    return delayResponse({ data: mockSites });
  }

  if (path === '/meters' && method?.toLowerCase() === 'get') {
    return delayResponse({ data: mockMeters });
  }

  if (path === '/meters/parameters' && method?.toLowerCase() === 'get') {
    return delayResponse({ data: METER_PARAMETERS });
  }

  if (path === '/gateways/validate' && method?.toLowerCase() === 'post') {
    const errors = {};
    Object.entries(data).forEach(([meterId, parameters]) => {
      parameters.forEach(param => {
        if (param.required && (!param.value || param.value.trim() === '')) {
          if (!errors[meterId]) errors[meterId] = {};
          errors[meterId][param.id] = 'This field is required';
        }
        if (param.type === 'number' && param.value && isNaN(param.value)) {
          if (!errors[meterId]) errors[meterId] = {};
          errors[meterId][param.id] = 'Must be a number';
        }
      });
    });
    return delayResponse({ data: errors });
  }

  if (path === '/gateways/configure' && method?.toLowerCase() === 'post') {
    console.log('Saving gateway configuration:', data);
    return delayResponse({
      data: {
        success: true,
        message: 'Configuration saved successfully'
      }
    });
  }

  // Handle alarm endpoints
  if (method?.toLowerCase() === 'get') {
    if (path === '/alarms/call-types') {
      return delayResponse({ data: alarmOptions.callTypes });
    }
    if (path === '/alarms/carriers') {
      return delayResponse({ data: alarmOptions.carriers });
    }
    if (path === '/alarms/statuses') {
      return delayResponse({ data: alarmOptions.statuses });
    }
    if (path === '/alarms/suggestions') {
      const field = config.params?.field;
      const query = config.params?.query;
      const limit = config.params?.limit || 5;

      const suggestions = [...new Set(
        mockAlarms
          .map(alarm => alarm[field])
          .filter(value =>
            value &&
            String(value).toLowerCase().includes(String(query).toLowerCase())
          )
      )].slice(0, limit);

      return delayResponse({ data: suggestions });
    }
    
    // Handle alarms listing
    if (path === '/alarms') {
      const params = config.params || {};
      const page = Number(params.page) || 1;
      const pageSize = Number(params.pageSize) || 10;
      
      // Apply filters and sorting
      let filteredAlarms = [...mockAlarms];
      
      // Filtering
      Object.keys(params).forEach(key => {
        if (!['page', 'pageSize', 'sortBy', 'sortOrder'].includes(key) && params[key]) {
          filteredAlarms = filteredAlarms.filter(alarm => 
            String(alarm[key]).toLowerCase().includes(String(params[key]).toLowerCase())
          );
        }
      });

      // Sorting
      if (params.sortBy) {
        const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
        filteredAlarms.sort((a, b) => {
          const aValue = a[params.sortBy];
          const bValue = b[params.sortBy];
          
          if (params.sortBy === 'timestamp') {
            return sortOrder * (new Date(aValue) - new Date(bValue));
          }
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
          }
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder * (aValue - bValue);
          }
          return 0;
        });
      }

      // Calculate pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedAlarms = filteredAlarms.slice(start, end);

      return delayResponse({
        data: paginatedAlarms,
        total: filteredAlarms.length,
        page,
        pageSize
      });
    }
  }

  // Handle alarm creation
  if (path === '/alarms' && method?.toLowerCase() === 'post') {
    const newAlarm = {
      ...data,
      id: mockAlarms.length + 1,
      timestamp: new Date().toISOString()
    };
    mockAlarms.push(newAlarm);
    return delayResponse({ data: newAlarm });
  }

  // Handle alarm update
  if (path.match(/^\/alarms\/\d+$/) && method?.toLowerCase() === 'put') {
    const id = parseInt(path.split('/').pop());
    const index = mockAlarms.findIndex(a => a.id === id);
    if (index !== -1) {
      const updatedAlarm = { ...mockAlarms[index], ...data, id };
      mockAlarms[index] = updatedAlarm;
      return delayResponse({ data: updatedAlarm });
    }
    throw new Error('Alarm not found');
  }

  // Handle alarm deletion
  if (path.match(/^\/alarms\/\d+$/) && method?.toLowerCase() === 'delete') {
    const id = parseInt(path.split('/').pop());
    const index = mockAlarms.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAlarms.splice(index, 1);
      return delayResponse({ data: { success: true } });
    }
    throw new Error('Alarm not found');
  }

  // If no mock handler matched, throw error
  throw new Error(`Unhandled request: ${method} ${url}`);
};

// Add request interceptor to handle all requests
api.interceptors.request.use(async (config) => {
  try {
    const response = await mockApiHandler(config);
    // Convert the response to a rejected promise to prevent actual HTTP request
    return Promise.reject({
      config,
      response: response
    });
  } catch (error) {
    return Promise.reject(error);
  }
});

// Add response interceptor to handle the rejected promise from request interceptor
api.interceptors.response.use(
  undefined,
  async (error) => {
    // If we have a response in the error, it means it's our mock response
    if (error.response) {
      return error.response;
    }
    // Otherwise, it's a real error
    return Promise.reject(error);
  }
);

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

  async getMeterParameters() {
    const response = await api.get('/meters/parameters');
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
    return response.data;
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
