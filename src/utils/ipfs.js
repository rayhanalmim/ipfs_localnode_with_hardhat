import { create } from 'ipfs-http-client';

// Connect to local IPFS daemon
const client = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
});

// Upload content to IPFS
export const uploadToIPFS = async (content) => {
  try {
    const added = await client.add(content);
    const path = added.path;
    console.log('IPFS path:', path);
    return path;
  } catch (error) {
    console.error("IPFS upload error:", error);
    return null;
  }
};

// Retrieve content from IPFS
export const getFromIPFS = async (hash) => {
  try {
    const url = `http://localhost:8080/ipfs/${hash}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from IPFS');
    return await response.text();
  } catch (error) {
    console.error("IPFS retrieval error:", error);
    return null;
  }
};

// Check if local IPFS node is running
export const checkIPFSConnection = async () => {
  try {
    const version = await client.version();
    console.log('IPFS node version:', version);
    return true;
  } catch (error) {
    console.error("IPFS connection error:", error);
    return false;
  }
};
