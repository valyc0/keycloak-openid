import React from 'react';
import GatewayWizardComponent from '../components/GatewayWizard';

const GatewayWizard = () => {
  return (
    <div className="container-fluid px-4">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Gateway Configuration Wizard</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <GatewayWizardComponent />
        </div>
      </div>
    </div>
  );
};

export default GatewayWizard;