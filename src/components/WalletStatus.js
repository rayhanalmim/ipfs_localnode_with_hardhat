import React, { useState, useEffect } from 'react';

const WalletStatus = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (!window.ethereum) {
          return;
        }

        // Get current account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }

        // Get current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);

        // Add listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    };

    checkWallet();

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    // You might want to reload the page as recommended by MetaMask
    // window.location.reload();
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not installed. Please install MetaMask to use this feature.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x3':
        return 'Ropsten Testnet';
      case '0x4':
        return 'Rinkeby Testnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0x2a':
        return 'Kovan Testnet';
      case '0x539': // 1337 in hex
        return 'Localhost 8545';
      case '0x7a69': // 31337 in hex
        return 'Hardhat Network';
      default:
        return 'Unknown Network';
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            <span>{shortenAddress(account)}</span>
          </div>
          <div className="text-xs text-gray-600">
            {getNetworkName(chainId)}
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletStatus; 