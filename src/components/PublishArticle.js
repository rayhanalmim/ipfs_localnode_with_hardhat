import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import { uploadToIPFS, checkIPFSConnection } from "../utils/ipfs";
import WalletStatus from "./WalletStatus";

const PublishArticle = ({ onPublished }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    access: "0" // 0 = Public, 1 = Restricted
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isIPFSConnected, setIsIPFSConnected] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkIPFSConnection();
      setIsIPFSConnected(connected);
      
      setStatus({
        type: connected ? "info" : "warning",
        message: connected 
          ? "Connected to local IPFS node. Ready to publish." 
          : "Local IPFS node not detected. Please start your IPFS daemon."
      });
    };

    checkConnection();
  }, []);
  
  useEffect(() => {
    // Update character count when content changes
    setCharacterCount(formData.content.length);
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a title for your article."
      });
      return;
    }
    
    if (!formData.content.trim()) {
      setStatus({
        type: "error",
        message: "Please enter some content for your article."
      });
      return;
    }
    
    setLoading(true);
    setStatus({
      type: "info",
      message: "Publishing your article..."
    });

    try {
      if (!isIPFSConnected) {
        throw new Error("IPFS node not connected");
      }

      // 1. Upload content to local IPFS node
      console.log("📤 Uploading to local IPFS...");
      const ipfsHash = await uploadToIPFS(formData.content);
      
      if (!ipfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      console.log("✅ IPFS Hash:", ipfsHash);
      setStatus({
        type: "info",
        message: "Content uploaded to IPFS. Waiting for MetaMask to connect..."
      });

      // 2. Publish via smart contract
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error("MetaMask not detected. Please install MetaMask to publish articles.");
        }
        
        setStatus({
          type: "info",
          message: "Please approve the transaction in MetaMask..."
        });

        const contract = await getContract();
        
        // Request account permissions if not already connected
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Submit transaction
        const tx = await contract.publishArticle(formData.title, ipfsHash, parseInt(formData.access));
        
        setStatus({
          type: "info",
          message: "Transaction submitted. Waiting for confirmation..."
        });
        
        await tx.wait();

        setStatus({
          type: "success",
          message: "Article published successfully!"
        });
        
        // Reset form
        setFormData({
          title: "",
          content: "",
          access: "0"
        });
        
        // Call the callback if provided
        if (onPublished && typeof onPublished === 'function') {
          onPublished();
        }
      } catch (error) {
        console.error("MetaMask or contract error:", error);
        
        // Handle specific MetaMask errors
        if (error.code === 4001) {
          // User rejected the transaction
          setStatus({
            type: "error",
            message: "Transaction rejected in MetaMask."
          });
        } else if (error.code === -32002) {
          // MetaMask is already processing a request
          setStatus({
            type: "warning",
            message: "MetaMask is already processing a request. Please check your MetaMask wallet."
          });
        } else {
          // Generic error
          setStatus({
            type: "error",
            message: `Blockchain error: ${error.message || error}`
          });
        }
        
        // Content is already on IPFS, but transaction failed
        console.log("Note: Content was uploaded to IPFS successfully, but blockchain recording failed.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus({
        type: "error",
        message: `Failed to publish article: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStatus = () => {
    if (!status) return null;
    
    const statusStyles = {
      success: "bg-green-50 border-green-500 text-green-800",
      error: "bg-red-50 border-red-500 text-red-800",
      warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
      info: "bg-blue-50 border-blue-500 text-blue-800",
    };
    
    const statusIcons = {
      success: (
        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2H9v-3a1 1 0 000-2h1a1 1 0 100-2H9a3 3 0 00-3 3v4a3 3 0 003 3h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      )
    };
    
    return (
      <div className={`border-l-4 p-4 mb-6 ${statusStyles[status.type]}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {statusIcons[status.type]}
          </div>
          <div className="ml-3">
            <p className="text-sm">{status.message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Publish Article</h2>
        <div className="flex items-center space-x-3">
          <div 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isIPFSConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${
              isIPFSConnected ? 'bg-green-500' : 'bg-yellow-500'
            }`}></span>
            IPFS: {isIPFSConnected ? 'Connected' : 'Disconnected'}
          </div>
          <WalletStatus />
        </div>
      </div>
      
      {renderStatus()}
      
      <form onSubmit={handlePublish} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Article Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a descriptive title"
            value={formData.title}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Article Content
          </label>
          <div className="relative">
            <textarea
              id="content"
              name="content"
              placeholder="Write your article content here..."
              value={formData.content}
              onChange={handleChange}
              className="input w-full min-h-[300px]"
              required
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {characterCount} characters
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
            Access Type
          </label>
          <select
            id="access"
            name="access"
            value={formData.access}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="0">Public - Available to all readers</option>
            <option value="1">Restricted - Only you and admins can view</option>
          </select>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            className="btn btn-outline mb-3 sm:mb-0"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary flex items-center justify-center"
            disabled={loading || !isIPFSConnected}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Publish Article
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Article Preview */}
      {showPreview && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Article Preview</h3>
          <div className="bg-gray-50 rounded-lg p-5 prose max-w-none">
            <h2 className="text-xl font-bold text-gray-900">{formData.title || 'Untitled Article'}</h2>
            <div className="whitespace-pre-wrap">
              {formData.content || 'No content yet'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishArticle;
