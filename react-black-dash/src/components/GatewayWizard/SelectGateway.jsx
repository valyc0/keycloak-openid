import React, { useState, useEffect } from 'react';
import { gatewayService } from '../../services/api';
import GenericTable from '../GenericCrud/GenericTable';
import GenericFilters from '../GenericCrud/GenericFilters';
import './GatewayWizard.css';

const SelectGateway = ({
  selectedGateway,
  onSelect,
}) => {
  const [gateways, setGateways] = useState([]);
  const [totalGateways, setTotalGateways] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchInputs, setSearchInputs] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch gateways data
  const fetchGateways = async (newFilters = {}) => {
    setError(null);
    setIsLoading(true);
    const searchQuery = newFilters.search || filters.search || '';
    
    try {
      const response = await gatewayService.searchGateways({
        query: searchQuery,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder
      });
      setGateways(response.data);
      setTotalGateways(response.total);
      setError(null);
    } catch (err) {
      setError('Error fetching gateways');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, [currentPage, sortBy, sortOrder, filters.search]);

  // Filter handling functions
  const handleSearchInputChange = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchInputs({});
    setSuggestions({});
    setCurrentPage(1);
    setGateways([]);
    setTotalGateways(0);
  };

  const columns = [
    {
      key: 'name',
      label: 'Gateway Name',
      style: { width: '35%' }
    },
    {
      key: 'serial',
      label: 'Serial Number',
      style: { width: '35%' }
    },
    {
      key: 'type',
      label: 'Type',
      style: { width: '15%' }
    },
    {
      key: 'status',
      label: 'Status',
      style: { width: '15%' },
      render: (gateway) => (
        <span className={`badge badge-${gateway.status === 'Online' ? 'success' : 'danger'}`}>
          {gateway.status}
        </span>
      )
    }
  ];

  const getFilterFields = () => [
    {
      key: 'search',
      label: 'Search by Name or Serial',
      type: 'text',
      placeholder: 'Type to search gateways...'
    }
  ];

  const getRowClassName = (item) => {
    return selectedGateway?.id === item.id ? 'table-primary' : '';
  };

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Select Gateway</strong>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search..."
            value={searchInputs.search || ''}
            onChange={(e) => handleSearchInputChange('search', e.target.value)}
            style={{ width: '200px' }}
          />
          <small className="text-muted">
            {isLoading ? (
              <span>
                <i className="fa fa-spinner fa-spin mr-1"></i>
                Searching...
              </span>
            ) : (
              <span>
                Found {totalGateways} gateways
                {filters.search ? ` matching "${filters.search}"` : ''}
              </span>
            )}
          </small>
        </div>

        <GenericTable
          columns={columns}
          data={gateways}
          onRowClick={(gateway) => onSelect(gateway)}
          selectedId={selectedGateway?.id}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalGateways}
          onPageChange={setCurrentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key) => {
            const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
            setSortBy(key);
            setSortOrder(newOrder);
          }}
          isLoading={isLoading}
          hoverable={true}
          showActions={false}
          displayOptions={{
            showEdit: false,
            showDelete: false,
            showActions: false
          }}
          getRowClassName={getRowClassName}
        />
      </div>
    </div>
  );
};

export default SelectGateway;