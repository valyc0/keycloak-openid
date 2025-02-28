import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const SearchableTable = ({ data, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower) ||
      item.model.toLowerCase().includes(searchLower) ||
      item.serialNumber.toLowerCase().includes(searchLower)
    );
  }, [data, searchTerm]);

  return (
    <div>
      {/* Search Input */}
      <div className="search-input-container">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search meters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Meters Table */}
      <div className="table-responsive">
        <table className="meters-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Model</th>
              <th>Serial Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(meter => (
                <tr key={meter.id} className="meter-item">
                  <td>{meter.name}</td>
                  <td>
                    <span className="badge badge-primary">{meter.type}</span>
                  </td>
                  <td>{meter.model}</td>
                  <td>
                    <code>{meter.serialNumber}</code>
                  </td>
                  <td>
                    <button
                      className="action-button add"
                      onClick={() => onSelect(meter)}
                      data-tooltip="Add meter"
                    >
                      <i className="fa fa-plus-circle"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted p-4">
                  {searchTerm ? (
                    <>
                      <i className="fa fa-search mr-2"></i>
                      No meters found matching "{searchTerm}"
                    </>
                  ) : (
                    <>
                      <i className="fa fa-info-circle mr-2"></i>
                      No meters available
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

SearchableTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      serialNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default React.memo(SearchableTable);