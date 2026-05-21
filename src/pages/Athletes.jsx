import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Athletes.css'

function Athletes() {
  const { t } = useTranslation()
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/athletes', 'athletes').then(data => {
      setAthletes(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="athletes-page page">
      <div className="page-header">
        <h1>{t('nav.athletes')}</h1>
        <p>Meet our talented SAMBO athletes</p>
      </div>
      <div className="athletes-grid">
        {athletes.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <svg className="icon-empty" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3>{t('athletes.noAthletes')}</h3>
            <p>Athlete profiles coming soon</p>
          </div>
        ) : (
          athletes.map((athlete, i) => (
            <div key={athlete.id} className="athlete-card">
              {athlete.photo ? (
                <img src={athlete.photo} alt={athlete.name} loading="lazy" />
              ) : (
                <div className="athlete-avatar">
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
              <h3>{athlete.name}</h3>
              <p className="category">{athlete.category}</p>
              {athlete.weight && <p className="weight">{athlete.weight}{typeof athlete.weight === 'number' ? ' kg' : ''}</p>}
              {athlete.achievements && (
                <p className="achievements">
                  <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>
                  {athlete.achievements}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Athletes
