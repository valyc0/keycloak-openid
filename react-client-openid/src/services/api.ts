import api from './mockBackend';
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

// User services
export const userService = {
  getAll: (params?: PaginationParams & UserFilters) => 
    api.get<PaginatedResponse<User>>('/users', { params }),
  getById: (id: number) => 
    api.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id' | 'avatar'>) => 
    api.post<User>('/users', user),
  update: (id: number, user: Omit<User, 'id' | 'avatar'>) => 
    api.put<User>(`/users/${id}`, user),
  delete: (id: number) => 
    api.delete(`/users/${id}`)
};

// Task services
export const taskService = {
  getAll: () => api.get<Task[]>('/tasks'),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (task: Omit<Task, 'id'>) => api.post<Task>('/tasks', task),
  update: (id: number, task: Omit<Task, 'id'>) => api.put<Task>(`/tasks/${id}`, task),
  delete: (id: number) => api.delete(`/tasks/${id}`)
};

// Dashboard services
export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats')
};

// Alarm services
export const alarmService = {
  getAll: (params?: PaginationParams & AlarmFilters) => 
    api.get<PaginatedResponse<Alarm>>('/alarms', { params }),
  getById: (id: string) => 
    api.get<Alarm>(`/alarms/${id}`),
  create: (alarm: Omit<Alarm, 'call_id'>) => 
    api.post<Alarm>('/alarms', alarm),
  update: (id: string, alarm: Omit<Alarm, 'call_id'>) => 
    api.put<Alarm>(`/alarms/${id}`, alarm),
  delete: (id: string) => 
    api.delete(`/alarms/${id}`)
};
