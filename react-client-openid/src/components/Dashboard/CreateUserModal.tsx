import React from 'react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  newUser: {
    name: string;
    email: string;
    role: string;
  };
  onNewUserChange: (field: string, value: string) => void;
  onCreateUser: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  newUser,
  onNewUserChange,
  onCreateUser
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onCreateUser();
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => onNewUserChange('name', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => onNewUserChange('email', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-control"
                  id="role"
                  value={newUser.role}
                  onChange={(e) => onNewUserChange('role', e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add User</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserModal;
