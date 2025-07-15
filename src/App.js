import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AuthorPanel from "./components/AuthorPanel";
import AdminPanel from "./components/AdminPanel";
import UserView from "./components/UserView";
import HomeView from "./components/HomeView";
import IpfsSetupGuide from "./components/IpfsSetupGuide";

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
  </svg>
);

const AuthorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

// Navigation Link component
const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-4 py-2 rounded-lg transition duration-150 ease-in-out ${
        isActive 
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

// NavLink wrapper that provides location context
const NavLinkWrapper = ({ to, icon, children }) => {
  return (
    <NavLink to={to} icon={icon}>
      {children}
    </NavLink>
  );
};

function App() {
  const [account, setAccount] = useState("");
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  useEffect(() => {
    // Check if account is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }

          // Add event listeners
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            } else {
              setAccount("");
            }
          });

          window.ethereum.on("chainChanged", () => {
            // Reload page when network changes as recommended by MetaMask
            window.location.reload();
          });

          window.ethereum.on("disconnect", () => {
            setAccount("");
          });
        } catch (error) {
          console.error("Error checking connection", error);
        }
      }
    };

    checkConnection();
    
    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
        window.ethereum.removeAllListeners("disconnect");
      }
    };
  }, []);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header/Navbar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">📰 DeNews</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <NavLinkWrapper to="/" icon={<HomeIcon />}>Home</NavLinkWrapper>
                  <NavLinkWrapper to="/admin" icon={<AdminIcon />}>Admin</NavLinkWrapper>
                  <NavLinkWrapper to="/author" icon={<AuthorIcon />}>Author</NavLinkWrapper>
                  <NavLinkWrapper to="/user" icon={<UserIcon />}>Reader</NavLinkWrapper>
                </div>
              </div>
              
              {/* Wallet Connection */}
              <div className="flex items-center">
                {account ? (
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">{formatAddress(account)}</span>
                  </div>
                ) : (
                  <button 
                    onClick={connectWallet} 
                    className={`btn btn-primary flex items-center ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>Connect Wallet</>
                    )}
                  </button>
                )}
                
                {/* Mobile menu button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <svg 
                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg 
                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
              <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin</Link>
              <Link to="/author" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Author</Link>
              <Link to="/user" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Reader</Link>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* IPFS Setup Guide Alert */}
            {showSetupGuide ? (
              <div className="mb-6">
                <IpfsSetupGuide />
                <button 
                  onClick={() => setShowSetupGuide(false)} 
                  className="btn btn-outline mt-2"
                >
                  Hide Setup Guide
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <button 
                  onClick={() => setShowSetupGuide(true)} 
                  className="btn btn-outline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Show IPFS Setup Guide
                </button>
              </div>
            )}
            
            {/* Routes */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <Routes>
                <Route path="/admin" element={<AdminPanel account={account} />} />
                <Route path="/author" element={<AuthorPanel account={account} />} />
                <Route path="/user" element={<UserView />} />
                <Route path="/" element={<HomeView />} />
              </Routes>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} DeNews. Decentralized news on the blockchain.
              </div>
              <div className="flex space-x-4">
                <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                  IPFS
                </a>
                <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                  Ethereum
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
