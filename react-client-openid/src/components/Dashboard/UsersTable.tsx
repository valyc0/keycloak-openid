import React from 'react';
import { User } from '../../types/models';
import TablePagination from './TablePagination';

interface UsersTableProps {
  users: User[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  editingId: number | null;
  editForm: { name: string; email: string; role: string };
  onEdit: (user: User) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onEditFormChange: (field: string, value: string) => void;
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  sortBy,
  sortOrder,
  onSort,
  editingId,
  editForm,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onEditFormChange,
  loading = false,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div>
      <div className="table-stats order-table ov-h position-relative">
        {loading && (
          <div className="position-absolute bg-white bg-opacity-75 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => onSort('id')} style={{ cursor: 'pointer' }}>
                # {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Avatar</th>
              <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => onSort('role')} style={{ cursor: 'pointer' }}>
                Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
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
                      onChange={(e) => onEditFormChange('name', e.target.value)}
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
                      onChange={(e) => onEditFormChange('email', e.target.value)}
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
                      onChange={(e) => onEditFormChange('role', e.target.value)}
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
                      <button className="btn btn-success btn-sm me-2" onClick={onUpdate}>
                        Save
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={onCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => onEdit(user)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(user.id)}>
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
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default UsersTable;
