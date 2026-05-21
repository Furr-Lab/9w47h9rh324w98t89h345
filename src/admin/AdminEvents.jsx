import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminEvents.css'

function AdminEvents() {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', category: '' })

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchEvents()
        setFormData({ title: '', date: '', location: '', description: '', category: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/events/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchEvents()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-events page">
      <div className="page-header">
        <h1>{t('admin.events')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('admin.addEvent')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <input type="text" name="title" placeholder={t('admin.eventTitle')} value={formData.title} onChange={handleChange} required />
          <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="location" placeholder={t('admin.location')} value={formData.location} onChange={handleChange} required />
          <textarea name="description" placeholder={t('admin.description')} value={formData.description} onChange={handleChange}></textarea>
          <input type="text" name="category" placeholder={t('admin.category')} value={formData.category} onChange={handleChange} />
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.date')}</th>
              <th>{t('admin.location')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.date ? new Date(event.date).toLocaleDateString() : ''}</td>
                <td>{event.location}</td>
                <td>
                  <button className="btn-edit">{t('admin.edit')}</button>
                  <button onClick={() => handleDelete(event.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminEvents
