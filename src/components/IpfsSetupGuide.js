import React, { useState, useEffect } from 'react';
import { checkIpfsSetup } from '../utils/checkIpfsSetup';

const IpfsSetupGuide = () => {
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkIpfsSetup();
        setStatus({ ...result, loading: false });
      } catch (error) {
        setStatus({ 
          connected: false, 
          loading: false, 
          message: "Error checking IPFS status", 
          error: error.message 
        });
      }
    };

    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status.loading) {
    return <div>Checking IPFS connection status...</div>;
  }

  if (status.connected) {
    return (
      <div style={{ 
        padding: '10px 15px', 
        backgroundColor: '#d4edda', 
        color: '#155724', 
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h4>IPFS Status: Connected</h4>
        <p>{status.message}</p>
        <small>Your local IPFS node is running correctly.</small>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#fff3cd', 
      color: '#856404', 
      borderRadius: '4px',
      marginBottom: '20px' 
    }}>
      <h4>IPFS Status: Not Connected</h4>
      <p>{status.message}</p>
      
      <div style={{ marginTop: '15px' }}>
        <h5>Setup Instructions:</h5>
        <ol>
          {status.instructions?.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h5>Helpful Resources:</h5>
        <ul>
          <li>
            <a 
              href={status.links?.ipfsDesktop} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              IPFS Desktop Installation
            </a>
          </li>
          <li>
            <a 
              href={status.links?.ipfsCli} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              IPFS Command Line Installation
            </a>
          </li>
          <li>
            <a 
              href={status.links?.ipfsDocs} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              IPFS Documentation
            </a>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
        Once you have IPFS running locally, refresh this page to check the connection status.
      </div>
    </div>
  );
};

export default IpfsSetupGuide; 