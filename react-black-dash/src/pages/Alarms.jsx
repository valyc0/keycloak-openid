import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../components/AuthProvider';
import { alarmService } from '../services/api';
import * as XLSX from 'xlsx';
import CreateGenericModal from '../components/GenericCrud/CreateGenericModal';
import GenericTable from '../components/GenericCrud/GenericTable';
import GenericFilters from '../components/GenericCrud/GenericFilters';

// Constants
const PAGE_SIZE = 10;
const INITIAL_SORT = { field: 'id', order: 'asc' };
const ERROR_MESSAGES = {
  FETCH: 'Failed to fetch alarms. Please try again later.',
  CREATE: 'Failed to create alarm. Please check your input and try again.',
  UPDATE: 'Failed to update alarm. Please check your input and try again.',
  DELETE: 'Failed to delete alarm. Please try again.',
  EXPORT: 'Failed to export data. Please try again.',
  OPTIONS: 'Failed to fetch options data. Please try again.'
};

const initialAlarmState = {
  caller_number: '',
  callee_number: '',
  callType: '',
  carrier: '',
  duration_seconds: '',
  charge_amount: '',
  status: ''
};

// Utility functions
const createSelectOptions = (options = []) => 
  Array.isArray(options) ? options.map(opt => ({ value: opt, label: opt })) : [];

const formatExcelData = (item) => ({
  ID: item.id,
  'Caller Number': item.caller_number,
  'Callee Number': item.callee_number,
  'Call Type': item.callType,
  'Carrier': item.carrier,
  'Duration (s)': item.duration_seconds,
  'Charge ($)': item.charge_amount,
  'Status': item.status,
  'Timestamp': item.timestamp
});

const Alarms = () => {
  const auth = useAuth();
  
  // State management with consolidated objects
  const [options, setOptions] = useState({
    status: [],
    callType: [],
    carrier: []
  });
  
  const [tableState, setTableState] = useState({
    data: [],
    total: 0,
    currentPage: 1,
    sort: INITIAL_SORT,
    isLoading: false
  });
  
  const [filterState, setFilterState] = useState({
    filters: {},
    searchInputs: {},
    showSuggestions: {},
    suggestions: {}
  });
  
  const [formState, setFormState] = useState({
    isModalOpen: false,
    editingId: null,
    newAlarm: initialAlarmState,
    editForm: initialAlarmState
  });
  
  const [error, setError] = useState(null);

  // Memoized values
  const getFilterFields = useMemo(() => [
    { key: 'caller_number', label: 'Caller Number', type: 'text' },
    { key: 'callee_number', label: 'Callee Number', type: 'text' },
    {
      key: 'callType',
      label: 'Call Type',
      type: 'select',
      options: createSelectOptions(options.callType)
    },
    {
      key: 'carrier',
      label: 'Carrier',
      type: 'select',
      options: createSelectOptions(options.carrier)
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: createSelectOptions(options.status)
    }
  ], [options]);

  const columns = useMemo(() => [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'caller_number', label: 'Caller Number', sortable: true },
    { key: 'callee_number', label: 'Callee Number', sortable: true },
    { key: 'callType', label: 'Call Type', sortable: true },
    { key: 'carrier', label: 'Carrier', sortable: true },
    { key: 'duration_seconds', label: 'Duration (s)', sortable: true },
    { key: 'charge_amount', label: 'Charge ($)', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true }
  ], []);

  const getFormFields = useMemo(() => [
    { name: 'caller_number', label: 'Caller Number', type: 'text', required: true },
    { name: 'callee_number', label: 'Callee Number', type: 'text', required: true },
    {
      name: 'callType',
      label: 'Call Type',
      type: 'select',
      options: createSelectOptions(options.callType),
      required: true
    },
    {
      name: 'carrier',
      label: 'Carrier',
      type: 'select',
      options: createSelectOptions(options.carrier),
      required: true
    },
    {
      name: 'duration_seconds',
      label: 'Duration (seconds)',
      type: 'number',
      min: 0,
      required: true
    },
    {
      name: 'charge_amount',
      label: 'Charge Amount ($)',
      type: 'number',
      step: '0.01',
      min: 0,
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: createSelectOptions(options.status),
      required: true
    }
  ], [options]);

  // Fetch handlers with improved error handling and loading states
  const fetchAlarms = useCallback(async (newFilters = {}) => {
    setError(null);
    setTableState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await alarmService.getAll({
        page: tableState.currentPage,
        pageSize: PAGE_SIZE,
        sortBy: tableState.sort.field,
        sortOrder: tableState.sort.order,
        ...filterState.filters,
        ...newFilters
      });

      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      
      setTableState(prev => ({
        ...prev,
        data: parsedResponse?.data || [],
        total: parsedResponse?.total || 0,
        isLoading: false
      }));
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH);
      console.error('Fetch error:', err);
      setTableState(prev => ({ ...prev, isLoading: false }));
    }
  }, [tableState.currentPage, tableState.sort, filterState.filters]);

  const fetchOptions = useCallback(async () => {
    try {
      const [statusRes, callTypeRes, carrierRes] = await Promise.all([
        alarmService.getStatuses(),
        alarmService.getCallTypes(),
        alarmService.getCarriers()
      ]);

      setOptions({
        status: statusRes || [],
        callType: callTypeRes || [],
        carrier: carrierRes || []
      });
    } catch (err) {
      console.error('Options fetch error:', err);
      setError(ERROR_MESSAGES.OPTIONS);
    }
  }, []);

  // Event handlers with improved error handling
  const handleSearchInputChange = useCallback(async (field, value) => {
    setFilterState(prev => ({
      ...prev,
      searchInputs: { ...prev.searchInputs, [field]: value }
    }));

    try {
      if (value.trim()) {
        const suggestionData = await alarmService.getSuggestions({ field, query: value });
        setFilterState(prev => ({
          ...prev,
          suggestions: { ...prev.suggestions, [field]: suggestionData }
        }));
      } else {
        setFilterState(prev => ({
          ...prev,
          suggestions: { ...prev.suggestions, [field]: [] }
        }));
      }
    } catch (err) {
      console.error('Suggestions fetch error:', err);
    }
  }, []);

  const handleExportToExcel = useCallback(async () => {
    setTableState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await alarmService.getAllForExport(filterState.filters);
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data.map(formatExcelData));
      
      XLSX.utils.book_append_sheet(wb, ws, 'Alarms');
      XLSX.writeFile(wb, 'alarms_export.xlsx');
    } catch (err) {
      console.error('Export error:', err);
      setError(ERROR_MESSAGES.EXPORT);
    } finally {
      setTableState(prev => ({ ...prev, isLoading: false }));
    }
  }, [filterState.filters]);

  const handleFormSubmit = useCallback(async (e) => {
    e?.preventDefault();
    const isEditing = !!formState.editingId;
    const data = isEditing ? formState.editForm : formState.newAlarm;

    try {
      if (isEditing) {
        await alarmService.update(formState.editingId, {
          ...data,
          duration_seconds: parseInt(data.duration_seconds),
          charge_amount: parseFloat(data.charge_amount)
        });
      } else {
        await alarmService.create({
          ...data,
          duration_seconds: parseInt(data.duration_seconds),
          charge_amount: parseFloat(data.charge_amount)
        });
      }

      await fetchAlarms();
      setFormState(prev => ({
        ...prev,
        isModalOpen: false,
        editingId: null,
        newAlarm: initialAlarmState,
        editForm: initialAlarmState
      }));
    } catch (err) {
      console.error(`${isEditing ? 'Update' : 'Create'} error:`, err);
      setError(isEditing ? ERROR_MESSAGES.UPDATE : ERROR_MESSAGES.CREATE);
    }
  }, [formState, fetchAlarms]);

  // Handle sorting with sortable column check
  const handleSort = useCallback((key) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setTableState(prev => ({
      ...prev,
      sort: {
        field: key,
        order: prev.sort.field === key && prev.sort.order === 'asc' ? 'desc' : 'asc'
      }
    }));
  }, [columns]);

  // Effects
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchAlarms();
    }
  }, [auth?.isAuthenticated, fetchAlarms]);

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
                onClick={() => setFormState(prev => ({ ...prev, isModalOpen: true }))}
                disabled={tableState.isLoading}
                title="Add New Alarm"
              >
                <i className="ti-plus"></i> Add Alarm
              </button>
            </div>
            <GenericFilters
              searchInputs={filterState.searchInputs}
              filters={filterState.filters}
              filterFields={getFilterFields}
              showSuggestions={filterState.showSuggestions}
              suggestions={filterState.suggestions}
              onSearchInputChange={handleSearchInputChange}
              onFilterChange={(field, value) => {
                setFilterState(prev => ({
                  ...prev,
                  filters: { ...prev.filters, [field]: value }
                }));
                setTableState(prev => ({ ...prev, currentPage: 1 }));
                fetchAlarms({ [field]: value });
              }}
              onSuggestionClick={(field, value) => {
                setFilterState(prev => ({
                  ...prev,
                  searchInputs: { ...prev.searchInputs, [field]: value },
                  filters: { ...prev.filters, [field]: value },
                  suggestions: { ...prev.suggestions, [field]: [] }
                }));
                setTableState(prev => ({ ...prev, currentPage: 1 }));
                fetchAlarms({ [field]: value });
              }}
              onShowSuggestionsChange={(field, show) => {
                setFilterState(prev => ({
                  ...prev,
                  showSuggestions: { ...prev.showSuggestions, [field]: show }
                }));
              }}
              onClearFilters={useCallback(async () => {
                setFilterState({
                  filters: {},
                  searchInputs: {},
                  showSuggestions: {},
                  suggestions: {}
                });
                setTableState(prev => ({ ...prev, currentPage: 1 }));
                await fetchAlarms({});
              }, [fetchAlarms])}
            />
            <div className="mt-3 mb-3 d-flex align-items-center gap-3">
              <div className="text-white">
                <strong>Total Records:</strong> {tableState.total}
              </div>
              <img
                src="/assets/excel-icon.png"
                alt="Export to Excel"
                onClick={handleExportToExcel}
                style={{
                  width: '23px',
                  height: '23px',
                  cursor: tableState.isLoading ? 'not-allowed' : 'pointer',
                  marginLeft: '10px',
                  opacity: tableState.isLoading ? 0.5 : 1
                }}
                title="Export filtered data to Excel"
                disabled={tableState.isLoading}
              />
            </div>
            <CreateGenericModal
              isOpen={formState.isModalOpen}
              title={formState.editingId ? "Edit Alarm" : "Add New Alarm"}
              fields={getFormFields}
              onSubmit={handleFormSubmit}
              onClose={() => {
                setFormState(prev => ({
                  ...prev,
                  isModalOpen: false,
                  editingId: null,
                  newAlarm: initialAlarmState,
                  editForm: initialAlarmState
                }));
              }}
              newGeneric={formState.editingId ? formState.editForm : formState.newAlarm}
              onNewGenericChange={(field, value) => {
                setFormState(prev => ({
                  ...prev,
                  [formState.editingId ? 'editForm' : 'newAlarm']: {
                    ...prev[formState.editingId ? 'editForm' : 'newAlarm'],
                    [field]: value
                  }
                }));
              }}
            />
            <GenericTable
              columns={columns}
              data={tableState.data}
              onEdit={(item) => {
                setFormState(prev => ({
                  ...prev,
                  editForm: item,
                  editingId: item.id,
                  isModalOpen: true
                }));
              }}
              onDelete={async (id) => {
                try {
                  await alarmService.delete(id.toString());
                  await fetchAlarms();
                } catch (err) {
                  console.error('Delete error:', err);
                  setError(ERROR_MESSAGES.DELETE);
                }
              }}
              currentPage={tableState.currentPage}
              pageSize={PAGE_SIZE}
              totalItems={tableState.total}
              onPageChange={(page) => setTableState(prev => ({ ...prev, currentPage: page }))}
              sortBy={tableState.sort.field}
              sortOrder={tableState.sort.order}
              onSort={handleSort}
              isLoading={tableState.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Alarms.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool
  })
};

export default Alarms;
