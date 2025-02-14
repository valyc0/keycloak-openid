import React, { FC } from 'react';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'select';
  options?: { value: string; label: string }[];
}

interface CreateGenericModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  newGeneric: { [key: string]: string };
  onNewGenericChange: (field: string, value: string) => void;
  onCreateGeneric: () => void;
}

const CreateGenericModal: FC<CreateGenericModalProps<any>> = ({
  isOpen,
  onClose,
  title,
  fields,
  newGeneric,
  onNewGenericChange,
  onCreateGeneric
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onCreateGeneric();
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog" style={{ marginTop: '100px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {fields.map(field => (
                <div key={field.key} className="mb-3">
                  <label htmlFor={field.key} className="form-label">{field.label}</label>
                  {field.type === 'select' && field.options ? (
                    <select
                      className="form-control"
                      id={field.key}
                      value={newGeneric[field.key] || ''}
                      onChange={(e) => onNewGenericChange(field.key, e.target.value)}
                    >
                      <option value="">{`Select ${field.label}`}</option>
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="form-control"
                      id={field.key}
                      value={newGeneric[field.key] || ''}
                      onChange={(e) => onNewGenericChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGenericModal;
