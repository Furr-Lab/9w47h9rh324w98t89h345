import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../utils/api'
import '../styles/Gallery.css'

function Gallery() {
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/gallery', 'gallery').then(data => {
      setImages(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <div className="gallery-page page">
      <div className="page-header">
        <h1>{t('nav.gallery')}</h1>
        <p>Photos from events and training sessions</p>
      </div>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedImage(null)}>
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <img src={selectedImage.url} alt={selectedImage.title} />
            <p>{selectedImage.title}</p>
            {selectedImage.date && <p className="date">{new Date(selectedImage.date).toLocaleDateString()}</p>}
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="empty-state">
          <svg className="icon-empty" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <h3>{t('gallery.noImages')}</h3>
          <p>Photos will be added soon</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image, i) => (
            <div key={image.id} className="gallery-item" onClick={() => setSelectedImage(image)}>
              {image.url ? (
                <img src={image.url} alt={image.title} loading="lazy" />
              ) : (
                <div className="gallery-placeholder">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
              <div className="overlay">
                <p>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery
