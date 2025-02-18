import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { mockUsers, mockTasks, getDashboardStats, mockAlarms, alarmOptions } from '../mockData/db';
import { 
  User, 
  Task, 
  DashboardStats, 
  PaginationParams, 
  UserFilters,
  PaginatedResponse,
  Alarm,
  AlarmFilters
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
  
  // Log the incoming request
  console.log(`[Mock API] Processing ${method?.toUpperCase()} ${path}`);

  // Handle alarm options endpoints first (most specific routes)
  if (method?.toLowerCase() === 'get') {
    if (path === '/alarms/call-types') {
      console.log('[Mock API] Handling call-types endpoint');
      const response = { data: alarmOptions.callTypes };
      console.log('[Mock API] Returning call types:', response);
      return delayResponse(response);
    }
    if (path === '/alarms/carriers') {
      console.log('[Mock API] Handling carriers endpoint');
      const response = { data: alarmOptions.carriers };
      console.log('[Mock API] Returning carriers:', response);
      return delayResponse(response);
    }
    if (path === '/alarms/statuses') {
      console.log('[Mock API] Handling statuses endpoint');
      const response = { data: alarmOptions.statuses };
      console.log('[Mock API] Returning statuses:', response);
      return delayResponse(response);
    }
  }

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
        
        // Apply filters and sorting
        let filteredUsers = [...mockUsers];
        
        // Filtering
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

        // Sorting
        if (params.sortBy) {
          const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
          filteredUsers.sort((a, b) => {
            const aValue = a[params.sortBy as keyof User];
            const bValue = b[params.sortBy as keyof User];
            
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

  // Handle all alarms endpoints
  if (path.startsWith('/alarms')) {
    if (method?.toLowerCase() === 'get') {

      // Then handle CRUD endpoints
      if (path === '/alarms') {
        // Handle pagination and filtering
        const params = config.params || {};
        const page = Number(params.page) || 1;
        const pageSize = Number(params.pageSize) || 10;
        
        // Apply filters and sorting
        let filteredAlarms = [...mockAlarms];
        
        // Filtering
        if (params.call_type) {
          filteredAlarms = filteredAlarms.filter(alarm => 
            alarm.call_type === params.call_type
          );
        }
        if (params.carrier) {
          filteredAlarms = filteredAlarms.filter(alarm => 
            alarm.carrier === params.carrier
          );
        }
        if (params.call_status) {
          filteredAlarms = filteredAlarms.filter(alarm => 
            alarm.call_status === params.call_status
          );
        }

        // Sorting
        if (params.sortBy) {
          const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
          filteredAlarms.sort((a, b) => {
            const aValue = a[params.sortBy as keyof Alarm];
            const bValue = b[params.sortBy as keyof Alarm];
            
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

        return delayResponse<PaginatedResponse<Alarm>>({
          data: paginatedAlarms,
          total: filteredAlarms.length,
          page,
          pageSize
        });
      }
      const call_id = path.split('/')[2];
      const alarm = mockAlarms.find(a => a.call_id === call_id);
      if (alarm) {
        return delayResponse<Alarm>(alarm);
      }
      throw new Error('Alarm not found');
    }
    if (method?.toLowerCase() === 'post') {
      const newAlarm: Alarm = { ...data, call_id: (Date.now()).toString() };
      mockAlarms.push(newAlarm);
      return delayResponse<Alarm>(newAlarm);
    }
    if (method?.toLowerCase() === 'put') {
      const call_id = path.split('/')[2];
      const index = mockAlarms.findIndex(a => a.call_id === call_id);
      if (index !== -1) {
        const updatedAlarm = { ...data, call_id };
        mockAlarms[index] = updatedAlarm;
        return delayResponse<Alarm>(updatedAlarm);
      }
      throw new Error('Alarm not found');
    }
    if (method?.toLowerCase() === 'delete') {
      const call_id = path.split('/')[2];
      const index = mockAlarms.findIndex(a => a.call_id === call_id);
      if (index !== -1) {
        mockAlarms.splice(index, 1);
        return delayResponse({ success: true });
      }
      throw new Error('Alarm not found');
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
