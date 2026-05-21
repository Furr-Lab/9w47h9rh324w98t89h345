import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Tournaments.css'

function Tournaments() {
  const { t } = useTranslation()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/tournaments', 'tournaments').then(data => {
      setTournaments(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="tournaments-page page">
      <div className="page-header">
        <h1>{t('nav.tournaments')}</h1>
        <p>SAMBO tournaments and competitions</p>
      </div>
      <div className="tournaments-grid">
        {tournaments.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <svg className="icon-empty" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>
            <h3>{t('tournaments.noTournaments')}</h3>
            <p>Tournament schedule coming soon</p>
          </div>
        ) : (
          tournaments.map((tournament, i) => (
            <div key={tournament.id} className="tournament-card">
              <h2>{tournament.name}</h2>
              <div className="tournament-meta">
                <p><svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>{tournament.type}</p>
                <p><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{tournament.date ? new Date(tournament.date).toLocaleDateString() : ''}</p>
                <p><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>{tournament.level}</p>
                <p><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>{tournament.participants} participants</p>
              </div>
              <button className="btn-detail">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                {t('common.details')}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Tournaments
