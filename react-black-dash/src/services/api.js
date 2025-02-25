import { mockBackend } from '../mockData/mockBackend';

export const gatewayService = {
  async searchGateways({ query = '', page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' }) {
    try {
      return await mockBackend.getGateways({ query, page, pageSize, sortBy, sortOrder });
    } catch (error) {
      console.error('Error fetching gateways:', error);
      throw error;
    }
  },

  async getSites() {
    try {
      return await mockBackend.getSites();
    } catch (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
  },

  async getMeters() {
    try {
      return await mockBackend.getMeters();
    } catch (error) {
      console.error('Error fetching meters:', error);
      throw error;
    }
  },

  async getMeterParameters() {
    try {
      return await mockBackend.getMeterParameters();
    } catch (error) {
      console.error('Error fetching meter parameters:', error);
      throw error;
    }
  },

  async validateGatewayParameters(params) {
    try {
      return await mockBackend.validateGatewayParameters(params);
    } catch (error) {
      console.error('Error validating parameters:', error);
      throw error;
    }
  },

  async saveGatewayConfiguration(config) {
    try {
      return await mockBackend.saveGatewayConfiguration(config);
    } catch (error) {
      console.error('Error saving gateway configuration:', error);
      throw error;
    }
  }
};

export const alarmService = {
  async getAll({ page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc', ...filters }) {
    try {
      return await mockBackend.getAlarms({ page, pageSize, sortBy, sortOrder, ...filters });
    } catch (error) {
      console.error('Error fetching alarms:', error);
      throw error;
    }
  },

  async create(alarm) {
    try {
      return await mockBackend.createAlarm(alarm);
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  },

  async update(id, alarm) {
    try {
      return await mockBackend.updateAlarm(id, alarm);
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await mockBackend.deleteAlarm(id);
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  },

  async getCallTypes() {
    try {
      return await mockBackend.getCallTypes();
    } catch (error) {
      console.error('Error fetching call types:', error);
      throw error;
    }
  },

  async getCarriers() {
    try {
      return await mockBackend.getCarriers();
    } catch (error) {
      console.error('Error fetching carriers:', error);
      throw error;
    }
  },

  async getStatuses() {
    try {
      return await mockBackend.getStatuses();
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  },

  async getSuggestions({ field, query }) {
    try {
      return await mockBackend.getSuggestions({ field, query });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }
};
