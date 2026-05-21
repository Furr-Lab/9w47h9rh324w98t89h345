import React from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/About.css'

function About() {
  const { t } = useTranslation()

  const teamMembers = [
    { role: 'Head Coach', desc: 'International SAMBO Champion' },
    { role: 'Assistant Coach', desc: 'National Level Instructor' },
    { role: 'Sports Physician', desc: 'Athlete Health & Wellness' },
    { role: 'Manager', desc: 'Event Organization' },
  ]

  const facilities = [
    'Professional Training Mat', 'Strength & Conditioning Room',
    'Medical Clinic', 'Locker Rooms', 'Video Analysis Studio'
  ]

  return (
    <div className="about-page page">
      <div className="page-header">
        <h1>{t('nav.about')}</h1>
        <p>Learn more about Kemin SamBO ry</p>
      </div>

      <section className="about-section">
        <h2>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {t('about.history')}
        </h2>
        <p>Kemin SamBO ry is a professional SAMBO sports organization based in Kemi, Finland. Founded to promote SAMBO wrestling, we serve the community and organize competitions at local, national, and international levels.</p>
      </section>

      <section className="about-section">
        <h2>
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {t('about.mission')}
        </h2>
        <p>Our mission is to promote SAMBO as a sport, develop athletes, and create a supportive community for martial artists of all levels.</p>
      </section>

      <section className="about-section">
        <h2>
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {t('about.team')}
        </h2>
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <div key={i} className="team-member">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <h3>{member.role}</h3>
              <p>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          {t('about.facilities')}
        </h2>
        <ul>
          {facilities.map((item, i) => (
            <li key={i}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default About
