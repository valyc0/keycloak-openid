import React, { useState, useEffect } from 'react';
import { gatewayService } from '../../services/api';
import GenericTable from '../GenericCrud/GenericTable';
import GenericFilters from '../GenericCrud/GenericFilters';

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

  const getFilterFields = () => [
    { key: 'search', label: 'Search Gateway', type: 'text' }
  ];

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
    if (filters.search && filters.search.length >= 3) {
      fetchGateways();
    } else {
      setGateways([]);
      setTotalGateways(0);
    }
  }, [currentPage, sortBy, sortOrder, filters.search]);

  // Filter handling functions
  const handleSearchInputChange = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
    if (value.length >= 3) {
      setFilters(prev => ({ ...prev, [field]: value }));
      setCurrentPage(1);
    } else {
      setGateways([]);
      setTotalGateways(0);
    }
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
    { key: 'name', label: 'Gateway Name' },
    { key: 'serial', label: 'Serial Number' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (gateway) => (
        <span className={`badge badge-${gateway.status === 'Online' ? 'success' : 'danger'}`}>
          {gateway.status}
        </span>
      )
    }
  ];

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

        <GenericFilters
          searchInputs={searchInputs}
          filters={filters}
          filterFields={getFilterFields()}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          onSearchInputChange={handleSearchInputChange}
          onFilterChange={() => {}}
          onSuggestionClick={() => {}}
          onShowSuggestionsChange={() => {}}
          onClearFilters={handleClearFilters}
        />

        {!filters.search && (
          <div className="alert alert-info mt-3">
            <i className="fa fa-info-circle mr-2"></i>
            Type at least 3 characters to search for gateways
          </div>
        )}

        {filters.search && filters.search.length >= 3 && (
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
          />
        )}
      </div>
    </div>
  );
};

export default SelectGateway;