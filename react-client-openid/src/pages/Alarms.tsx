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
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [totalAlarms, setTotalAlarms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('call_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    call_type: '',
    carrier: '',
    call_status: ''
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInputs] = useState<{ [key: string]: string }>({});
  const [showSuggestions] = useState<{ [key: string]: boolean }>({});
  const [suggestions] = useState<{ [key: string]: string[] }>({});

  const [newAlarm, setNewAlarm] = useState<{ [key: string]: string }>({
    caller_number: '',
    called_number: '',
    start_time: '',
    end_time: '',
    duration_seconds: '0',
    call_type: '',
    carrier: '',
    charge_amount: '0',
    call_status: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ [key: string]: string }>({
    caller_number: '',
    called_number: '',
    start_time: '',
    end_time: '',
    duration_seconds: '0',
    call_type: '',
    carrier: '',
    charge_amount: '0',
    call_status: ''
  });

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

  // Initial data load
  useEffect(() => {
    if (auth.isAuthenticated) {
      setInitialLoading(true);
      fetchAlarms(false).finally(() => {
        setInitialLoading(false);
      });
    }
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
      setNewAlarm({
        caller_number: '',
        called_number: '',
        start_time: '',
        end_time: '',
        duration_seconds: '0',
        call_type: '',
        carrier: '',
        charge_amount: '0',
        call_status: ''
      });
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create alarm');
      console.error(err);
    }
  };

  // Helper function to format date string for datetime-local input
  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  const handleEdit = (alarm: Alarm) => {
    setEditingId(alarm.call_id);
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
    setError(null);
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
              <GenericFilters
                searchInputs={searchInputs}
                filters={filters}
                filterFields={[
                  { 
                    key: 'call_type', 
                    label: 'Call Type', 
                    type: 'select',
                    options: [
                      { value: 'Internazionale', label: 'Internazionale' },
                      { value: 'Nazionale', label: 'Nazionale' },
                      { value: 'Locale', label: 'Locale' }
                    ]
                  },
                  { 
                    key: 'carrier', 
                    label: 'Carrier', 
                    type: 'select',
                    options: [
                      { value: 'CarrierX', label: 'CarrierX' },
                      { value: 'CarrierY', label: 'CarrierY' },
                      { value: 'CarrierZ', label: 'CarrierZ' }
                    ]
                  },
                  { 
                    key: 'call_status', 
                    label: 'Status', 
                    type: 'select',
                    options: [
                      { value: 'Completata', label: 'Completata' },
                      { value: 'Fallita', label: 'Fallita' }
                    ]
                  }
                ]}
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                onSearchInputChange={() => {}}
                onFilterChange={(field, value) => setFilters(prev => ({ ...prev, [field]: value }))}
                onSuggestionClick={() => {}}
                onShowSuggestionsChange={() => {}}
                onClearFilters={() => {
                  setFilters({
                    call_type: '',
                    carrier: '',
                    call_status: ''
                  });
                  setCurrentPage(1);
                }}
              />
  
              {/* Add Alarm Button */}
              <div className="mb-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add New Alarm
                </button>
              </div>
  
              {/* Create Alarm Modal */}
              <CreateGenericModal
                title="Add New Alarm"
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
                    options: [
                      { value: 'Internazionale', label: 'Internazionale' },
                      { value: 'Nazionale', label: 'Nazionale' },
                      { value: 'Locale', label: 'Locale' }
                    ]
                  },
                  { 
                    key: 'carrier', 
                    label: 'Carrier', 
                    type: 'select',
                    options: [
                      { value: 'CarrierX', label: 'CarrierX' },
                      { value: 'CarrierY', label: 'CarrierY' },
                      { value: 'CarrierZ', label: 'CarrierZ' }
                    ]
                  },
                  { key: 'charge_amount', label: 'Charge Amount', type: 'text' },
                  { 
                    key: 'call_status', 
                    label: 'Status', 
                    type: 'select',
                    options: [
                      { value: 'Completata', label: 'Completata' },
                      { value: 'Fallita', label: 'Fallita' }
                    ]
                  }
                ]}
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setNewAlarm({
                    caller_number: '',
                    called_number: '',
                    start_time: '',
                    end_time: '',
                    duration_seconds: '0',
                    call_type: '',
                    carrier: '',
                    charge_amount: '0',
                    call_status: ''
                  });
                }}
                newGeneric={newAlarm}
                onNewGenericChange={(field, value) => setNewAlarm(prev => ({ ...prev, [field]: value }))}
                onCreateGeneric={handleCreate}
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
                    render: (value) => {
                      const date = new Date(String(value));
                      return date.toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    }
                  },
                  { 
                    key: 'end_time', 
                    header: 'End Time', 
                    sortable: true, 
                    type: 'datetime-local',
                    render: (value) => {
                      const date = new Date(String(value));
                      return date.toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    }
                  },
                  { key: 'duration_seconds', header: 'Duration (s)', sortable: true },
                  { 
                    key: 'call_type', 
                    header: 'Type', 
                    sortable: true,
                    type: 'select',
                    options: [
                      { value: 'Internazionale', label: 'Internazionale' },
                      { value: 'Nazionale', label: 'Nazionale' },
                      { value: 'Locale', label: 'Locale' }
                    ]
                  },
                  { 
                    key: 'carrier', 
                    header: 'Carrier', 
                    sortable: true,
                    type: 'select',
                    options: [
                      { value: 'CarrierX', label: 'CarrierX' },
                      { value: 'CarrierY', label: 'CarrierY' },
                      { value: 'CarrierZ', label: 'CarrierZ' }
                    ]
                  },
                  { key: 'charge_amount', header: 'Charge (€)', sortable: true },
                  { 
                    key: 'call_status', 
                    header: 'Status', 
                    sortable: true,
                    type: 'select',
                    options: [
                      { value: 'Completata', label: 'Completata' },
                      { value: 'Fallita', label: 'Fallita' }
                    ],
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
