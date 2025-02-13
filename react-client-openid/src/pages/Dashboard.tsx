import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { User, DashboardStats, PaginationParams, UserFilters } from '../types/models';
import { userService, dashboardService } from '../services/api';

const Dashboard = () => {
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    email: ''
  });
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    email: '',
    role: ''
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState({
    names: false,
    emails: false
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load all users for suggestions once
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const response = await userService.getAll({
          page: 1,
          pageSize: 1000
        });
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
    debounce((newFilters: UserFilters) => {
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

  // Fetch paginated data
  const fetchData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        userService.getAll({
          page: currentPage,
          pageSize,
          ...filters
        }),
        dashboardService.getStats()
      ]);
      setUsers(usersResponse.data.data);
      setTotalUsers(usersResponse.data.total);
      setStats(statsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setInitialLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial load and pagination changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      if (!searchLoading) {
        setInitialLoading(true);
      }
      fetchData();
    }
  }, [auth.isAuthenticated, currentPage, pageSize, filters]);

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
      const response = await userService.create(newUser);
      setInitialLoading(true);
      await fetchData();
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
      
      setInitialLoading(true);
      await fetchData();
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
      setInitialLoading(true);
      await fetchData();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
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

      {/* Stats Widgets */}
      <div className="row">
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-five">
                <div className="stat-icon dib flat-color-1">
                  <i className="pe-7s-cash"></i>
                </div>
                <div className="stat-content">
                  <div className="text-left dib">
                    <div className="stat-text">$<span>{stats.revenue}</span></div>
                    <div className="stat-heading">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-five">
                <div className="stat-icon dib flat-color-2">
                  <i className="pe-7s-cart"></i>
                </div>
                <div className="stat-content">
                  <div className="text-left dib">
                    <div className="stat-text"><span>{stats.sales}</span></div>
                    <div className="stat-heading">Sales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-five">
                <div className="stat-icon dib flat-color-3">
                  <i className="pe-7s-browser"></i>
                </div>
                <div className="stat-content">
                  <div className="text-left dib">
                    <div className="stat-text"><span>{stats.templates}</span></div>
                    <div className="stat-heading">Templates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-five">
                <div className="stat-icon dib flat-color-4">
                  <i className="pe-7s-users"></i>
                </div>
                <div className="stat-content">
                  <div className="text-left dib">
                    <div className="stat-text"><span>{stats.totalUsers}</span></div>
                    <div className="stat-heading">Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by name"
                      value={searchInputs.name}
                      onChange={(e) => setSearchInputs({ ...searchInputs, name: e.target.value })}
                      onFocus={() => setShowSuggestions({ ...showSuggestions, names: true })}
                      onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, names: false }), 200)}
                    />
                    {showSuggestions.names && suggestions.names.length > 0 && (
                      <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000 }}>
                        {suggestions.names.map((name, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 cursor-pointer hover:bg-light"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSearchInputs({ ...searchInputs, name });
                              setFilters({ ...filters, name });
                              setShowSuggestions({ ...showSuggestions, names: false });
                            }}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by email"
                      value={searchInputs.email}
                      onChange={(e) => setSearchInputs({ ...searchInputs, email: e.target.value })}
                      onFocus={() => setShowSuggestions({ ...showSuggestions, emails: true })}
                      onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, emails: false }), 200)}
                    />
                    {showSuggestions.emails && suggestions.emails.length > 0 && (
                      <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000 }}>
                        {suggestions.emails.map((email, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 cursor-pointer hover:bg-light"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSearchInputs({ ...searchInputs, email });
                              setFilters({ ...filters, email });
                              setShowSuggestions({ ...showSuggestions, emails: false });
                            }}
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filters.role || ''}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setSearchInputs({ name: '', email: '' });
                      setFilters({ name: '', email: '', role: '' });
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Create Form */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-primary" onClick={handleCreate}>
                    Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="table-stats order-table ov-h">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Avatar</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div className="round-img">
                            <img className="rounded-circle" src={user.avatar} alt="" />
                          </div>
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <input
                              type="email"
                              className="form-control"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <select
                              className="form-control"
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            >
                              <option value="Admin">Admin</option>
                              <option value="User">User</option>
                            </select>
                          ) : (
                            <span className={`badge bg-${user.role === 'Admin' ? 'success' : 'primary'}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>
                                Save
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditingId(null);
                                  setError(null);
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(user)}>
                                Edit
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  <select
                    className="form-select"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {currentPage} of {Math.ceil(totalUsers / pageSize)}
                  </span>
                  <button
                    className="btn btn-outline-primary ms-2"
                    disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
