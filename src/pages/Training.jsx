import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Training.css'

function Training() {
  const { t } = useTranslation()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/training-programs', 'training').then(data => {
      setPrograms(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="training-page page">
      <div className="page-header">
        <h1>{t('nav.training')}</h1>
        <p>{t('training.subtitle')}</p>
      </div>

      {programs.length === 0 ? (
        <div className="empty-state">
          <svg className="icon-empty" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <h3>{t('training.noPrograms')}</h3>
          <p>Training programs will be announced soon</p>
        </div>
      ) : (
        <div className="programs-grid">
          {programs.map((program, i) => (
            <div key={program.id} className="program-card">
              <h2>{program.name}</h2>
              <div className="program-meta">
                <p><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>{program.level}</p>
                <p><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{program.ageGroup}</p>
                <p><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{program.schedule}</p>
                <p><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{program.trainer}</p>
              </div>
              <p className="description">{program.description}</p>
              <button className="btn-enroll">
                <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {t('training.enroll')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Training
