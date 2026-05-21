import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminAthletes.css'

function AdminAthletes() {
  const { t } = useTranslation()
  const [athletes, setAthletes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: '', weight: '', height: '', birthDate: '', achievements: '', coach: '' })

  useEffect(() => { fetchAthletes() }, [])

  const fetchAthletes = async () => {
    try {
      const response = await fetch('/api/athletes')
      const data = await response.json()
      setAthletes(data || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchAthletes()
        setFormData({ name: '', category: '', weight: '', height: '', birthDate: '', achievements: '', coach: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/athletes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchAthletes()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-athletes page">
      <div className="page-header">
        <h1>{t('admin.athletes')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('admin.addAthlete')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="athlete-form">
          <input type="text" name="name" placeholder={t('admin.athleteName')} value={formData.name} onChange={handleChange} required />
          <input type="text" name="category" placeholder={t('admin.category')} value={formData.category} onChange={handleChange} required />
          <input type="number" name="weight" placeholder={t('admin.weight')} value={formData.weight} onChange={handleChange} required />
          <input type="number" name="height" placeholder={t('admin.height')} value={formData.height} onChange={handleChange} />
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          <textarea name="achievements" placeholder={t('admin.achievements')} value={formData.achievements} onChange={handleChange}></textarea>
          <input type="text" name="coach" placeholder={t('admin.coach')} value={formData.coach} onChange={handleChange} />
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="athletes-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.category')}</th>
              <th>{t('admin.weight')}</th>
              <th>{t('admin.height')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map(athlete => (
              <tr key={athlete.id}>
                <td>{athlete.name}</td>
                <td>{athlete.category}</td>
                <td>{athlete.weight} kg</td>
                <td>{athlete.height} cm</td>
                <td>
                  <button className="btn-edit">{t('admin.edit')}</button>
                  <button onClick={() => handleDelete(athlete.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminAthletes
