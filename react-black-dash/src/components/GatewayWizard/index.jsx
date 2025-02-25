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

  const handleMeterParametersInit = (meterId) => {
    gatewayService.getMeterParameters().then((response) => {
      setMeterParams((prev) => ({
        ...prev,
        [meterId]: response.data.map((p) => ({ ...p })),
      }));
    });
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
      const validationResponse = await gatewayService.validateGatewayParameters(meterParams);
      if (Object.keys(validationResponse.data).length > 0) {
        const updatedParams = { ...meterParams };
        Object.entries(validationResponse.data).forEach(([meterId, errors]) => {
          updatedParams[meterId] = meterParams[meterId].map((param) => ({
            ...param,
            error: errors[param.id],
          }));
        });
        setMeterParams(updatedParams);
        return;
      }

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

      const response = await gatewayService.saveGatewayConfiguration(config);
      if (response.data.success) {
        setConfigJson(JSON.stringify(config, null, 2));
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error submitting gateway configuration:', err);
      setError('Failed to save gateway configuration. Please try again.');
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
    <div className="container-fluid p-4">
      <WizardProgress
        step={step}
        totalSteps={4}
        onNext={() => (step === 4 ? handleSubmit() : setStep((s) => s + 1))}
        onPrevious={() => setStep((s) => s - 1)}
        isNextDisabled={isNextDisabled()}
        isSubmit={step === 4}
      />

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
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

      {renderStep()}

      {isModalOpen && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Configuration</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span aria-hidden="true">&times;</span>
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
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default GatewayWizard;