import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminEvents.css'

function AdminTraining() {
  const { t } = useTranslation()
  const [programs, setPrograms] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', level: '', ageGroup: '', schedule: '', trainer: '', description: '' })

  useEffect(() => { fetchPrograms() }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/training-programs')
      setPrograms((await response.json()) || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/training-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchPrograms()
        setFormData({ name: '', level: '', ageGroup: '', schedule: '', trainer: '', description: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/training-programs/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchPrograms()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-events page">
      <div className="page-header">
        <h1>{t('nav.training')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Program
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <input type="text" name="name" placeholder="Program Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="level" placeholder="Level (Beginner/Intermediate/Advanced)" value={formData.level} onChange={handleChange} required />
          <input type="text" name="ageGroup" placeholder="Age Group" value={formData.ageGroup} onChange={handleChange} required />
          <input type="text" name="schedule" placeholder="Schedule" value={formData.schedule} onChange={handleChange} />
          <input type="text" name="trainer" placeholder="Trainer" value={formData.trainer} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Age Group</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.level}</td>
                <td>{p.ageGroup}</td>
                <td>
                  <button className="btn-edit">{t('admin.edit')}</button>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTraining
