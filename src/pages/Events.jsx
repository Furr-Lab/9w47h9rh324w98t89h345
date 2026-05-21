import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Events.css'

function Events() {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/events', 'events').then(data => {
      setEvents(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="events-page page">
      <div className="page-header">
        <h1>{t('nav.events')}</h1>
        <p>Upcoming SAMBO events and competitions</p>
      </div>
      <div className="events-grid">
        {events.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <svg className="icon-empty" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <h3>{t('events.noEvents')}</h3>
            <p>Check back soon for upcoming events</p>
          </div>
        ) : (
          events.map((event, i) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <div className="event-meta">
                <p><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{event.date ? new Date(event.date).toLocaleDateString() : ''}</p>
                <p><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{event.location}</p>
              </div>
              <p className="description">{event.description}</p>
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

export default Events
