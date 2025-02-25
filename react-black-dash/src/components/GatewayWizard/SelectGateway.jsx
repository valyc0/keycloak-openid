import React from 'react';

const SelectGateway = ({
  selectedGateway,
  onSelect,
  query,
  onQueryChange,
  filteredGateways,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Select Gateway</strong>
      </div>
      <div className="card-body">
        <div className="form-group">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-search"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Search gateways..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
          
          <div className="gateway-list mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredGateways.map((gateway) => (
              <div
                key={gateway.id}
                className={`gateway-item p-3 mb-2 rounded cursor-pointer ${
                  selectedGateway?.id === gateway.id
                    ? 'bg-primary text-white'
                    : 'bg-light'
                }`}
                onClick={() => onSelect(gateway)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  {selectedGateway?.id === gateway.id && (
                    <i className="fa fa-check mr-2"></i>
                  )}
                  <div>
                    <div className="font-weight-bold">{gateway.name}</div>
                    <div className={`small ${selectedGateway?.id === gateway.id ? 'text-white-50' : 'text-muted'}`}>
                      Serial: {gateway.serial}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredGateways.length === 0 && (
              <div className="text-center text-muted p-3">
                No gateways found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectGateway;