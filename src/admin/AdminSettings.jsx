import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/AdminSettings.css'

function AdminSettings() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    organization_name: 'Kemin SamBO ry',
    location: 'Kemi, Finland',
    address: 'Rytikarin, Kemi',
    website: 'kemi-sambo.fun',
    email: 'info@kemi-sambo.fun',
    phone: '+358 (0) XXX XXX XXXX',
    members_count: 0,
    description: 'Professional SAMBO sports organization'
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await response.json()
      if (data && Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data }))
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(settings)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) { console.error('Error:', error) }
  }

  return (
    <div className="admin-settings page">
      <h1>{t('admin.settings')}</h1>
      {saved && <div className="success-message">{t('admin.settingsSaved')}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <section className="settings-section">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {t('admin.organizationInfo')}
          </h2>
          <div className="form-group">
            <label>{t('admin.organizationName')}</label>
            <input type="text" name="organization_name" value={settings.organization_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('admin.location')}</label>
            <input type="text" name="location" value={settings.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('admin.address')}</label>
            <input type="text" name="address" value={settings.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('admin.website')}</label>
            <input type="text" name="website" value={settings.website} onChange={handleChange} />
          </div>
        </section>

        <section className="settings-section">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {t('admin.contactInfo')}
          </h2>
          <div className="form-group">
            <label>{t('admin.email')}</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('admin.phone')}</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} />
          </div>
        </section>

        <section className="settings-section">
          <h2>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            {t('admin.generalSettings')}
          </h2>
          <div className="form-group">
            <label>{t('admin.membersCount')}</label>
            <input type="number" name="members_count" value={settings.members_count} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('admin.description')}</label>
            <textarea name="description" value={settings.description} onChange={handleChange} rows="4"></textarea>
          </div>
        </section>

        <button type="submit" className="btn-save">{t('admin.save')}</button>
      </form>
    </div>
  )
}

export default AdminSettings
