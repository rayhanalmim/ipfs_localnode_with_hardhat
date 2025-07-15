import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import { uploadToIPFS, checkIPFSConnection } from "../utils/ipfs";

const PublishArticle = ({ onPublished }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [access, setAccess] = useState("0"); // 0 = Public, 1 = Restricted
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isIPFSConnected, setIsIPFSConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkIPFSConnection();
      setIsIPFSConnected(connected);
      if (!connected) {
        setStatus("⚠️ Local IPFS node not detected. Please start your IPFS daemon.");
      } else {
        setStatus("✅ Connected to local IPFS node");
      }
    };

    checkConnection();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Publishing...");

    try {
      if (!isIPFSConnected) {
        throw new Error("IPFS node not connected");
      }

      // 1. Upload content to local IPFS node
      console.log("📤 Uploading to local IPFS...");
      const ipfsHash = await uploadToIPFS(content);
      
      if (!ipfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      console.log("✅ IPFS Hash:", ipfsHash);

      // 2. Publish via smart contract
      const contract = await getContract();
      const tx = await contract.publishArticle(title, ipfsHash, parseInt(access));
      await tx.wait();

      setStatus("✅ Article published successfully!");
      setTitle("");
      setContent("");
      
      // Call the callback if provided
      if (onPublished && typeof onPublished === 'function') {
        onPublished();
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus(`❌ Failed to publish article: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>📰 Publish Article</h2>
      {isIPFSConnected ? (
        <span className="badge bg-success">IPFS Connected</span>
      ) : (
        <div className="alert alert-warning">
          Local IPFS node not detected. Please start your IPFS daemon with:
          <pre>ipfs daemon</pre>
        </div>
      )}
      <form onSubmit={handlePublish}>
        <input
          type="text"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Article content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ minHeight: "200px" }}
        />
        <br />
        <label>
          Access:
          <select value={access} onChange={(e) => setAccess(e.target.value)}>
            <option value="0">Public</option>
            <option value="1">Restricted</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading || !isIPFSConnected}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default PublishArticle;
