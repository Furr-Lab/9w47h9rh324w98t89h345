import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import '../styles/Navigation.css'

const SunIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
)

const navItems = [
  { to: '/', labelKey: 'nav.home', icon: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: '/events', labelKey: 'nav.events', icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { to: '/athletes', labelKey: 'nav.athletes', icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: '/tournaments', labelKey: 'nav.tournaments', icon: <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg> },
  { to: '/rankings', labelKey: 'nav.rankings', icon: <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> },
  { to: '/news', labelKey: 'nav.news', icon: <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V2"/><line x1="16" y1="8" x2="10" y2="8"/><line x1="16" y1="12" x2="10" y2="12"/><line x1="16" y1="16" x2="10" y2="16"/></svg> },
  { to: '/gallery', labelKey: 'nav.gallery', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { to: '/training', labelKey: 'nav.training', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { to: '/about', labelKey: 'nav.about', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  { to: '/contact', labelKey: 'nav.contact', icon: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
]

function Navigation({ isAdmin, setIsAdmin }) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const changeLanguage = (lng) => i18n.changeLanguage(lng)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/>
          </svg>
          Kemin SamBO
        </Link>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <Link to={item.to} className="nav-links" onClick={() => setMenuOpen(false)}>
                  {item.icon}{t(item.labelKey)}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-links admin-link" onClick={() => setMenuOpen(false)}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  {t('nav.admin')}
                </Link>
              </li>
            )}
            {!isAdmin && (
              <li className="nav-item">
                <Link to="/admin/login" className="nav-links admin-link" onClick={() => setMenuOpen(false)}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {t('nav.adminLogin')}
                </Link>
              </li>
            )}
          </ul>

          <div className="nav-mobile-controls">
            <div className="language-selector">
              <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language?.startsWith('en') ? 'active' : ''}`}>EN</button>
              <button onClick={() => changeLanguage('ru')} className={`lang-btn ${i18n.language?.startsWith('ru') ? 'active' : ''}`}>РУ</button>
              <button onClick={() => changeLanguage('fi')} className={`lang-btn ${i18n.language?.startsWith('fi') ? 'active' : ''}`}>FI</button>
            </div>
            {isAdmin && (
              <button onClick={handleLogout} className="nav-links logout-link">
                <LogoutIcon /> {t('nav.logout')}
              </button>
            )}
          </div>
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="language-selector desktop-only">
            <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language?.startsWith('en') ? 'active' : ''}`}>EN</button>
            <button onClick={() => changeLanguage('ru')} className={`lang-btn ${i18n.language?.startsWith('ru') ? 'active' : ''}`}>РУ</button>
            <button onClick={() => changeLanguage('fi')} className={`lang-btn ${i18n.language?.startsWith('fi') ? 'active' : ''}`}>FI</button>
          </div>

          {isAdmin && (
            <button onClick={handleLogout} className="nav-links logout-link desktop-only">
              <LogoutIcon /> {t('nav.logout')}
            </button>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
