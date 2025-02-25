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
        {/* Step indicators */}
        <div className="wizard-progress mb-4">
          <div className="progress" style={{ height: '3px', backgroundColor: '#e9ecef' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{
                width: `${(step / totalSteps) * 100}%`,
                transition: 'width 0.3s ease-in-out'
              }}
              aria-valuenow={(step / totalSteps) * 100}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div className="d-flex justify-content-between mt-n3">
            {steps.map((text, index) => (
              <div key={index} className="text-center position-relative" style={{ flex: 1 }}>
                <div
                  className={`wizard-step-indicator rounded-circle d-inline-flex align-items-center justify-content-center mb-2 border ${
                    index + 1 < step ? 'bg-primary border-primary' :
                    index + 1 === step ? 'bg-white border-primary' :
                    'bg-white border-secondary'
                  }`}
                  style={{
                    width: '35px',
                    height: '35px',
                    transition: 'all 0.3s ease-in-out',
                    zIndex: 1
                  }}
                >
                  {index + 1 < step ? (
                    <i className="fas fa-check text-white"></i>
                  ) : (
                    <span className={index + 1 === step ? 'text-primary' : 'text-muted'}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className={`small font-weight-medium mt-2 ${
                  index + 1 === step ? 'text-primary' : 'text-muted'
                }`}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={onPrevious}
            disabled={step === 1}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </button>
          <button
            className="btn btn-primary px-4"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            {isSubmit ? (
              <>
                <i className="fas fa-check mr-2"></i>
                Submit
              </>
            ) : (
              <>
                Next
                <i className="fas fa-arrow-right ml-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;