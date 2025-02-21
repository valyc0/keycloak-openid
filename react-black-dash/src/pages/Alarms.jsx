import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { alarmService } from '../services/api';
import CreateGenericModal from '../components/GenericCrud/CreateGenericModal';
import GenericTable from '../components/GenericCrud/GenericTable';
import GenericFilters from '../components/GenericCrud/GenericFilters';
import { Alarm } from '../types/models';

const Alarms = () => {
  const auth = useAuth();
  const [statusOptions, setStatusOptions] = useState([]);
  const [callTypeOptions, setCallTypeOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [totalAlarms, setTotalAlarms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchInputs, setSearchInputs] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [suggestions, setSuggestions] = useState({});

  const filterFields = [
    { key: 'caller_number', label: 'Caller Number', type: 'text' },
    { key: 'callee_number', label: 'Callee Number', type: 'text' },
    {
      key: 'call_type',
      label: 'Call Type',
      type: 'select',
      options: callTypeOptions.map(type => ({ value: type, label: type }))
    },
    {
      key: 'carrier',
      label: 'Carrier',
      type: 'select',
      options: carrierOptions.map(carrier => ({ value: carrier, label: carrier }))
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions.map(status => ({ value: status, label: status }))
    }
  ];

  const initialAlarmState = {
    caller_number: '',
    callee_number: '',
    call_type: '',
    carrier: '',
    duration_seconds: '',
    charge_amount: '',
    status: ''
  };

  const [newAlarm, setNewAlarm] = useState(initialAlarmState);
  const [editForm, setEditForm] = useState(initialAlarmState);

  // Filter handling functions
  const handleSearchInputChange = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
    // Generate suggestions based on the current data
    if (value.trim()) {
      const fieldSuggestions = alarms
        .map(alarm => alarm[field])
        .filter((val, index, self) => 
          val && 
          val.toString().toLowerCase().includes(value.toLowerCase()) &&
          self.indexOf(val) === index
        )
        .slice(0, 5);
      setSuggestions(prev => ({ ...prev, [field]: fieldSuggestions }));
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
    fetchAlarms({ [field]: value });
  };

  const handleSuggestionClick = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
    setFilters(prev => ({ ...prev, [field]: value }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setCurrentPage(1);
    fetchAlarms({ [field]: value });
  };

  const handleShowSuggestionsChange = (field, show) => {
    setShowSuggestions(prev => ({ ...prev, [field]: show }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchInputs({});
    setSuggestions({});
    setCurrentPage(1);
    fetchAlarms({});
  };

  // Fetch alarms data
  const fetchAlarms = async (newFilters = {}) => {
    setError(null);
    const currentFilters = { ...filters, ...newFilters };
    console.log('Fetching with params:', { currentPage, pageSize, sortBy, sortOrder, filters: currentFilters });
    try {
      const response = await alarmService.getAll({
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        ...currentFilters
      });
      console.log('Response:', response);
      setAlarms(response.data);
      setTotalAlarms(response.total);
      setError(null);
    } catch (err) {
      setError('Error fetching alarms');
      console.error(err);
    }
  };

  // Fetch options data
  const fetchOptions = async () => {
    try {
      const [statusRes, callTypeRes, carrierRes] = await Promise.all([
        alarmService.getStatuses(),
        alarmService.getCallTypes(),
        alarmService.getCarriers()
      ]);
      setStatusOptions(statusRes.data);
      setCallTypeOptions(callTypeRes.data);
      setCarrierOptions(carrierRes.data);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to fetch options data');
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchAlarms();
    }
  }, [currentPage, sortBy, sortOrder, auth?.isAuthenticated]);

  const handleCreate = async (e) => {
    e?.preventDefault();
    try {
      await alarmService.create({
        ...newAlarm,
        duration_seconds: parseInt(newAlarm.duration_seconds),
        charge_amount: parseFloat(newAlarm.charge_amount)
      });
      await fetchAlarms();
      setNewAlarm(initialAlarmState);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating alarm:', err);
      setError('Failed to create alarm');
    }
  };

  const handleEdit = async (e) => {
    e?.preventDefault();
    try {
      await alarmService.update(editingId, {
        ...editForm,
        duration_seconds: parseInt(editForm.duration_seconds),
        charge_amount: parseFloat(editForm.charge_amount)
      });
      await fetchAlarms();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating alarm:', err);
      setError('Failed to update alarm');
    }
  };

  const handleDelete = async (id) => {
    try {
      await alarmService.delete(id.toString());
      await fetchAlarms();
    } catch (err) {
      console.error('Error deleting alarm:', err);
      setError('Failed to delete alarm');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'caller_number', label: 'Caller Number' },
    { key: 'callee_number', label: 'Callee Number' },
    { key: 'call_type', label: 'Call Type' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'duration_seconds', label: 'Duration (s)' },
    { key: 'charge_amount', label: 'Charge ($)' },
    { key: 'status', label: 'Status' },
    { key: 'timestamp', label: 'Timestamp' }
  ];

  const fields = [
    { name: 'caller_number', label: 'Caller Number', type: 'text', required: true },
    { name: 'callee_number', label: 'Callee Number', type: 'text', required: true },
    {
      name: 'call_type',
      label: 'Call Type',
      type: 'select',
      options: callTypeOptions,
      required: true
    },
    {
      name: 'carrier',
      label: 'Carrier',
      type: 'select',
      options: carrierOptions,
      required: true
    },
    {
      name: 'duration_seconds',
      label: 'Duration (seconds)',
      type: 'number',
      required: true
    },
    {
      name: 'charge_amount',
      label: 'Charge Amount ($)',
      type: 'number',
      step: '0.01',
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      required: true
    }
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <strong className="card-title">Alarms Management</strong>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                title="Add New Alarm"
              >
                <i className="ti-plus"></i> Add Alarm
              </button>
            </div>
            <GenericFilters
              searchInputs={searchInputs}
              filters={filters}
              filterFields={filterFields}
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              onSearchInputChange={handleSearchInputChange}
              onFilterChange={handleFilterChange}
              onSuggestionClick={handleSuggestionClick}
              onShowSuggestionsChange={handleShowSuggestionsChange}
              onClearFilters={handleClearFilters}
            />
            <CreateGenericModal
              isOpen={isModalOpen}
              title={editingId ? "Edit Alarm" : "Add New Alarm"}
              fields={fields}
              onSubmit={editingId ? handleEdit : handleCreate}
              onClose={() => {
                setIsModalOpen(false);
                setNewAlarm(initialAlarmState);
                setEditingId(null);
              }}
              newGeneric={editingId ? editForm : newAlarm}
              onNewGenericChange={(field, value) => {
                if (editingId) {
                  setEditForm(prev => ({ ...prev, [field]: value }));
                } else {
                  setNewAlarm(prev => ({ ...prev, [field]: value }));
                }
              }}
            />
            <GenericTable
              columns={columns}
              data={alarms}
              onEdit={(item) => {
                setEditForm(item);
                setEditingId(item.id);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalAlarms}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(key) => {
                const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
                setSortBy(key);
                setSortOrder(newOrder);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alarms;