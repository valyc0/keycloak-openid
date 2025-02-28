import React, { useState, useEffect } from 'react';
import { gatewayService } from '../../services/api';
import WizardProgress from './WizardProgress';
import SelectGateway from './SelectGateway';
import GatewaySiteDetails from './GatewaySiteDetails';
import SelectMeters from './SelectMeters';
import ConfigureParameters from './ConfigureParameters';
import SummaryDisplay from './SummaryDisplay';

const GatewayWizard = () => {
  const [step, setStep] = useState(1);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [gatewayName, setGatewayName] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [meterParams, setMeterParams] = useState({});
  const [error, setError] = useState(null);

  const handleMeterSelect = (meter) => {
    setSelectedMeters((prev) => [...prev, meter]);
  };

  const handleMeterRemove = (meterId) => {
    setSelectedMeters((prev) => prev.filter(m => m.id !== meterId));
    setMeterParams((prev) => {
      const newParams = { ...prev };
      delete newParams[meterId];
      return newParams;
    });
  };

  const handleMeterParametersInit = async (meterId) => {
    try {
      console.log('Initializing parameters for meter:', meterId);
      const response = await gatewayService.getMeterParameters(meterId);
      console.log('Response from getMeterParameters:', response);

      // Initialize parameters with default values
      // Handle both response formats (direct array or nested in data property)
      const paramData = response.data?.data || response.data || [];
      const initializedParams = paramData.map(param => ({
        ...param,
        error: undefined,
        value: param.defaultValue || param.value || ''  // Use default value from mock data or empty string
      }));

      console.log('Initialized parameters:', initializedParams);

      setMeterParams(prev => ({
        ...prev,
        [meterId]: initializedParams
      }));
    } catch (err) {
      console.error('Error initializing meter parameters:', err);
      setError('Failed to initialize meter parameters. Please try again.');
    }
  };

  const handleParameterChange = (meterId, parameterId, value) => {
    setMeterParams((prev) => ({
      ...prev,
      [meterId]: prev[meterId].map((p) =>
        p.id === parameterId ? { ...p, value, error: undefined } : p
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null); // Clear any previous errors

      // Initial validation
      const missingParams = selectedMeters.some(meter => !meterParams[meter.id]);
      if (missingParams) {
        setError('Some meters are missing parameters. Please ensure all meters are configured.');
        return;
      }

      // Check for empty required fields
      const invalidParams = selectedMeters.some(meter =>
        meterParams[meter.id].some(param =>
          param.required && (!param.value || param.value.trim() === '')
        )
      );
      if (invalidParams) {
        setError('Please fill in all required parameters for each meter.');
        return;
      }

      // Reset meterParams state
      const initialMeterParams = {};
      selectedMeters.forEach(meter => {
        initialMeterParams[meter.id] = meterParams[meter.id].map(param => ({
          ...param,
          error: undefined
        }));
      });
      setMeterParams(initialMeterParams);

      // Server-side validation - SKIPPING FOR DEMO
      // console.log('Validating parameters...', meterParams);
      // const validationResponse = await gatewayService.validateGatewayParameters(meterParams);
      // console.log('Validation response:', validationResponse);

      // if (!validationResponse.data?.valid) {
      //   const updatedParams = { ...meterParams };
      //   Object.entries(validationResponse.data.errors).forEach(([meterId, errors]) => {
      //     updatedParams[meterId] = meterParams[meterId].map((param) => ({
      //       ...param,
      //       error: errors[param.id],
      //     }));
      //   });
      //   setMeterParams(updatedParams);
      //   setError('Please fix the validation errors before proceeding.');
      //   return;
      // }

      // Prepare configuration
      const config = {
        gateway: {
          ...selectedGateway,
          name: gatewayName,
          site: selectedSite,
          meters: selectedMeters.map((m) => ({
            ...m,
            parameters: meterParams[m.id].map(({ error, ...param }) => param),
          })),
        },
      };

      // Submit configuration
      console.log('Submitting configuration:', config);
      const response = await gatewayService.saveGatewayConfiguration(config);
      console.log('Save response:', response);

      if (response.data && response.data.success) {
        setConfigJson(JSON.stringify(config, null, 2));
        setIsModalOpen(true);
      } else {
        setError('Failed to save configuration. Server did not return success.');
      }
    } catch (err) {
      console.error('Error submitting gateway configuration:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      setError(`Failed to save gateway configuration: ${errorMessage}`);
    }
  };

  const isNextDisabled = () => {
    const checkStep2 = () => {
      const hasGatewayName = gatewayName.trim() !== '';
      const hasSite = selectedSite !== null;
      return !hasGatewayName || !hasSite;
    };

    switch (step) {
      case 1:
        return !selectedGateway;
      case 2:
        return checkStep2();
      case 3:
        return selectedMeters.length === 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SelectGateway
            selectedGateway={selectedGateway}
            onSelect={(gateway) => {
              setSelectedGateway(gateway);
              setGatewayName(gateway.name);
            }}
          />
        );
      case 2:
        return (
          <GatewaySiteDetails
            gatewayName={gatewayName}
            onGatewayNameChange={setGatewayName}
            selectedSite={selectedSite}
            onSiteSelect={setSelectedSite}
          />
        );
      case 3:
        return (
          <SelectMeters
            selectedMeters={selectedMeters}
            onMeterSelect={handleMeterSelect}
            onMeterParametersInit={handleMeterParametersInit}
            onMeterRemove={handleMeterRemove}
          />
        );
      case 4:
        return (
          <ConfigureParameters
            selectedMeters={selectedMeters}
            meterParams={meterParams}
            onParameterChange={handleParameterChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-nav-sticky">
        <WizardProgress
          step={step}
          totalSteps={4}
          onNext={() => {}}  // Moved to sticky buttons
          onPrevious={() => {}}  // Moved to sticky buttons
          isNextDisabled={isNextDisabled()}
          isSubmit={step === 4}
        />

        {error && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            <i className="fa fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        {selectedGateway && (
          <SummaryDisplay
            selectedGateway={selectedGateway}
            gatewayName={gatewayName}
            selectedSite={selectedSite}
            selectedMeters={selectedMeters}
          />
        )}
      </div>

      <div className="wizard-content">
        {renderStep()}
      </div>

      <div className="wizard-actions-sticky">
        {step > 1 && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setStep((s) => s - 1)}
          >
            <i className="fa fa-arrow-left mr-2"></i>
            Previous
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (step === 4 ? handleSubmit() : setStep((s) => s + 1))}
          disabled={isNextDisabled()}
        >
          {step === 4 ? (
            <>
              <i className="fa fa-check mr-2"></i>
              Submit
            </>
          ) : (
            <>
              Next
              <i className="fa fa-arrow-right ml-2"></i>
            </>
          )}
        </button>
      </div>

      {isModalOpen && (
            <>
              <div
                className="modal d-block"
                tabIndex="-1"
                role="dialog"
                style={{ zIndex: 1050 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsModalOpen(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsModalOpen(false);
                  }
                }}
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Configuration</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="modal-body">
                      <pre className="bg-light p-3 rounded">
                        <code>{configJson}</code>
                      </pre>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
          </>
      )}
    </div>
  );
};

export default GatewayWizard;