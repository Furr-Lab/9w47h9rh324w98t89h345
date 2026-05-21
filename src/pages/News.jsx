import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/News.css'

function News() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])
  const [aiNews, setAiNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      const [localNews, aiData] = await Promise.all([
        apiFetch('/api/news', 'news'),
        apiFetch('/api/ai/news?limit=20', null),
      ])
      setNews(localNews || [])
      setAiNews(Array.isArray(aiData?.news) ? aiData.news : Array.isArray(aiData) ? aiData : [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const allNews = activeTab === 'ai' ? aiNews : activeTab === 'local' ? news : [...(Array.isArray(aiNews) ? aiNews : []), ...(Array.isArray(news) ? news : [])]

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="news-page page">
      <div className="page-header">
        <h1>{t('nav.news')}</h1>
        <p>Latest SAMBO news and updates</p>
      </div>

      <div className="news-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          All News
        </button>
        <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          AI News
        </button>
        <button className={activeTab === 'local' ? 'active' : ''} onClick={() => setActiveTab('local')}>
          <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V2"/><line x1="16" y1="8" x2="10" y2="8"/></svg>
          Local News
        </button>
      </div>

      <div className="news-list">
        {allNews.length === 0 ? (
          <div className="empty-state">
            <svg className="icon-empty" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V2"/><line x1="16" y1="8" x2="10" y2="8"/></svg>
            <h3>No news available</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          allNews.map((article, idx) => (
            <article key={article.id || idx} className={`news-card ${article.source === 'sambo.sport' ? 'ai-news' : ''}`}>
              {article.source === 'sambo.sport' && (
                <span className="ai-badge">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  AI
                </span>
              )}
              {article.image && <img src={article.image} alt={article.title} loading="lazy" />}
              <div className="news-content">
                <h2>{article.title}</h2>
                <p className="date">
                  {article.source && <span className="source">{article.source}</span>}
                  {article.date && <span>{new Date(article.date).toLocaleDateString()}</span>}
                </p>
                {article.description && <p className="excerpt">{article.description}</p>}
                {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read full article</a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default News
