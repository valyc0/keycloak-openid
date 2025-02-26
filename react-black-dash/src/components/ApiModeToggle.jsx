import React, { useState, useEffect } from 'react';
import { 
  enableFakeBackend, 
  disableFakeBackend, 
  isFakeBackendEnabled 
} from '../services/api';

/**
 * Component that allows toggling between real API and mock API
 */
const ApiModeToggle = () => {
  const [isMockEnabled, setIsMockEnabled] = useState(isFakeBackendEnabled());
  const showToggle = import.meta.env.VITE_SHOW_API_TOGGLE === 'true';

  // Don't render anything if toggle is hidden
  if (!showToggle) return null;

  // Toggle API mode when button is clicked
  const handleToggle = () => {
    if (isMockEnabled) {
      disableFakeBackend();
      setIsMockEnabled(false);
    } else {
      enableFakeBackend();
      setIsMockEnabled(true);
    }
  };

  return (
    <div className="api-mode-toggle" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      padding: '10px',
      background: 'rgba(245, 245, 245, 0.9)',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ marginBottom: '5px' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: isMockEnabled ? '#2c7' : '#27c' 
        }}>
          {isMockEnabled ? 'MOCK API' : 'REAL API'}
        </span>
      </div>
      <button 
        onClick={handleToggle}
        style={{
          padding: '6px 12px',
          background: isMockEnabled ? '#e74c3c' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {isMockEnabled ? 'Use Real API' : 'Use Mock API'}
      </button>
    </div>
  );
};

export default ApiModeToggle;