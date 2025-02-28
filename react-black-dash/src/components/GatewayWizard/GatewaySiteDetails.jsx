import React, { useState, useEffect } from 'react';
import { gatewayService } from '../../services/api';
import './GatewayWizard.css';

const GatewaySiteDetails = ({
  gatewayName,
  onGatewayNameChange,
  selectedSite,
  onSiteSelect,
}) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await gatewayService.getSites();
        setSites(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Failed to load sites');
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center text-danger">
          <i className="fa fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Gateway Details & Site</strong>
      </div>
      <div className="card-body gateway-form">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="gatewayName">Gateway Name</label>
              <input
                type="text"
                id="gatewayName"
                className="form-control"
                value={gatewayName}
                onChange={(e) => onGatewayNameChange(e.target.value)}
                placeholder="Enter gateway name"
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="site">Site Location</label>
              <select
                id="site"
                className="form-control"
                value={selectedSite?.id || ''}
                onChange={(e) => {
                  const siteId = e.target.value;
                  if (!siteId) {
                    onSiteSelect(null);
                    return;
                  }
                  const site = sites.find((s) => s.id === Number(siteId));
                  if (site) {
                    onSiteSelect(site);
                  }
                }}
              >
                <option value="">Select site...</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedSite && (
          <div className="mt-4 p-3 rounded" style={{ background: 'var(--gateway-summary-background)' }}>
            <h6 className="mb-3">Site Details</h6>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Address:</strong> {selectedSite.address}
                </p>
                <p className="mb-1">
                  <strong>City:</strong> {selectedSite.city}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Country:</strong> {selectedSite.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatewaySiteDetails;