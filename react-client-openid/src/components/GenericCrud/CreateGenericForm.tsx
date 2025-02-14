import React from 'react';

interface CreateUserFormProps {
  newUser: {
    name: string;
    email: string;
    role: string;
  };
  onNewUserChange: (field: string, value: string) => void;
  onCreateUser: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  newUser,
  onNewUserChange,
  onCreateUser
}) => {
  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => onNewUserChange('name', e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => onNewUserChange('email', e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <select
          className="form-control"
          value={newUser.role}
          onChange={(e) => onNewUserChange('role', e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="col-md-3">
        <button className="btn btn-primary" onClick={onCreateUser}>
          Add User
        </button>
      </div>
    </div>
  );
};

export default CreateUserForm;
