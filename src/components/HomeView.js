import React from 'react';
import IpfsSetupGuide from './IpfsSetupGuide';

const HomeView = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to DeNews DApp!</h2>
      <p>
        DeNews is a decentralized news publishing platform that allows users to publish 
        and view articles stored on IPFS and managed through a smart contract on the blockchain.
      </p>

      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <IpfsSetupGuide />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Getting Started</h3>
        <ol>
          <li>Make sure your local IPFS node is running (see status above)</li>
          <li>Connect your wallet using the button in the header (if not already connected)</li>
          <li>Navigate to the appropriate section based on your role:
            <ul>
              <li><strong>Author Panel</strong> - For publishing new articles</li>
              <li><strong>Admin Panel</strong> - For managing authors</li>
              <li><strong>User View</strong> - For browsing published articles</li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>How It Works</h3>
        <p>
          When you publish an article, the content is stored on IPFS (InterPlanetary File System),
          a distributed file system for storing and sharing data. The content's IPFS hash is then 
          recorded on the blockchain along with metadata like the title and access permissions.
        </p>
        <p>
          This approach provides several benefits:
        </p>
        <ul>
          <li>Content is stored in a decentralized manner</li>
          <li>Articles are immutable and permanently accessible</li>
          <li>Access control is managed through the blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeView; 