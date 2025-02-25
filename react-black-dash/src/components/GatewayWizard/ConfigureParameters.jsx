import React from 'react';

const ConfigureParameters = ({
  selectedMeters,
  meterParams,
  onParameterChange,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Configure Parameters</strong>
      </div>
      <div className="card-body">
        {selectedMeters.length === 0 ? (
          <div className="text-center text-muted p-3">
            <i className="fa fa-info-circle mr-2"></i>
            No meters selected to configure.
          </div>
        ) : (
          <div className="accordion" id="meterAccordion">
            {selectedMeters.map((meter, index) => (
              <div className="card mb-3" key={meter.id}>
                <div className="card-header" id={`heading${meter.id}`}>
                  <h2 className="mb-0">
                    <button
                      className="btn btn-link btn-block text-left d-flex justify-content-between align-items-center"
                      type="button"
                      data-toggle="collapse"
                      data-target={`#collapse${meter.id}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`collapse${meter.id}`}
                    >
                      <span>
                        <i className="fa fa-tachometer mr-2"></i>
                        {meter.name}
                      </span>
                      <i className="fa fa-chevron-down"></i>
                    </button>
                  </h2>
                </div>

                <div
                  id={`collapse${meter.id}`}
                  className={`collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading${meter.id}`}
                  data-parent="#meterAccordion"
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-info mb-4">
                          <i className="fa fa-info-circle mr-2"></i>
                          Configure the parameters for {meter.name} ({meter.type})
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {meterParams[meter.id]?.map((param) => (
                        <div className="col-md-6" key={param.id}>
                          <div className="form-group">
                            <label>
                              {param.name}
                              {param.required && (
                                <span className="text-danger">*</span>
                              )}
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="fa fa-cog"></i>
                                </span>
                              </div>
                              <input
                                type={param.type}
                                className={`form-control ${
                                  param.error ? 'is-invalid' : ''
                                }`}
                                value={param.value}
                                onChange={(e) =>
                                  onParameterChange(
                                    meter.id.toString(),
                                    param.id,
                                    e.target.value
                                  )
                                }
                                min={param.min}
                                max={param.max}
                              />
                              {param.error && (
                                <div className="invalid-feedback">
                                  <i className="fa fa-exclamation-circle mr-1"></i>
                                  {param.error}
                                </div>
                              )}
                            </div>
                            {param.type === 'number' && param.min !== undefined && param.max !== undefined && (
                              <small className="form-text text-muted">
                                Range: {param.min} - {param.max}
                              </small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureParameters;