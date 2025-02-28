import React from 'react';
import PropTypes from 'prop-types';
import './GatewayWizard.css';

const WizardProgress = ({ step, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Select Gateway' },
    { number: 2, label: 'Gateway Details' },
    { number: 3, label: 'Select Meters' },
    { number: 4, label: 'Configure Parameters' },
  ];

  return (
    <div className="wizard-progress">
      <div className="progress mb-3" style={{ height: '4px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${(step / totalSteps) * 100}%` }}
          aria-valuenow={(step / totalSteps) * 100}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <div className="d-flex justify-content-between">
        {steps.map((s) => (
          <div
            key={s.number}
            className={`step-indicator ${step >= s.number ? 'active' : ''} ${
              step === s.number ? 'current' : ''
            }`}
          >
            <div className="step-number">
              {step > s.number ? (
                <i className="fa fa-check"></i>
              ) : (
                s.number
              )}
            </div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

WizardProgress.propTypes = {
  step: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default React.memo(WizardProgress);