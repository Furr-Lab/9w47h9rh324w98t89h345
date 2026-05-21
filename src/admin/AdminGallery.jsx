import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminEvents.css'

function AdminGallery() {
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ url: '', title: '', description: '' })

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery')
      setImages((await response.json()) || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchGallery()
        setFormData({ url: '', title: '', description: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchGallery()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-events page">
      <div className="page-header">
        <h1>{t('nav.gallery')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Image
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <input type="text" name="url" placeholder="Image URL" value={formData.url} onChange={handleChange} required />
          <input type="text" name="title" placeholder="Image Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td>{img.url ? <img src={img.url} alt={img.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '—'}</td>
                <td>{img.title}</td>
                <td>
                  <button onClick={() => handleDelete(img.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminGallery
