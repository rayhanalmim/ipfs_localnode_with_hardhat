import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/getContract';
import { uploadToIPFS, checkIPFSConnection } from '../utils/ipfs';
import PublishArticle from './PublishArticle';
import ArticleCard from './ArticleCard';

export default function AuthorPanel({ account }) {
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [isIpfsConnected, setIsIpfsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('publish'); // publish or articles
  const [articleContent, setArticleContent] = useState({});
  const [loadingContent, setLoadingContent] = useState({});
  const [error, setError] = useState(null);

  // Load contract and check IPFS
  useEffect(() => {
    const loadContract = async () => {
      try {
        const instance = await getContract();
        setContract(instance);
      } catch (err) {
        console.error("Error loading contract:", err);
        setError("Failed to connect to blockchain. Make sure your wallet is connected properly.");
      }
    };

    const checkIpfs = async () => {
      try {
        const connected = await checkIPFSConnection();
        setIsIpfsConnected(connected);
      } catch (err) {
        console.error("Error checking IPFS connection:", err);
      }
    };
    
    loadContract();
    checkIpfs();
  }, []);

  // Fetch user's articles
  useEffect(() => {
    fetchMyArticles();
  }, [account, contract]);

  const fetchMyArticles = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const ids = await contract.getArticlesByAuthor(account);
      
      const articles = await Promise.all(
        ids.map(async (id) => {
          try {
            const article = await contract.getArticle(id);
            return {
              id: parseInt(article.id),
              title: article.title,
              author: article.author,
              hash: article.hash,
              timestamp: parseInt(article.timestamp),
              access: parseInt(article.access) === 0 ? 'Public' : 'Restricted'
            };
          } catch (err) {
            console.warn(`Error loading article ${id}:`, err);
            return null;
          }
        })
      );
      
      // Filter out any failed article loads
      setMyArticles(articles.filter(article => article !== null));
    } catch (err) {
      console.error('Error loading articles:', err);
      setError("Failed to fetch your articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePublished = () => {
    // Switch to articles tab and refresh the list
    setActiveTab('articles');
    fetchMyArticles();
  };

  // Load article content from IPFS
  const loadArticleContent = async (hash) => {
    if (articleContent[hash]) return;
    
    setLoadingContent(prev => ({ ...prev, [hash]: true }));
    
    try {
      const content = await uploadToIPFS.getFromIPFS(hash);
      if (content) {
        setArticleContent(prev => ({ ...prev, [hash]: content }));
      }
    } catch (err) {
      console.error(`Error loading content for hash ${hash}:`, err);
    } finally {
      setLoadingContent(prev => ({ ...prev, [hash]: false }));
    }
  };

  // Render tab buttons
  const TabButton = ({ id, label, count = null }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`px-4 py-2 font-medium text-sm rounded-lg transition ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
      {count !== null && (
        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          activeTab === id
            ? 'bg-blue-200 text-blue-800'
            : 'bg-gray-200 text-gray-800'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage your articles on the DeNews platform
        </p>
      </div>
      
      {!isIpfsConnected && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">IPFS Not Connected</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Local IPFS node is not detected. Please start your local IPFS daemon.</p>
              </div>
              <div className="mt-2">
                <a 
                  href="#ipfs-setup"
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-600"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    // Assuming you have a way to show the IPFS setup guide
                  }}
                >
                  View IPFS setup guide
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <TabButton id="publish" label="Publish New Article" />
          <TabButton id="articles" label="My Articles" count={myArticles.length} />
        </div>
      </div>

      {activeTab === 'publish' && (
        <PublishArticle onPublished={handleArticlePublished} />
      )}

      {activeTab === 'articles' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Published Articles</h2>
            <button 
              onClick={fetchMyArticles}
              disabled={loading}
              className="btn btn-outline text-sm flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading your articles...</span>
            </div>
          ) : myArticles.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No articles published yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by publishing your first article</p>
              <div className="mt-6">
                <button 
                  onClick={() => setActiveTab('publish')}
                  className="btn btn-primary inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Write New Article
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myArticles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  title={article.title}
                  author={article.author}
                  timestamp={article.timestamp}
                  hash={article.hash}
                  access={article.access}
                  onViewContent={() => loadArticleContent(article.hash)}
                  previewContent={articleContent[article.hash]}
                  loading={loadingContent[article.hash]}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
