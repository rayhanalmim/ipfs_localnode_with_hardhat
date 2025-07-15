import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthorPanel from "./components/AuthorPanel";
import AdminPanel from "./components/AdminPanel";
import UserView from "./components/UserView";
import HomeView from "./components/HomeView";
import IpfsSetupGuide from "./components/IpfsSetupGuide";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>📰 DeNews</h1>
          {account ? (
            <>
              ✅ Connected: <code>{account}</code>
              <br />
              <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/admin">Admin Panel</Link> |{" "}
                <Link to="/author">Author Panel</Link> |{" "}
                <Link to="/user">User View</Link>
              </nav>
            </>
          ) : (
            <button onClick={connectWallet}>Connect MetaMask</button>
          )}
        </header>

        <main>
          {showSetupGuide && (
            <div style={{ margin: '20px 0' }}>
              <IpfsSetupGuide />
              <button 
                onClick={() => setShowSetupGuide(false)} 
                style={{ marginBottom: '20px' }}
              >
                Hide IPFS Setup Guide
              </button>
            </div>
          )}

          <Routes>
            <Route path="/admin" element={<AdminPanel account={account} />} />
            <Route path="/author" element={<AuthorPanel account={account} />} />
            <Route path="/user" element={<UserView />} />
            <Route path="/" element={<HomeView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
