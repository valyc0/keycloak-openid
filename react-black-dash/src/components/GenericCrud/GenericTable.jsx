import React from 'react';
import styles from './GenericTable.module.css';

const GenericTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  isLoading
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatValue = (value, column) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    // Format timestamps to be more compact
    if (column.key === 'timestamp') {
      const date = new Date(value);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Format numbers
    if (column.key === 'duration_seconds') {
      return `${value}s`;
    }
    if (column.key === 'charge_amount') {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    return value.toString();
  };

  // Get column width based on content type
  const getColumnWidth = (column) => {
    switch (column.key) {
      case 'id':
        return 'width: 60px';
      case 'duration_seconds':
      case 'charge_amount':
        return 'width: 100px';
      case 'status':
        return 'width: 100px';
      case 'timestamp':
        return 'width: 160px';
      default:
        return '';
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // Add First Page button
    pages.push(
      <li key="first" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
      </li>
    );

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add ellipsis at the start if needed
    if (startPage > 1) {
      pages.push(
        <li key="ellipsis-start" className="page-item disabled">
          <button className="page-link">...</button>
        </li>
      );
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button
            className={`page-link ${currentPage === i ? styles.activeButton : ''}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add ellipsis at the end if needed
    if (endPage < totalPages) {
      pages.push(
        <li key="ellipsis-end" className="page-item disabled">
          <button className="page-link">...</button>
        </li>
      );
    }

    // Add Last Page button
    pages.push(
      <li key="last" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </li>
    );

    return pages;
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column.key) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      {isLoading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className={`table-responsive ${isLoading ? 'opacity-50' : ''}`}>
        <table className="table table-striped w-100">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => onSort && onSort(column.key)}
                  style={{
                    userSelect: 'none',
                    position: 'relative',
                    paddingRight: '25px',
                    cursor: onSort ? 'pointer' : 'default',
                    ...(getColumnWidth(column) && { style: getColumnWidth(column) })
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      cursor: onSort ? 'pointer' : 'default',
                      padding: '4px 0',
                      userSelect: 'none'
                    }}
                  >
                    {column.label}
                    <span style={{
                      color: sortBy === column.key ? '#0d6efd' : '#666',
                      marginLeft: '8px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {renderSortIcon(column)}
                    </span>
                  </div>
                </th>
              ))}
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`${item.id}-${column.key}`}>
                    {formatValue(item[column.key], column)}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-link text-warning p-0 ms-2"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-link text-danger p-0 ms-2"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        onDelete(item.id);
                      }
                    }}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <nav className={styles.paginationContainer}>
          <ul className={`pagination ${styles.pagination}`}>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {renderPagination()}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default GenericTable;