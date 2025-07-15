import React, { useState, useEffect } from 'react';
import { checkIpfsSetup } from '../utils/checkIpfsSetup';

const IpfsSetupGuide = () => {
  const [status, setStatus] = useState({ loading: true });
  const [expanded, setExpanded] = useState(false);

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
    return (
      <div className="card p-5">
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Checking IPFS connection status...</span>
        </div>
      </div>
    );
  }

  if (status.connected) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-md font-medium text-green-800">IPFS Connection Status: Active</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{status.message}</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  IPFS Gateway: Running
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  API: Accessible
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-lg shadow-sm p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-yellow-800">IPFS Connection Status: Not Connected</h3>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-yellow-600 hover:text-yellow-800 focus:outline-none"
            >
              {expanded ? (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{status.message}</p>
            
            {/* Expanded setup instructions */}
            {expanded && (
              <div className="mt-4 text-gray-800 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 border-b border-yellow-200 pb-1">Setup Instructions</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {status.instructions?.map((instruction, index) => (
                      <li key={index} className="text-sm">{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 border-b border-yellow-200 pb-1">Helpful Resources</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <a 
                      href={status.links?.ipfsDesktop} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline bg-white py-2 flex items-center justify-center text-sm"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"></path></svg>
                      IPFS Desktop
                    </a>
                    <a 
                      href={status.links?.ipfsCli} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline bg-white py-2 flex items-center justify-center text-sm"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                      IPFS CLI
                    </a>
                    <a 
                      href={status.links?.ipfsDocs} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline bg-white py-2 flex items-center justify-center text-sm sm:col-span-2"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>
                      IPFS Documentation
                    </a>
                  </div>
                </div>
                
                <div className="italic text-xs text-gray-500 pt-2 border-t border-yellow-100">
                  Once you have IPFS running locally, this status will automatically update.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpfsSetupGuide; 