import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api'
});

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
