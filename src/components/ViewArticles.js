import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import { getFromIPFS } from '../utils/ipfs';

function ViewArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [articleContent, setArticleContent] = useState({});
  const [contentLoading, setContentLoading] = useState({});

  const loadArticles = async () => {
    try {
      const contract = getContract();
      const count = await contract.getArticleCount();
      const articlesArray = [];

      for (let i = 0; i < count; i++) {
        try {
          const article = await contract.getArticle(i);
          articlesArray.push({
            id: article.id.toString(),
            title: article.title,
            author: article.author,
            hash: article.hash,
            timestamp: new Date(article.timestamp * 1000).toLocaleString(),
            access: article.access === 0 ? 'Public' : 'Restricted',
          });
        } catch (err) {
          console.warn(`Skipping restricted article ${i}`);
        }
      }

      setArticles(articlesArray);
    } catch (error) {
      console.error("Error loading articles", error);
    } finally {
      setLoading(false);
    }
  };

  const loadArticleContent = async (id, hash) => {
    if (articleContent[id]) return; // Content already loaded

    setContentLoading(prev => ({ ...prev, [id]: true }));
    try {
      const content = await getFromIPFS(hash);
      if (content) {
        setArticleContent(prev => ({ ...prev, [id]: content }));
      }
    } catch (error) {
      console.error(`Error loading content for article ${id}`, error);
    } finally {
      setContentLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleArticleClick = (id, hash) => {
    if (expandedArticle === id) {
      setExpandedArticle(null);
    } else {
      setExpandedArticle(id);
      loadArticleContent(id, hash);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <h2>📜 Articles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map(article => (
          <div
            key={article.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
            onClick={() => handleArticleClick(article.id, article.hash)}
          >
            <h3>{article.title}</h3>
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Posted:</strong> {article.timestamp}</p>
            <p><strong>Access:</strong> {article.access}</p>
            
            {expandedArticle === article.id && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <h4>Content</h4>
                {contentLoading[article.id] ? (
                  <p>Loading content from IPFS...</p>
                ) : articleContent[article.id] ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {articleContent[article.id]}
                  </div>
                ) : (
                  <p>Failed to load content from IPFS. Check that your local IPFS node is running.</p>
                )}
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleArticleClick(article.id, article.hash);
                }}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: expandedArticle === article.id ? '#ddd' : '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                {expandedArticle === article.id ? 'Hide Content' : 'Show Content'}
              </button>
              <a
                href={`http://localhost:8080/ipfs/${article.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: '10px', textDecoration: 'none' }}
              >
                🔗 View Raw on IPFS
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewArticles;
