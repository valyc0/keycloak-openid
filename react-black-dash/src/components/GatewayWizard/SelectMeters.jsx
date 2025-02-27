import React, { useState, useEffect } from 'react';
import { gatewayService } from '../../services/api';

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
    const fetchMeters = async () => {
      try {
        const response = await gatewayService.getMeters();
        console.log('getMeters response:', response);
        setMeters(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching meters:', err);
        setError('Failed to load meters');
        setLoading(false);
      }
    };

    fetchMeters();
  }, []);

  const handleMeterAdd = (meterId) => {
    // Ensure meterId is treated as the correct type for comparison
    // Some dropdown values might be strings while IDs in objects might be numbers
    const meter = meters.find((m) => String(m.id) === String(meterId));
    
    if (meter) {
      // Verify if meter is already selected
      const isAlreadySelected = selectedMeters.some((m) => String(m.id) === String(meter.id));
      
      if (!isAlreadySelected) {
        console.log('Adding meter:', meter);
        onMeterSelect(meter);
        onMeterParametersInit(meter.id);
      } else {
        console.log('Meter already selected:', meter);
      }
    } else {
      console.log('Meter not found with ID:', meterId);
    }
  };

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
  const getAvailableMeters = () => {
    return Array.isArray(meters) 
      ? meters.filter((m) => !selectedMeters.some((sm) => String(sm.id) === String(m.id))) 
      : [];
  };

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Select Meters</strong>
      </div>
      <div className="card-body">
        <div className="form-group">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-tachometer"></i>
              </span>
            </div>
            <select
              className="form-control"
              onChange={(e) => handleMeterAdd(e.target.value)}
              value=""
            >
              <option value="">Add meter...</option>
              {getAvailableMeters().map((meter) => (
                <option key={meter.id} value={meter.id}>
                  {meter.name} ({meter.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedMeters.length > 0 ? (
          <div className="selected-meters">
            <h6 className="mb-3">Selected Meters</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMeters.map((meter) => (
                    <tr key={meter.id}>
                      <td>{meter.name}</td>
                      <td>
                        <span className="badge badge-primary">{meter.type}</span>
                      </td>
                      <td>{meter.model}</td>
                      <td>
                        <code>{meter.serialNumber}</code>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => onMeterRemove(meter.id)}
                          title="Remove meter"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted p-3">
            <i className="fa fa-info-circle mr-2"></i>
            No meters selected. Please add meters from the dropdown above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectMeters;