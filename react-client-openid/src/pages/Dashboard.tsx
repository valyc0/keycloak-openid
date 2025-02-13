import { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

import UsersChart from '../components/Charts/UsersChart';
import StatsCard from '../components/Dashboard/StatsCard';
import UsersTable from '../components/Dashboard/UsersTable';
import UserFilters from '../components/Dashboard/UserFilters';
import CreateUserForm from '../components/Dashboard/CreateUserForm';

import { User, DashboardStats, UserFilters as UserFiltersType } from '../types/models';
import { userService, dashboardService } from '../services/api';

const Dashboard = () => {
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    email: ''
  });
  const [filters, setFilters] = useState<UserFiltersType>({
    name: '',
    email: '',
    role: ''
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState({
    names: false,
    emails: false
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    sales: 0,
    templates: 0,
    totalUsers: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  // Load all users for suggestions
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const response = await userService.getAll({ page: 1, pageSize: 1000 });
        setAllUsers(response.data.data);
      } catch (err) {
        console.error('Failed to load users for suggestions:', err);
      }
    };
    if (auth.isAuthenticated) {
      loadAllUsers();
    }
  }, [auth.isAuthenticated]);

  // Calculate suggestions based on search inputs
  const suggestions = {
    names: searchInputs.name
      ? allUsers
          .map(user => user.name)
          .filter(name => 
            name.toLowerCase().includes(searchInputs.name.toLowerCase())
          )
          .slice(0, 5)
      : [],
    emails: searchInputs.email
      ? allUsers
          .map(user => user.email)
          .filter(email => 
            email.toLowerCase().includes(searchInputs.email.toLowerCase())
          )
          .slice(0, 5)
      : []
  };

  // Debounced filter update
  const debouncedSetFilters = useCallback(
    debounce((newFilters: UserFiltersType) => {
      setFilters(newFilters);
    }, 500),
    []
  );

  // Update filters when search inputs change
  useEffect(() => {
    setSearchLoading(true);
    debouncedSetFilters({
      ...filters,
      name: searchInputs.name,
      email: searchInputs.email
    });
    return () => {
      debouncedSetFilters.cancel();
    };
  }, [searchInputs]);

  // Fetch users data
  const fetchUsers = async (showLoader = true) => {
    if (showLoader) {
      setTableLoading(true);
    }
    try {
      const response = await userService.getAll({
        page: currentPage,
        pageSize,
        ...filters,
        sortBy,
        sortOrder
      });
      setUsers(response.data.data);
      setTotalUsers(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users data');
      console.error(err);
    } finally {
      if (showLoader) {
        setTableLoading(false);
      }
    }
  };

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    if (auth.isAuthenticated) {
      setInitialLoading(true);
      Promise.all([
        fetchUsers(false),
        fetchStats()
      ]).finally(() => {
        setInitialLoading(false);
      });
    }
  }, [auth.isAuthenticated]);

  // Handle users data updates
  useEffect(() => {
    if (auth.isAuthenticated && !initialLoading) {
      fetchUsers(true);
    }
  }, [currentPage, pageSize, filters, sortBy, sortOrder]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      setError('Please fill all fields');
      return;
    }
    try {
      setError(null);
      await userService.create(newUser);
      await fetchUsers();
      setNewUser({ name: '', email: '', role: '' });
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setError(null);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    
    try {
      setError(null);
      await userService.update(editingId, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role
      });
      await fetchUsers();
      setEditingId(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setError(null);
      await userService.delete(id);
      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* First Row: Chart and Stats */}
      <div className="row g-2">
        <div className="col-lg-3">
          <UsersChart users={users} />
        </div>
        <StatsCard stats={stats} />
      </div>

      {/* Users Management Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <strong className="card-title">Users Management</strong>
            </div>
            <div className="card-body">
              {/* Filters */}
              <UserFilters
                searchInputs={searchInputs}
                filters={filters}
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                onSearchInputChange={(field, value) => setSearchInputs(prev => ({ ...prev, [field]: value }))}
                onFilterChange={(field, value) => setFilters(prev => ({ ...prev, [field]: value }))}
                onSuggestionClick={(field, value) => {
                  setSearchInputs(prev => ({ ...prev, [field]: value }));
                  setFilters(prev => ({ ...prev, [field]: value }));
                  setShowSuggestions(prev => ({ ...prev, [field === 'name' ? 'names' : 'emails']: false }));
                }}
                onShowSuggestionsChange={(field, show) => 
                  setShowSuggestions(prev => ({ ...prev, [field]: show }))
                }
                onClearFilters={() => {
                  setSearchInputs({ name: '', email: '' });
                  setFilters({ name: '', email: '', role: '' });
                  setCurrentPage(1);
                }}
              />

              {/* Create Form */}
              <CreateUserForm
                newUser={newUser}
                onNewUserChange={(field, value) => setNewUser(prev => ({ ...prev, [field]: value }))}
                onCreateUser={handleCreate}
              />

              {/* Users Table */}
              <UsersTable
                users={users}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                editingId={editingId}
                editForm={editForm}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancelEdit={() => {
                  setEditingId(null);
                  setError(null);
                }}
                onDelete={handleDelete}
                onEditFormChange={(field, value) => setEditForm(prev => ({ ...prev, [field]: value }))}
                loading={tableLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalUsers}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
