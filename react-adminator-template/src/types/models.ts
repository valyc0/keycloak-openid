export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userId: number;
}

export interface DashboardStats {
  revenue: number;
  sales: number;
  templates: number;
  totalUsers: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams extends SortParams {
  page: number;
  pageSize: number;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
}

export interface Alarm {
  call_id: string;
  caller_number: string;
  called_number: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  call_type: string;
  carrier: string;
  charge_amount: number;
  call_status: string;
}

export interface AlarmFilters {
  call_type?: string;
  carrier?: string;
  call_status?: string;
}
