import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/App.css'

const FeatureIcons = {
  training: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  competitions: <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>,
  community: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ai: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
}

const StatIcons = {
  athletes: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  events: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  news: <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V2"/><line x1="16" y1="8" x2="10" y2="8"/></svg>,
  languages: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
}

function Home() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({})
  const [aiNews, setAiNews] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, newsData] = await Promise.all([
        apiFetch('/api/statistics', 'statistics'),
        apiFetch('/api/ai/news?limit=3', null),
      ])
      setStats(statsData || {})
      setAiNews(Array.isArray(newsData?.news) ? newsData.news.slice(0, 3) : Array.isArray(newsData) ? newsData.slice(0, 3) : [])
    }
    fetchData()
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
          <div className="hero-buttons">
            <button className="btn-primary">{t('home.joinNow')}</button>
            <button className="btn-outline">{t('home.learnMore')}</button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>{t('home.features')}</h2>
        <div className="features-grid">
          {[
            { icon: 'training', title: t('home.training'), desc: t('home.trainingDesc') },
            { icon: 'competitions', title: t('home.competitions'), desc: t('home.competitionsDesc') },
            { icon: 'ai', title: 'AI-Powered News', desc: 'Latest SAMBO news fetched automatically from sambo.sport with AI summarization' },
            { icon: 'community', title: t('home.community'), desc: t('home.communityDesc') },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{FeatureIcons[feature.icon]}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {aiNews.length > 0 && (
        <section className="ai-news-section">
          <h2>Latest from sambo.sport</h2>
          <div className="ai-news-grid">
            {aiNews.map((item, idx) => (
              <div key={idx} className="ai-news-card">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description.substring(0, 150)}...</p>}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="location-section">
        <h2>{t('home.location')}</h2>
        <div className="location-info">
          <p><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><strong>{t('home.organization')}:</strong> Kemin SamBO ry</p>
          <p><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><strong>{t('home.city')}:</strong> Kemi, Finland</p>
          <p><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><strong>Area:</strong> Rytikarin</p>
          <p><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><strong>Website:</strong> kemi-sambo.fun</p>
        </div>
      </section>

      <section className="statistics">
        <h2>{t('home.statistics')}</h2>
        <div className="stats-grid">
          {[
            { value: stats.athletes || stats.total_athletes || 0, label: t('home.athletes'), icon: 'athletes' },
            { value: stats.events || stats.total_events || 0, label: t('home.events'), icon: 'events' },
            { value: stats.news || stats.total_news || 0, label: t('home.news'), icon: 'news' },
            { value: 3, label: t('home.languages'), icon: 'languages' },
          ].map((stat, i) => (
            <div key={i} className="stat-box">
              <div className="stat-icon">{StatIcons[stat.icon]}</div>
              <div className="stat-number">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
