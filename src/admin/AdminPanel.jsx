import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AdminDashboard from './AdminDashboard'
import AdminEvents from './AdminEvents'
import AdminAthletes from './AdminAthletes'
import AdminNews from './AdminNews'
import AdminTournaments from './AdminTournaments'
import AdminGallery from './AdminGallery'
import AdminTraining from './AdminTraining'
import AdminSettings from './AdminSettings'
import '../styles/AdminPanel.css'

function AdminPanel() {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="admin-panel">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{t('admin.panel')}</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
        <nav className="admin-nav">
          <a href="/admin/dashboard" className="nav-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            {t('admin.dashboard')}
          </a>
          <a href="/admin/events" className="nav-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {t('admin.events')}
          </a>
          <a href="/admin/athletes" className="nav-item">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {t('admin.athletes')}
          </a>
          <a href="/admin/tournaments" className="nav-item">
            <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>
            Tournaments
          </a>
          <a href="/admin/gallery" className="nav-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Gallery
          </a>
          <a href="/admin/training" className="nav-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Training
          </a>
          <a href="/admin/news" className="nav-item">
            <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V2"/><line x1="16" y1="8" x2="10" y2="8"/></svg>
            {t('admin.news')}
          </a>
          <a href="/admin/settings" className="nav-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            {t('admin.settings')}
          </a>
        </nav>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/events/*" element={<AdminEvents />} />
          <Route path="/athletes/*" element={<AdminAthletes />} />
          <Route path="/tournaments/*" element={<AdminTournaments />} />
          <Route path="/gallery/*" element={<AdminGallery />} />
          <Route path="/training/*" element={<AdminTraining />} />
          <Route path="/news/*" element={<AdminNews />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminPanel
