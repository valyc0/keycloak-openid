import React, { FC } from 'react';
import TablePagination from './TablePagination';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  type?: 'text' | 'email' | 'select' | 'datetime-local';
  options?: { value: string; label: string }[];
}

interface GenericTableProps<T> {
  items: T[];
  columns: Column<T>[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  editingId: number | string | null;
  editForm: Partial<T>;
  onEdit: (item: T) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onDelete: (id: number | string) => void;
  onEditFormChange: (field: string, value: string) => void;
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const GenericTable: FC<GenericTableProps<any>> = <T extends { id: number | string }>({
  items,
  columns,
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
}: GenericTableProps<T>) => {
  const renderEditField = (column: Column<T>) => {
    if (column.type === 'select' && column.options) {
      return (
        <select
          className="form-control"
          value={editForm[column.key] as string || ''}
          onChange={(e) => onEditFormChange(String(column.key), e.target.value)}
        >
          {column.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={column.type || 'text'}
        className="form-control"
        value={editForm[column.key] as string || ''}
        onChange={(e) => onEditFormChange(String(column.key), e.target.value)}
      />
    );
  };

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
              {columns.map(column => (
                <th 
                  key={String(column.key)} 
                  onClick={() => column.sortable ? onSort(String(column.key)) : undefined}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                >
                  {column.header} {column.sortable && sortBy === column.key && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={String(item.id)}>
                {columns.map(column => (
                  <td key={String(column.key)}>
                    {editingId === item.id ? (
                      renderEditField(column)
                    ) : (
                      column.render ? 
                        column.render(item[column.key], item) : 
                        String(item[column.key])
                    )}
                  </td>
                ))}
                <td>
                  {editingId === item.id ? (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-icon btn-success" 
                        onClick={onUpdate}
                        title="Save"
                      >
                        <i className="ti-save"></i>
                      </button>
                      <button 
                        className="btn btn-icon btn-secondary"
                        onClick={onCancelEdit}
                        title="Cancel"
                      >
                        <i className="ti-close"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-icon btn-info" 
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <i className="ti-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-icon btn-danger" 
                        onClick={() => onDelete(item.id)}
                        title="Delete"
                      >
                        <i className="ti-trash"></i>
                      </button>
                    </div>
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

export default GenericTable;
