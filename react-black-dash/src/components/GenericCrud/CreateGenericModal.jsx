import React, { useEffect, useRef } from 'react';
import styles from './CreateGenericModal.module.css';

const CreateGenericModal = ({
  isOpen,
  title,
  fields,
  onSubmit,
  onClose,
  newGeneric,
  onNewGenericChange
}) => {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the first input when modal opens
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const renderField = (field) => {
    const isFirstField = fields.indexOf(field) === 0;
    const commonProps = {
      id: field.name,
      name: field.name,
      value: newGeneric[field.name] || '',
      onChange: (e) => onNewGenericChange(field.name, e.target.value),
      className: 'form-control',
      required: field.required,
      // Remove auto-focus behavior
      ref: null
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps} className={`form-control ${styles.customSelect}`}>
            <option value="">Select {field.label}</option>
            {(field.options || []).map((option) => (
              <option key={typeof option === 'object' ? option.value : option} value={typeof option === 'object' ? option.value : option}>
                {typeof option === 'object' ? option.label : option}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return <textarea {...commonProps} rows={3} />;

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            step={field.step || '1'}
            min={field.min}
            max={field.max}
          />
        );

      case 'checkbox':
        return (
          <input
            {...commonProps}
            type="checkbox"
            checked={newGeneric[field.name] || false}
            onChange={(e) => onNewGenericChange(field.name, e.target.checked)}
          />
        );

      default:
        return <input {...commonProps} type={field.type || 'text'} />;
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1040,
        display: isOpen ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="modal-dialog"
        role="document"
        ref={modalRef}
        style={{
          zIndex: 1050,
          position: 'relative'
        }}
      >
        <div
          className={`modal-content ${styles.modalContent}`}
          style={{
            cursor: 'default',
            boxShadow: '0 5px 15px rgba(0,0,0,.5)',
            position: 'relative',
            backgroundColor: '#fff'
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fields.map((field) => (
                <div key={field.name} className="mb-3">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGenericModal;