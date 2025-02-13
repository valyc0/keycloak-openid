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

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
}
