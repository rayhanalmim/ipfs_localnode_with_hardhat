import React, { useState, useEffect } from "react";
import { getContract } from "../utils/getContract";
import { CONTRACT_ADDRESS, ADMIN_ADDRESS } from "../utils/config";
import { ethers } from "ethers";

const AdminPanel = ({ account }) => {
  const [newAuthor, setNewAuthor] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authorsList, setAuthorsList] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  useEffect(() => {
    if (account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      setIsAdmin(true);
      fetchAuthors();
    } else {
      setIsAdmin(false);
    }
  }, [account]);

  const fetchAuthors = async () => {
    if (!isAdmin) return;
    
    try {
      setLoadingAuthors(true);
      // This is a placeholder since there's no direct way to get all authors
      // In a real app, you would implement a method in the contract to get all authors
      // or use events to track added authors
      
      // Placeholder for demonstration
      setAuthorsList([
        { address: "0x1234567890123456789012345678901234567890", added: new Date().toLocaleString() },
        // Add more placeholder authors if needed
      ]);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleAddAuthor = async () => {
    if (!ethers.isAddress(newAuthor)) {
      setStatus({
        type: "error",
        message: "Invalid Ethereum address"
      });
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();
      
      setStatus({
        type: "info",
        message: "Adding author, please wait..."
      });

      const tx = await contract.addAuthor(newAuthor);
      
      setStatus({
        type: "info",
        message: "Transaction submitted, waiting for confirmation..."
      });
      
      await tx.wait();

      setStatus({
        type: "success",
        message: "Author added successfully"
      });
      
      // Update authors list
      setAuthorsList(prev => [
        ...prev, 
        { address: newAuthor, added: new Date().toLocaleString() }
      ]);
      
      setNewAuthor("");
    } catch (err) {
      console.error("Error adding author:", err);
      setStatus({
        type: "error",
        message: `Failed to add author: ${err.reason || err.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStatus = () => {
    if (!status) return null;
    
    const statusClasses = {
      success: "bg-green-50 border-l-4 border-green-500 text-green-800",
      error: "bg-red-50 border-l-4 border-red-500 text-red-800",
      info: "bg-blue-50 border-l-4 border-blue-500 text-blue-800",
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
      info: (
        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2H9v-3a1 1 0 000-2h1a1 1 0 100-2H9a3 3 0 00-3 3v4a3 3 0 003 3h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    };
    
    return (
      <div className={`p-4 rounded-md my-4 ${statusClasses[status.type]}`}>
        <div className="flex">
          <div className="flex-shrink-0">{statusIcons[status.type]}</div>
          <div className="ml-3">
            <p className="text-sm">{status.message}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2H9v-3a1 1 0 000-2h1a1 1 0 100-2H9a3 3 0 00-3 3v4a3 3 0 003 3h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Access Denied</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>You are not authorized to access the admin panel. Only the contract admin can access this page.</p>
              <p className="mt-2">Current address: <code className="bg-yellow-100 px-1 py-0.5 rounded">{account}</code></p>
              <p className="mt-2">Required address: <code className="bg-yellow-100 px-1 py-0.5 rounded">{ADMIN_ADDRESS}</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage authors who can publish articles to the DeNews platform.
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Author</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grow">
            <label htmlFor="authorAddress" className="sr-only">Author Address</label>
            <input
              id="authorAddress"
              type="text"
              className="input w-full"
              placeholder="Enter Ethereum address (0x...)"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAddAuthor}
            disabled={loading || !newAuthor} 
            className={`btn btn-primary ${(loading || !newAuthor) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Add Author"
            )}
          </button>
        </div>
        
        {renderStatus()}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Once added, authors will be able to publish articles on the platform.</p>
        </div>
      </div>
      
      {/* Authors List */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Authorized Authors</h3>
          <button 
            onClick={fetchAuthors} 
            disabled={loadingAuthors}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {loadingAuthors ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>
        
        {loadingAuthors ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : authorsList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No authors have been added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authorsList.map((author, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {author.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {author.added}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
