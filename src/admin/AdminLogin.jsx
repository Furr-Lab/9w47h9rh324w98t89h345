import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/AdminLogin.css'

function AdminLogin({ setIsAdmin }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('adminToken', data.token)
        setIsAdmin(true)
        navigate('/admin/dashboard')
      } else {
        setError(t('admin.invalidCredentials'))
      }
    } catch (err) {
      setError(t('admin.loginError'))
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <h1>{t('admin.login')}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('admin.username')}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('admin.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-login">{t('admin.login')}</button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
