import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/Contact.css'

function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const infoItems = [
    { icon: <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: t('contact.address'), lines: ['Kemin SamBO ry', 'Rytikarin, Kemi', 'Finland'] },
    { icon: <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, title: t('contact.phone'), lines: ['+358 (0) XXX XXX XXXX'] },
    { icon: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title: t('contact.email'), lines: ['info@kemi-sambo.fun'] },
    { icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: t('contact.website'), lines: ['kemi-sambo.fun'] },
    { icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: t('contact.hours'), lines: ['Mon - Fri: 09:00 - 20:00', 'Sat: 10:00 - 16:00', 'Sun: Closed'] },
  ]

  return (
    <div className="contact-page page">
      <div className="page-header">
        <h1>{t('nav.contact')}</h1>
        <p>Get in touch with us</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {t('contact.info')}
          </h2>
          {infoItems.map((item, i) => (
            <div key={i} className="info-item">
              <h3>{item.icon} {item.title}</h3>
              {item.lines.map((line, j) => <p key={j}>{line}</p>)}
            </div>
          ))}
        </div>

        <div className="contact-form">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {t('contact.sendMessage')}
          </h2>
          {submitted && <div className="success-message">{t('contact.messageSent')}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact.name')}</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.email')}</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">{t('contact.subject')}</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject" />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.message')}</label>
              <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required placeholder="Your message..." />
            </div>
            <button type="submit" className="btn-submit">
              <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              {t('contact.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
