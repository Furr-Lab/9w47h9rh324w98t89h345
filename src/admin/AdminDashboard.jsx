import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    total_athletes: 0,
    total_events: 0,
    total_news: 0,
    members: 0
  })

  useEffect(() => {
    apiFetch('/api/statistics', 'statistics').then(data => {
      setStats(prev => data ? { ...prev, ...data } : prev)
    })
  }, [])

  return (
    <div className="admin-dashboard page">
      <h1>{t('admin.dashboard')}</h1>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>{t('admin.totalAthletes')}</h3>
          <p className="stat-value">{stats.total_athletes}</p>
        </div>
        <div className="stat-card">
          <h3>{t('admin.totalEvents')}</h3>
          <p className="stat-value">{stats.total_events}</p>
        </div>
        <div className="stat-card">
          <h3>{t('admin.totalNews')}</h3>
          <p className="stat-value">{stats.total_news}</p>
        </div>
        <div className="stat-card">
          <h3>{t('admin.members')}</h3>
          <p className="stat-value">{stats.members}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>{t('admin.quickActions')}</h2>
        <div className="actions-grid">
          <a href="/admin/events/new" className="action-btn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {t('admin.newEvent')}
          </a>
          <a href="/admin/athletes/new" className="action-btn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {t('admin.newAthlete')}
          </a>
          <a href="/admin/news/new" className="action-btn">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {t('admin.newArticle')}
          </a>
          <a href="/admin/settings" className="action-btn">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            {t('admin.settings')}
          </a>
        </div>
      </div>

      <section className="system-info">
        <h2>{t('admin.systemInfo')}</h2>
        <div className="info-table">
          <p><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><strong>{t('admin.organization')}:</strong> Kemin SamBO ry</p>
          <p><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><strong>{t('admin.location')}:</strong> Kemi, Finland</p>
          <p><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><strong>{t('admin.website')}:</strong> kemi-sambo.fun</p>
          <p><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><strong>{t('admin.lastUpdated')}:</strong> {new Date().toLocaleString()}</p>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
