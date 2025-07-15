import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/getContract';
import { uploadToIPFS, checkIPFSConnection } from '../utils/ipfs';
import PublishArticle from './PublishArticle';

export default function AuthorPanel({ account }) {
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [isIpfsConnected, setIsIpfsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('publish'); // publish or articles

  // Load contract and check IPFS
  useEffect(() => {
    const loadContract = async () => {
      const instance = await getContract();
      setContract(instance);
    };

    const checkIpfs = async () => {
      const connected = await checkIPFSConnection();
      setIsIpfsConnected(connected);
    };
    
    loadContract();
    checkIpfs();
  }, []);

  // Fetch user's articles
  useEffect(() => {
    const fetchMyArticles = async () => {
      if (!contract) return;
      try {
        setLoading(true);
        const ids = await contract.getArticlesByAuthor(account);
        const articles = await Promise.all(
          ids.map(async (id) => {
            const article = await contract.getArticle(id);
            return {
              id: article.id.toString(),
              title: article.title,
              hash: article.hash,
              timestamp: new Date(Number(article.timestamp) * 1000).toLocaleString(),
              access: Number(article.access) === 0 ? 'Public' : 'Restricted'
            };
          })
        );
        setMyArticles(articles);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (account && contract) {
      fetchMyArticles();
    }
  }, [account, contract]);

  const handleArticlePublished = () => {
    // Refresh the articles list after publishing
    if (account && contract) {
      const fetchMyArticles = async () => {
        try {
          setLoading(true);
          const ids = await contract.getArticlesByAuthor(account);
          const articles = await Promise.all(
            ids.map(async (id) => {
              const article = await contract.getArticle(id);
              return {
                id: article.id.toString(),
                title: article.title,
                hash: article.hash,
                timestamp: new Date(Number(article.timestamp) * 1000).toLocaleString(),
                access: Number(article.access) === 0 ? 'Public' : 'Restricted'
              };
            })
          );
          setMyArticles(articles);
        } catch (err) {
          console.error('Error loading articles:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMyArticles();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('publish')} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'publish' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'publish' ? 'white' : 'black',
            border: '1px solid #ddd',
            cursor: 'pointer',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px',
          }}
        >
          ✍️ Publish New Article
        </button>
        <button 
          onClick={() => setActiveTab('articles')} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'articles' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'articles' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderLeft: 'none',
            cursor: 'pointer',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
          }}
        >
          📚 My Articles ({myArticles.length})
        </button>
      </div>

      {activeTab === 'publish' && (
        <PublishArticle onPublished={handleArticlePublished} />
      )}

      {activeTab === 'articles' && (
        <div>
          <h2>📚 My Articles</h2>
          {loading ? (
            <p>Loading your articles...</p>
          ) : myArticles.length === 0 ? (
            <p>No articles published yet.</p>
          ) : (
            <div>
              {myArticles.map((article, index) => (
                <div 
                  key={index}
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '5px', 
                    padding: '15px',
                    marginBottom: '15px'
                  }}
                >
                  <h3>{article.title}</h3>
                  <p><strong>Published:</strong> {article.timestamp}</p>
                  <p><strong>Access:</strong> {article.access}</p>
                  <p>
                    <strong>IPFS:</strong> {article.hash}
                    <a 
                      href={`http://localhost:8080/ipfs/${article.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '10px' }}
                    >
                      View on IPFS
                    </a>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isIpfsConnected && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '4px',
          color: '#856404'
        }}>
          ⚠️ Local IPFS node is not detected. Publishing functionality may be limited. Please start your local IPFS daemon.
        </div>
      )}
    </div>
  );
}
