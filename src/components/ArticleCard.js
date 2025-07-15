import React, { useState } from 'react';

/**
 * A professional article card component with hover effects and responsive design
 */
const ArticleCard = ({ 
  title, 
  author, 
  timestamp, 
  hash, 
  access = 'Public',
  onViewContent,
  previewContent = null,
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // If timestamp is a number (Unix timestamp), convert to Date
    const date = typeof timestamp === 'number' ? 
      new Date(timestamp * 1000) : 
      new Date(timestamp);
      
    return date.toLocaleString();
  };
  
  // Handle view content click
  const handleViewContentClick = (e) => {
    e.stopPropagation();
    if (onViewContent && typeof onViewContent === 'function') {
      onViewContent(hash);
    }
    setIsExpanded(!isExpanded);
  };
  
  // Generate access badge based on access type
  const renderAccessBadge = () => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    if (access === 'Restricted') {
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
          </svg>
          Restricted
        </span>
      </span>;
    }
    
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>
      <span className="flex items-center">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        Public
      </span>
    </span>;
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${
        isHovered ? 'shadow-md transform translate-y-[-2px]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="p-5">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {title || 'Untitled Article'}
          </h3>
          {renderAccessBadge()}
        </div>
        
        {/* Card Metadata */}
        <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            <span title={author}>{formatAddress(author)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
            <span>{formatDate(timestamp)}</span>
          </div>
        </div>
        
        {/* Hash Info */}
        <div className="mt-3 flex items-center">
          <span className="text-xs font-medium text-gray-500">IPFS Hash:</span>
          <code className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-600 font-mono">
            {hash ? `${hash.substring(0, 15)}...` : 'No hash available'}
          </code>
        </div>
        
        {/* Article Preview */}
        {isExpanded && previewContent && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Article Preview</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
              {previewContent}
            </div>
          </div>
        )}
        
        {/* Card Actions */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
            onClick={handleViewContentClick}
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                </svg>
                Hide Content
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                View Content
              </>
            )}
          </button>
          
          <a
            href={`http://localhost:8080/ipfs/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
            </svg>
            Open in IPFS
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 