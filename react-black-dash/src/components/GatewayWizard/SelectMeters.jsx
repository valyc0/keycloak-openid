import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { gatewayService } from '../../services/api';
import SearchableTable from './SearchableTable';
import './GatewayWizard.css';

const SelectMeters = ({
  selectedMeters,
  onMeterSelect,
  onMeterParametersInit,
  onMeterRemove,
}) => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchMeters = async () => {
      try {
        setLoading(true);
        const response = await gatewayService.getMeters(abortController.signal);
        // Only update state if component is still mounted
        if (!abortController.signal.aborted) {
          setMeters(response.data.data);
          setLoading(false);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching meters:', err);
          setError('Failed to load meters');
          setLoading(false);
        }
      }
    };

    fetchMeters();

    // Cleanup function to abort fetch on unmount or re-fetch
    return () => {
      abortController.abort();
    };
  }, []); // Empty deps array since we only want to fetch once

  const handleMeterAdd = useCallback((meter) => {
    const isAlreadySelected = selectedMeters.some(
      (m) => String(m.id) === String(meter.id)
    );

    if (!isAlreadySelected) {
      onMeterSelect(meter);
      onMeterParametersInit(meter.id);
    }
  }, [selectedMeters, onMeterSelect, onMeterParametersInit]);

  // Memoize filtered meters to prevent unnecessary recalculations
  const availableMeters = useMemo(() => 
    meters.filter(m => !selectedMeters.some(sm => String(sm.id) === String(m.id))),
    [meters, selectedMeters]
  );

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center text-danger">
          <i className="fa fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-content">
      <div className="card">
        <div className="card-header">
          <strong className="card-title">Select Meters</strong>
        </div>
        <div className="card-body">
          <div className="meters-container">
            <div className="meters-available">
              <h6 className="mb-3">Available Meters</h6>
              <SearchableTable
                data={availableMeters}
                onSelect={handleMeterAdd}
              />
            </div>

            <div className="meters-selected">
              <h6 className="mb-3">Selected Meters ({selectedMeters.length})</h6>
              <div className="table-responsive">
                {selectedMeters.length > 0 ? (
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
                      {selectedMeters.map((meter) => (
                        <tr key={meter.id} className="meter-item">
                          <td>{meter.name}</td>
                          <td>
                            <span className="badge badge-primary">
                              {meter.type}
                            </span>
                          </td>
                          <td>{meter.model}</td>
                          <td>
                            <code>{meter.serialNumber}</code>
                          </td>
                          <td>
                            <button
                              className="action-button remove"
                              onClick={() => onMeterRemove(meter.id)}
                              data-tooltip="Remove meter"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    No meters selected. Please select meters from the available list.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SelectMeters.propTypes = {
  selectedMeters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      serialNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMeterSelect: PropTypes.func.isRequired,
  onMeterParametersInit: PropTypes.func.isRequired,
  onMeterRemove: PropTypes.func.isRequired,
};

export default React.memo(SelectMeters);