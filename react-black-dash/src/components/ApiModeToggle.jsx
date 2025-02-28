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
  const [useRealApi, setUseRealApi] = useState(import.meta.env.VITE_USE_FAKE_BACKEND !== 'true');
  const showToggle = import.meta.env.VITE_SHOW_API_TOGGLE === 'true';

  useEffect(() => {
    // Initialize fake backend if enabled
    if (!useRealApi) {
      enableFakeBackend();
    }
  }, []);

  // Don't render anything if toggle is hidden
  if (!showToggle) return null;

  // Toggle API mode when button is clicked
  const handleToggle = () => {
    if (useRealApi) {
      enableFakeBackend();
      setUseRealApi(false);
    } else {
      disableFakeBackend();
      setUseRealApi(true);
    }
  };

  return (
    <div className="api-mode-toggle" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      padding: '10px',
      background: 'rgba(245, 245, 245, 0.3)',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <label className="switch" style={{
          position: 'relative',
          display: 'inline-block',
          width: '30px',
          height: '17px'
        }}>
          <input
            type="checkbox"
            checked={useRealApi}
            onChange={handleToggle}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: useRealApi ? '#e74c3c' : '#ccc',
            transition: '.4s',
            borderRadius: '17px',
            '&:before': {
              position: 'absolute',
              content: '""',
              height: '13px',
              width: '13px',
              left: '2px',
              bottom: '2px',
              backgroundColor: 'white',
              transition: '.4s',
              borderRadius: '50%',
              transform: useRealApi ? 'translateX(13px)' : 'translateX(0)'
            }
          }}>
            <div style={{
              position: 'absolute',
              height: '13px',
              width: '13px',
              left: '2px',
              bottom: '2px',
              backgroundColor: 'white',
              transition: '.4s',
              borderRadius: '50%',
              transform: useRealApi ? 'translateX(13px)' : 'translateX(0)'
            }} />
          </span>
        </label>
        <span style={{
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#000000'
        }}>
          Use Real API
        </span>
      </div>
    </div>
  );
};

export default ApiModeToggle;