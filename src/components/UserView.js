import React, { useEffect, useState } from "react";
import { getContract } from "../utils/getContract";
import { getFromIPFS } from "../utils/ipfs";
import ArticleCard from "./ArticleCard";

function UserView() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articleContent, setArticleContent] = useState({});
  const [loadingContent, setLoadingContent] = useState({});

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const contract = await getContract();
      const count = await contract.getArticleCount();
      
      // Convert count from BigInt to regular number
      const totalCount = parseInt(count.toString());
      console.log(`Found ${totalCount} total articles`);
      
      const loadedArticles = [];

      for (let i = 0; i < totalCount; i++) {
        try {
          const article = await contract.getArticle(i);
          
          // Only include Public articles (access type 0)
          if (parseInt(article.access) === 0) {
            loadedArticles.push({
              id: parseInt(article.id),
              title: article.title,
              author: article.author,
              hash: article.hash,
              timestamp: parseInt(article.timestamp),
              access: parseInt(article.access) === 0 ? 'Public' : 'Restricted'
            });
          }
        } catch (articleError) {
          console.warn(`Error loading article ${i}:`, articleError);
          // Continue with next article
        }
      }

      setArticles(loadedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
      setError("Failed to load articles. Please make sure you're connected to the blockchain network.");
    } finally {
      setLoading(false);
    }
  };

  const loadArticleContent = async (hash) => {
    if (articleContent[hash]) return; // Content already loaded
    
    setLoadingContent(prev => ({ ...prev, [hash]: true }));
    
    try {
      const content = await getFromIPFS(hash);
      if (content) {
        setArticleContent(prev => ({ ...prev, [hash]: content }));
      }
    } catch (error) {
      console.error(`Error loading content for hash ${hash}:`, error);
    } finally {
      setLoadingContent(prev => ({ ...prev, [hash]: false }));
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Public News Articles</h1>
        
        <button 
          onClick={fetchArticles}
          className="btn btn-outline flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
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
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles</h3>
          <p className="mt-1 text-sm text-gray-500">There are no public articles available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
  );
}

export default UserView;
