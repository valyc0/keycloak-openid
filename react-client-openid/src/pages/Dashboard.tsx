import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: '/src/assets/images/avatar/1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatar: '/src/assets/images/avatar/2.jpg' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', avatar: '/src/assets/images/avatar/3.jpg' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  const handleCreate = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill all fields');
      return;
    }
    const avatar = `/src/assets/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`;
    setUsers([...users, { ...newUser, id: users.length + 1, avatar }]);
    setNewUser({ name: '', email: '', role: '' });
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = () => {
    setUsers(users.map(user => 
      user.id === editingId ? { ...user, ...editForm } : user
    ));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <>
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
                    <div className="stat-text">$<span>{users.length * 1000}</span></div>
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
                    <div className="stat-text"><span>{users.length * 2}</span></div>
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
                    <div className="stat-text"><span>{users.length}</span></div>
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
                    <div className="stat-text"><span>{users.length}</span></div>
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
                            <span className={`badge badge-${user.role === 'Admin' ? 'success' : 'primary'}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                              Save
                            </button>
                          ) : (
                            <>
                              <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(user)}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
