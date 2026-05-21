import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminEvents.css'

function AdminTournaments() {
  const { t } = useTranslation()
  const [tournaments, setTournaments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', type: '', date: '', level: '', participants: '' })

  useEffect(() => { fetchTournaments() }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments')
      setTournaments((await response.json()) || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchTournaments()
        setFormData({ name: '', type: '', date: '', level: '', participants: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/tournaments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchTournaments()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-events page">
      <div className="page-header">
        <h1>{t('nav.tournaments')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Tournament
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <input type="text" name="name" placeholder="Tournament Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="type" placeholder="Type (Sports/Combat/Both)" value={formData.type} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="level" placeholder="Level (Regional/National/International)" value={formData.level} onChange={handleChange} required />
          <input type="number" name="participants" placeholder="Participants" value={formData.participants} onChange={handleChange} />
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Level</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.type}</td>
                <td>{t.date ? new Date(t.date).toLocaleDateString() : ''}</td>
                <td>{t.level}</td>
                <td>
                  <button className="btn-edit">{t('admin.edit')}</button>
                  <button onClick={() => handleDelete(t.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTournaments
