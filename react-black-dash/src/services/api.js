import { mockBackend } from '../mockData/mockBackend';

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
      return mockBackend.createAlarm(alarm);
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  },

  async update(id, alarm) {
    try {
      return mockBackend.updateAlarm(id, alarm);
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return mockBackend.deleteAlarm(id);
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  },

  async getCallTypes() {
    try {
      const types = mockBackend.getCallTypes();
      return { data: types };
    } catch (error) {
      console.error('Error fetching call types:', error);
      throw error;
    }
  },

  async getCarriers() {
    try {
      const carriers = mockBackend.getCarriers();
      return { data: carriers };
    } catch (error) {
      console.error('Error fetching carriers:', error);
      throw error;
    }
  },

  async getStatuses() {
    try {
      const statuses = mockBackend.getStatuses();
      return { data: statuses };
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  }
};