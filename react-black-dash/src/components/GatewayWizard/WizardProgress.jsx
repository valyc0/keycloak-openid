import React from 'react';

const WizardProgress = ({ step, totalSteps, onNext, onPrevious, isNextDisabled, isSubmit }) => {
  const steps = [
    'Select Gateway',
    'Gateway Details',
    'Select Meters',
    'Configure Parameters'
  ];

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Configure Gateway</strong>
      </div>
      <div className="card-body">
        {/* Progress steps */}
        <div className="progress mb-4" style={{ height: '2px' }}>
          <div
            className="progress-bar bg-primary"
            role="progressbar"
            style={{ width: `${(step / totalSteps) * 100}%` }}
            aria-valuenow={(step / totalSteps) * 100}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {/* Step indicators */}
        <div className="d-flex justify-content-between mb-4">
          {steps.map((text, index) => (
            <div key={index} className="text-center" style={{ flex: 1 }}>
              <div
                className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                  index + 1 <= step ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{
                  width: '30px',
                  height: '30px',
                  color: 'white'
                }}
              >
                {index + 1}
              </div>
              <div className={`small ${index + 1 <= step ? 'text-primary' : 'text-muted'}`}>
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-secondary"
            onClick={onPrevious}
            disabled={step === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            {isSubmit ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;