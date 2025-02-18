import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import GenericTable from '../components/GenericCrud/GenericTable';
import GenericFilters from '../components/GenericCrud/GenericFilters';
import CreateGenericModal from '../components/GenericCrud/CreateGenericModal';

import { Alarm } from '../types/models';
import { alarmService } from '../services/api';

const Alarms = () => {
  const auth = useAuth();
  const [callTypeOptions, setCallTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [carrierOptions, setCarrierOptions] = useState<{ value: string; label: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [totalAlarms, setTotalAlarms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('call_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const initialFilters = {
    call_type: '',
    carrier: '',
    call_status: ''
  };

  const [filters, setFilters] = useState<{ [key: string]: string }>(initialFilters);
  const [tableLoading, setTableLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInputs] = useState<{ [key: string]: string }>({});
  const [showSuggestions] = useState<{ [key: string]: boolean }>({});
  const [suggestions] = useState<{ [key: string]: string[] }>({});

  const initialAlarmState = {
    caller_number: '',
    called_number: '',
    start_time: '',
    end_time: '',
    duration_seconds: '0',
    call_type: '',
    carrier: '',
    charge_amount: '0',
    call_status: ''
  };

  const [newAlarm, setNewAlarm] = useState<{ [key: string]: string }>(initialAlarmState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ [key: string]: string }>(initialAlarmState);

  // Fetch alarms data
  const fetchAlarms = async (showLoader = true) => {
    if (showLoader) {
      setTableLoading(true);
    }
    try {
      const response = await alarmService.getAll({
        page: currentPage,
        pageSize,
        ...filters,
        sortBy,
        sortOrder
      });
      setAlarms(response.data.data);
      setTotalAlarms(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch alarms data');
      console.error(err);
    } finally {
      if (showLoader) {
        setTableLoading(false);
      }
    }
  };

  // Fetch options data with retry
  const fetchOptions = async (retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    try {
      const [callTypesRes, carriersRes, statusesRes] = await Promise.all([
        alarmService.getCallTypes(),
        alarmService.getCarriers(),
        alarmService.getStatuses()
      ]);

      console.log(`[Options Fetch] Attempt ${retryCount + 1}/${maxRetries + 1}`);
      console.log('Raw API responses:', { callTypesRes, carriersRes, statusesRes });

      // Extract actual data from the nested response structure
      const callTypes = callTypesRes.data?.data;
      const carriers = carriersRes.data?.data;
      const statuses = statusesRes.data?.data;

      console.log('Extracted options data:', { callTypes, carriers, statuses });

      let hasValidData = false;

      if (Array.isArray(callTypes) && callTypes.length > 0) {
        setCallTypeOptions(callTypes);
        hasValidData = true;
      } else {
        console.error('Invalid call types data:', callTypesRes);
      }

      if (Array.isArray(carriers) && carriers.length > 0) {
        setCarrierOptions(carriers);
        hasValidData = true;
      } else {
        console.error('Invalid carriers data:', carriersRes);
      }

      if (Array.isArray(statuses) && statuses.length > 0) {
        setStatusOptions(statuses);
        hasValidData = true;
      } else {
        console.error('Invalid statuses data:', statusesRes);
      }

      // If no valid data and still have retries left, try again
      if (!hasValidData && retryCount < maxRetries) {
        console.log(`Retrying options fetch (attempt ${retryCount + 2}/${maxRetries + 1})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        await fetchOptions(retryCount + 1);
      }

    } catch (err) {
      console.error('Failed to fetch options:', err);
      if (retryCount < maxRetries) {
        console.log(`Retrying after error (attempt ${retryCount + 2}/${maxRetries + 1})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        await fetchOptions(retryCount + 1);
      } else {
        setError('Failed to fetch options data after multiple attempts. Please check console for details.');
      }
    }
  };

  // Separate effect for options
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchOptions();
    }
  }, [auth.isAuthenticated]);

  // Initial data load
  useEffect(() => {
    if (auth.isAuthenticated) {
      setInitialLoading(true);
      fetchAlarms(false).finally(() => {
        setInitialLoading(false);
      });
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      setCallTypeOptions([]);
      setCarrierOptions([]);
      setStatusOptions([]);
      setAlarms([]);
      setTotalAlarms(0);
      setError(null);
    };
  }, [auth.isAuthenticated]);

  // Handle alarms data updates
  useEffect(() => {
    if (auth.isAuthenticated && !initialLoading) {
      fetchAlarms(true);
    }
  }, [currentPage, pageSize, filters, sortBy, sortOrder]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Monitor options state changes
  useEffect(() => {
    console.log('Options state updated:', {
      callTypeOptions,
      carrierOptions,
      statusOptions
    });
  }, [callTypeOptions, carrierOptions, statusOptions]);

  const handleCreate = async () => {
    if (!newAlarm.caller_number || !newAlarm.called_number || !newAlarm.call_type) {
      setError('Please fill all required fields');
      return;
    }
    try {
      setError(null);
      await alarmService.create({
        ...newAlarm,
        duration_seconds: parseInt(newAlarm.duration_seconds),
        charge_amount: parseFloat(newAlarm.charge_amount)
      } as Omit<Alarm, 'call_id'>);
      await fetchAlarms();
      setNewAlarm(initialAlarmState);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create alarm');
      console.error(err);
    }
  };

  // Helper functions for date formatting
  // Format date for the datetime-local input
  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  // Format date for display in the table
  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (alarm: Alarm) => {
    setEditForm({
      caller_number: alarm.caller_number,
      called_number: alarm.called_number,
      start_time: formatDateForInput(alarm.start_time),
      end_time: formatDateForInput(alarm.end_time),
      duration_seconds: alarm.duration_seconds.toString(),
      call_type: alarm.call_type,
      carrier: alarm.carrier,
      charge_amount: alarm.charge_amount.toString(),
      call_status: alarm.call_status
    });
    setIsModalOpen(true); // Open the modal
    setError(null);
    setEditingId(alarm.call_id); // Set the editing ID
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    
    try {
      setError(null);
      await alarmService.update(editingId, {
        ...editForm,
        duration_seconds: parseInt(editForm.duration_seconds),
        charge_amount: parseFloat(editForm.charge_amount)
      } as Omit<Alarm, 'call_id'>);
      await fetchAlarms();
      setEditingId(null);
    } catch (err) {
      setError('Failed to update alarm');
      console.error(err);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this alarm?')) return;
    
    try {
      setError(null);
      await alarmService.delete(id.toString());
      await fetchAlarms();
    } catch (err) {
      setError('Failed to delete alarm');
      console.error(err);
    }
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
  
      {/* Alarms Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <strong className="card-title">Alarms Management</strong>
            </div>
            <div className="card-body">
              {/* Filters */}
              {/* Ensure we have options */}
              <button 
                onClick={() => fetchOptions()} 
                className="btn btn-secondary mb-3"
              >
                Refresh Options
              </button>
              <GenericFilters
                searchInputs={searchInputs}
                filters={filters}
                filterFields={[
                  { 
                    key: 'call_type', 
                    label: 'Call Type', 
                    type: 'select',
                    options: callTypeOptions
                  },
                  { 
                    key: 'carrier', 
                    label: 'Carrier', 
                    type: 'select',
                    options: carrierOptions
                  },
                  { 
                    key: 'call_status', 
                    label: 'Status', 
                    type: 'select',
                    options: statusOptions
                  }
                ]}
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                onSearchInputChange={() => {}}
                onFilterChange={(field, value) => setFilters(prev => ({ ...prev, [field]: value }))}
                onSuggestionClick={() => {}}
                onShowSuggestionsChange={() => {}}
                onClearFilters={() => {
                  setFilters(initialFilters);
                  setCurrentPage(1);
                }}
              />
  
              {/* Add Alarm Button */}
              <div className="mb-4">
                <button 
                  className="btn btn-icon btn-primary"
                  onClick={() => setIsModalOpen(true)}
                  title="Add New Alarm"
                >
                  <i className="ti-plus"></i>
                </button>
              </div>
  
              {/* Create Alarm Modal */}
              <CreateGenericModal
                title={editingId ? "Edit Alarm" : "Add New Alarm"}
                fields={[
                  { key: 'caller_number', label: 'Caller Number', type: 'text' },
                  { key: 'called_number', label: 'Called Number', type: 'text' },
                  { key: 'start_time', label: 'Start Time', type: 'datetime-local' },
                  { key: 'end_time', label: 'End Time', type: 'datetime-local' },
                  { key: 'duration_seconds', label: 'Duration (seconds)', type: 'text' },
                  {
                    key: 'call_type',
                    label: 'Call Type',
                    type: 'select',
                    options: callTypeOptions
                  },
                  {
                    key: 'carrier',
                    label: 'Carrier',
                    type: 'select',
                    options: carrierOptions
                  },
                  { key: 'charge_amount', label: 'Charge Amount', type: 'text' },
                  {
                    key: 'call_status',
                    label: 'Status',
                    type: 'select',
                    options: statusOptions
                  }
                ]}
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setNewAlarm(initialAlarmState);
                  setEditingId(null); // Clear editing ID on close
                }}
                newGeneric={editingId ? editForm : newAlarm}
                onNewGenericChange={(field, value) => {
                  if (editingId) {
                    setEditForm(prev => ({ ...prev, [field]: value }));
                  } else {
                    setNewAlarm(prev => ({ ...prev, [field]: value }));
                  }
                }}
                onCreateGeneric={editingId ? handleUpdate : handleCreate}
              />
  
              {/* Alarms Table */}
              <GenericTable
                items={alarms.map(alarm => ({ ...alarm, id: alarm.call_id }))}
                columns={[
                  { key: 'call_id', header: 'Call ID', sortable: true },
                  { key: 'caller_number', header: 'Caller', sortable: true },
                  { key: 'called_number', header: 'Called', sortable: true },
                  { 
                    key: 'start_time', 
                    header: 'Start Time', 
                    sortable: true, 
                    type: 'datetime-local',
                    render: (value) => formatDateForDisplay(String(value))
                  },
                  { 
                    key: 'end_time', 
                    header: 'End Time', 
                    sortable: true, 
                    type: 'datetime-local',
                    render: (value) => formatDateForDisplay(String(value))
                  },
                  { key: 'duration_seconds', header: 'Duration (s)', sortable: true },
                  { 
                    key: 'call_type', 
                    header: 'Type', 
                    sortable: true,
                    type: 'select',
                    options: callTypeOptions
                  },
                  { 
                    key: 'carrier', 
                    header: 'Carrier', 
                    sortable: true,
                    type: 'select',
                    options: carrierOptions
                  },
                  { key: 'charge_amount', header: 'Charge (€)', sortable: true },
                  { 
                    key: 'call_status', 
                    header: 'Status', 
                    sortable: true,
                    type: 'select',
                    options: statusOptions,
                    render: (value) => (
                      <span className={`badge bg-${String(value) === 'Completata' ? 'success' : 'danger'}`}>
                        {value}
                      </span>
                    )
                  }
                ]}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                editingId={editingId}
                editForm={editForm}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancelEdit={() => {
                  setEditingId(null);
                  setError(null);
                }}
                onDelete={handleDelete}
                onEditFormChange={(field, value) => setEditForm(prev => ({ ...prev, [field]: value }))}
                loading={tableLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalAlarms}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alarms;
