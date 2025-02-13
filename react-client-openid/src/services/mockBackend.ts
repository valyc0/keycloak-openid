import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { mockUsers, mockTasks, getDashboardStats } from '../mockData/db';
import { 
  User, 
  Task, 
  DashboardStats, 
  PaginationParams, 
  UserFilters,
  PaginatedResponse 
} from '../types/models';

// Create axios instance
const api = axios.create({
  baseURL: '/api'
});

// Response delay to simulate network latency
const DELAY = 500;

// Helper to create delayed response
const delayResponse = <T>(data: T): Promise<AxiosResponse<T>> => {
  return new Promise(resolve => 
    setTimeout(() => 
      resolve({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      }), 
      DELAY
    )
  );
};

// Helper to parse request data
const parseData = (data: any) => {
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
const mockApiHandler = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const { method, url } = config;
  const data = parseData(config.data);

  // Remove baseURL from url for processing
  const path = url?.replace('/api', '') || '';

  // Dashboard endpoints
  if (path === '/dashboard/stats') {
    if (method?.toLowerCase() === 'get') {
      return delayResponse<DashboardStats>(getDashboardStats());
    }
  }

  // Users endpoints
  if (path.startsWith('/users')) {
    if (method?.toLowerCase() === 'get') {
      if (path === '/users') {
        // Handle pagination and filtering
        const params = config.params || {};
        const page = Number(params.page) || 1;
        const pageSize = Number(params.pageSize) || 10;
        
        // Apply filters
        let filteredUsers = [...mockUsers];
        if (params.name) {
          filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(params.name.toLowerCase())
          );
        }
        if (params.email) {
          filteredUsers = filteredUsers.filter(user => 
            user.email.toLowerCase().includes(params.email.toLowerCase())
          );
        }
        if (params.role) {
          filteredUsers = filteredUsers.filter(user => 
            user.role === params.role
          );
        }

        // Calculate pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedUsers = filteredUsers.slice(start, end);

        return delayResponse<PaginatedResponse<User>>({
          data: paginatedUsers,
          total: filteredUsers.length,
          page,
          pageSize
        });
      }
      const id = parseInt(path.split('/')[2]);
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        return delayResponse<User>(user);
      }
      throw new Error('User not found');
    }
    if (method?.toLowerCase() === 'post') {
      const avatar = `/src/assets/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`;
      const newUser: User = { ...data, id: mockUsers.length + 1, avatar };
      mockUsers.push(newUser);
      return delayResponse<User>(newUser);
    }
    if (method?.toLowerCase() === 'put') {
      const id = parseInt(path.split('/')[2]);
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        const existingUser = mockUsers[index];
        const updatedUser = {
          ...existingUser,
          ...data,
          id,
          avatar: existingUser.avatar // Preserve the existing avatar
        };
        mockUsers[index] = updatedUser;
        return delayResponse<User>(updatedUser);
      }
      throw new Error('User not found');
    }
    if (method?.toLowerCase() === 'delete') {
      const id = parseInt(path.split('/')[2]);
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        return delayResponse({ success: true });
      }
      throw new Error('User not found');
    }
  }

  // Tasks endpoints
  if (path.startsWith('/tasks')) {
    if (method?.toLowerCase() === 'get') {
      if (path === '/tasks') {
        return delayResponse<Task[]>(mockTasks);
      }
      const id = parseInt(path.split('/')[2]);
      const task = mockTasks.find(t => t.id === id);
      if (task) {
        return delayResponse<Task>(task);
      }
      throw new Error('Task not found');
    }
    if (method?.toLowerCase() === 'post') {
      const newTask: Task = { ...data, id: mockTasks.length + 1 };
      mockTasks.push(newTask);
      return delayResponse<Task>(newTask);
    }
    if (method?.toLowerCase() === 'put') {
      const id = parseInt(path.split('/')[2]);
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        const updatedTask = { ...data, id };
        mockTasks[index] = updatedTask;
        return delayResponse<Task>(updatedTask);
      }
      throw new Error('Task not found');
    }
    if (method?.toLowerCase() === 'delete') {
      const id = parseInt(path.split('/')[2]);
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTasks.splice(index, 1);
        return delayResponse({ success: true });
      }
      throw new Error('Task not found');
    }
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

export default api;
