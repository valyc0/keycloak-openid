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
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [gatewayName, setGatewayName] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [meterParams, setMeterParams] = useState({});
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await gatewayService.getGateways();
        setGateways(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gateways:', err);
        setError('Failed to load gateways');
        setLoading(false);
      }
    };

    fetchGateways();
  }, []);

  const filteredGateways =
    query === ''
      ? gateways
      : gateways.filter(
          (g) =>
            g.name.toLowerCase().includes(query.toLowerCase()) ||
            g.serial.toLowerCase().includes(query.toLowerCase())
        );

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

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="fa fa-exclamation-triangle mr-2"></i>
        {error}
      </div>
    );
  }

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
            query={query}
            onQueryChange={setQuery}
            filteredGateways={filteredGateways}
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