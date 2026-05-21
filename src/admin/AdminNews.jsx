import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminNews.css'

function AdminNews() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: '', image: '' })

  useEffect(() => { fetchNews() }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNews(data || [])
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchNews()
        setFormData({ title: '', excerpt: '', content: '', category: '', image: '' })
        setShowForm(false)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const token = localStorage.getItem('adminToken')
        await fetch(`/api/admin/news/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        fetchNews()
      } catch (error) { console.error('Error:', error) }
    }
  }

  return (
    <div className="admin-news page">
      <div className="page-header">
        <h1>{t('admin.news')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('admin.addArticle')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="news-form">
          <input type="text" name="title" placeholder={t('admin.articleTitle')} value={formData.title} onChange={handleChange} required />
          <textarea name="excerpt" placeholder={t('admin.excerpt')} value={formData.excerpt} onChange={handleChange} rows="2"></textarea>
          <textarea name="content" placeholder={t('admin.content')} value={formData.content} onChange={handleChange} rows="8" required></textarea>
          <input type="text" name="category" placeholder={t('admin.category')} value={formData.category} onChange={handleChange} />
          <input type="text" name="image" placeholder={t('admin.imageUrl')} value={formData.image} onChange={handleChange} />
          <button type="submit">{t('admin.save')}</button>
          <button type="button" onClick={() => setShowForm(false)}>{t('admin.cancel')}</button>
        </form>
      )}

      <div className="news-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.category')}</th>
              <th>{t('admin.date')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {news.map(article => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.category}</td>
                <td>{article.date ? new Date(article.date).toLocaleDateString() : ''}</td>
                <td>
                  <button className="btn-edit">{t('admin.edit')}</button>
                  <button onClick={() => handleDelete(article.id)} className="btn-delete">{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminNews
