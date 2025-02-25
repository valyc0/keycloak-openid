import React from 'react';

const SummaryDisplay = ({
  selectedGateway,
  gatewayName,
  selectedSite,
  selectedMeters,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <strong className="card-title">Configuration Summary</strong>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="summary-section p-3 bg-light rounded mb-3">
              <h6 className="text-primary mb-3">
                <i className="fa fa-server mr-2"></i>
                Gateway
              </h6>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1">
                    <strong>Name:</strong> {gatewayName || selectedGateway.name}
                  </p>
                  <p className="mb-1">
                    <strong>Serial:</strong>{' '}
                    <code className="text-dark">{selectedGateway.serial}</code>
                  </p>
                  <p className="mb-1">
                    <strong>Type:</strong>{' '}
                    <span className="badge badge-info">{selectedGateway.type}</span>
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <span className={`badge badge-${selectedGateway.status === 'Online' ? 'success' : selectedGateway.status === 'Offline' ? 'danger' : 'warning'}`}>
                      {selectedGateway.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedSite && (
            <div className="col-md-4">
              <div className="summary-section p-3 bg-light rounded mb-3">
                <h6 className="text-primary mb-3">
                  <i className="fa fa-building mr-2"></i>
                  Site
                </h6>
                <p className="mb-1">
                  <strong>Name:</strong> {selectedSite.name}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {selectedSite.address}
                </p>
                <p className="mb-1">
                  <strong>City:</strong> {selectedSite.city}
                </p>
                <p className="mb-1">
                  <strong>Country:</strong> {selectedSite.country}
                </p>
              </div>
            </div>
          )}

          {selectedMeters.length > 0 && (
            <div className="col-md-4">
              <div className="summary-section p-3 bg-light rounded mb-3">
                <h6 className="text-primary mb-3">
                  <i className="fa fa-tachometer mr-2"></i>
                  Meters ({selectedMeters.length})
                </h6>
                <div className="meter-tags">
                  {selectedMeters.map((meter) => (
                    <span
                      key={meter.id}
                      className="badge badge-primary m-1 p-2"
                      style={{ fontSize: '0.85em' }}
                    >
                      <i className="fa fa-check-circle mr-1"></i>
                      {meter.name}
                      <small className="ml-1">({meter.type})</small>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;