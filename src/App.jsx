import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Events from './pages/Events'
import Athletes from './pages/Athletes'
import News from './pages/News'
import About from './pages/About'
import Contact from './pages/Contact'
import Tournaments from './pages/Tournaments'
import Rankings from './pages/Rankings'
import Gallery from './pages/Gallery'
import Training from './pages/Training'
import AdminLogin from './admin/AdminLogin'
import AdminPanel from './admin/AdminPanel'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) setIsAdmin(true)
  }, [])

  return (
    <>
      <Navigation isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/training" element={<Training />} />
        <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin/*" element={isAdmin ? <AdminPanel /> : <AdminLogin setIsAdmin={setIsAdmin} />} />
      </Routes>
    </>
  )
}

export default App
