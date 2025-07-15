import React from 'react';
import IpfsSetupGuide from './IpfsSetupGuide';

const HomeView = () => {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Welcome to DeNews DApp!</h2>
      <p className="text-gray-700">
        DeNews is a decentralized news publishing platform that allows users to publish 
        and view articles stored on IPFS and managed through a smart contract on the blockchain.
      </p>

      <div className="my-8">
        <IpfsSetupGuide />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-500">Getting Started</h3>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Make sure your local IPFS node is running (see status above)</li>
          <li>Connect your wallet using the button in the header (if not already connected)</li>
          <li>Navigate to the appropriate section based on your role:
            <ul className="list-disc pl-6 mt-2">
              <li><strong className="font-medium">Author Panel</strong> - For publishing new articles</li>
              <li><strong className="font-medium">Admin Panel</strong> - For managing authors</li>
              <li><strong className="font-medium">User View</strong> - For browsing published articles</li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-500">How It Works</h3>
        <p className="text-gray-700 mt-2">
          When you publish an article, the content is stored on IPFS (InterPlanetary File System),
          a distributed file system for storing and sharing data. The content's IPFS hash is then 
          recorded on the blockchain along with metadata like the title and access permissions.
        </p>
        <p className="text-gray-700 mt-2">
          This approach provides several benefits:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Content is stored in a decentralized manner</li>
          <li>Articles are immutable and permanently accessible</li>
          <li>Access control is managed through the blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeView; 