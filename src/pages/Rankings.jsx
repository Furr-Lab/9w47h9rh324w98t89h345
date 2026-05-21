import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Rankings.css'

function Rankings() {
  const { t } = useTranslation()
  const [rankings, setRankings] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/rankings', 'rankings').then(data => {
      setRankings(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = selectedCategory === 'all' ? rankings : rankings.filter(r => r.category?.toLowerCase().includes(selectedCategory))

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="rankings-page page">
      <div className="page-header">
        <h1>{t('nav.rankings')}</h1>
        <p>Athlete rankings and standings</p>
      </div>

      <div className="category-filter">
        {['all', 'men', 'women', 'juniors'].map(cat => (
          <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>
            {cat === 'all' ? <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> : null}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg className="icon-empty" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          <h3>No rankings available</h3>
          <p>Rankings will be updated after competitions</p>
        </div>
      ) : (
        <div className="rankings-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('rankings.name')}</th>
                <th>{t('rankings.category')}</th>
                <th>{t('rankings.points')}</th>
                <th>{t('rankings.wins')}</th>
                <th>{t('rankings.losses')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((athlete, index) => (
                <tr key={athlete.id}>
                  <td className="rank">
                    {index === 0 ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#d97706"/><path d="M12 6v6l4 2"/></svg>
                    : index === 1 ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#94a3b8" stroke="#64748b"/><path d="M12 6v6l4 2"/></svg>
                    : index === 2 ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#cd7f32" stroke="#8b5a2b"/><path d="M12 6v6l4 2"/></svg>
                    : `${index + 1}`}
                  </td>
                  <td>{athlete.name}</td>
                  <td>{athlete.category}</td>
                  <td className="points">{athlete.points}</td>
                  <td className="wins">{athlete.wins}</td>
                  <td className="losses">{athlete.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Rankings
