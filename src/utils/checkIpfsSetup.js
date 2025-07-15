import { checkIPFSConnection } from './ipfs';

/**
 * Utility function to check IPFS setup and return appropriate setup instructions
 */
export const checkIpfsSetup = async () => {
  const isConnected = await checkIPFSConnection();
  
  if (isConnected) {
    return {
      connected: true,
      message: "✅ Connected to local IPFS node"
    };
  }
  
  return {
    connected: false,
    message: "⚠️ No local IPFS node detected",
    instructions: [
      "1. Install IPFS Desktop from https://docs.ipfs.tech/install/ipfs-desktop/",
      "2. Or install IPFS CLI with npm: 'npm install -g ipfs'",
      "3. Start IPFS daemon with: 'ipfs daemon'",
      "4. Ensure IPFS API is available at http://localhost:5001",
      "5. Ensure IPFS Gateway is available at http://localhost:8080"
    ],
    links: {
      ipfsDesktop: "https://docs.ipfs.tech/install/ipfs-desktop/",
      ipfsCli: "https://docs.ipfs.tech/install/command-line/",
      ipfsDocs: "https://docs.ipfs.tech/"
    }
  };
};

/**
 * Helper function to check if content exists on IPFS gateway
 */
export const checkIpfsContent = async (cid) => {
  if (!cid) return false;
  
  try {
    const response = await fetch(`http://localhost:8080/ipfs/${cid}`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking IPFS content:', error);
    return false;
  }
}; 