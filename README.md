# Kemi SamBO Website v5.0

Professional SAMBO sports website for Kemin SamBO ry in Kemi, Finland.

## ✨ Features

### Frontend
- **Multi-language Support**: English, Russian, Finnish
- **Responsive Design**: Mobile-first, works on all devices
- **Modern Dark UI**: Glassmorphism, gradients, smooth animations
- **React 18 + Vite 5**: Fast development and optimized builds
- **Pages**:
  - Home with animated hero section and live statistics
  - Events management with card-based layout
  - Athletes directory with profile cards
  - News with AI-powered content from sambo.sport
  - Tournaments with detailed information
  - Rankings table with category filters
  - Photo gallery with lightbox viewer
  - Training programs with enrollment
  - About us with team showcase
  - Contact page with form

### Admin Panel
- **Dashboard** with real-time statistics
- **Events Management**: Create, edit, delete events
- **Athletes Management**: Manage athlete profiles
- **News Management**: Publish articles
- **Settings**: Organization information, contact details
- **Authentication**: Secure admin login with dynamic password rotation

### Backend API
- **Flask 3.0** with 40+ RESTful endpoints
- **Flask-SocketIO** for real-time WebSocket communication
- **Flask-CORS** enabled for frontend communication
- **JSON-based storage** with 13 data collections
- **Dynamic password rotation** every 2 minutes
- **AI integration** via OpenRouter for news summarization and content generation

## 🚀 Quick Start

### Option 1: Auto Launcher (Recommended)
```bash
python run.py
```
This automatically installs dependencies, starts the server, and opens your browser.

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
python server.py

# Terminal 2 - Frontend
npm run dev
```

### Option 3: Production
```bash
npm run build
python server.py
```

## 📁 Project Structure

```
website/
├── src/
│   ├── pages/              # 10 page components
│   ├── components/         # Navigation, shared UI
│   ├── admin/              # 7 admin panel components
│   ├── styles/             # 18 CSS files (modern dark theme)
│   ├── locales/            # i18n translations (en/ru/fi)
│   ├── App.jsx             # Router configuration
│   ├── i18n.js             # Internationalization setup
│   └── main.jsx            # React entry point
├── server.py               # Flask backend (679 lines)
├── password_manager.py     # Dynamic password rotation
├── ai_fetcher.py           # AI news scraper + OpenRouter
├── con.py                  # Remote admin connector
├── run.py                  # Auto launcher
└── data.json               # Application data storage
```

## 🔐 Admin Access

**Username**: `admin`
**Password**: Changes every 2 minutes automatically

Get current password:
- Visit `/api/password` on the server
- Use `python con.py password` from any machine

## 📡 API Endpoints

### Public
| Endpoint | Description |
|----------|-------------|
| `GET /api/info` | Organization information |
| `GET /api/events` | All events |
| `GET /api/athletes` | All athletes |
| `GET /api/news` | News articles |
| `GET /api/tournaments` | Tournaments |
| `GET /api/rankings` | Rankings (sorted by points) |
| `GET /api/gallery` | Gallery images |
| `GET /api/training-programs` | Training programs |
| `GET /api/statistics` | Site statistics |
| `GET /api/scoreboard` | Live scoreboard |
| `GET /api/status` | Server status |

### AI-Powered
| Endpoint | Description |
|----------|-------------|
| `GET /api/ai/news` | AI-curated news from sambo.sport |
| `POST /api/ai/summarize` | Summarize text with AI |
| `POST /api/ai/translate` | Translate text with AI |
| `POST /api/ai/generate` | Generate articles with AI |
| `POST /api/ai/analyze-match` | AI match analysis |
| `GET /api/ai/training-tips` | AI training tips |

### Admin (Requires Authentication)
| Endpoint | Description |
|----------|-------------|
| `POST /api/admin/login` | Admin login |
| `POST/PUT/DELETE /api/admin/events` | Event CRUD |
| `POST/PUT/DELETE /api/admin/athletes` | Athlete CRUD |
| `POST/PUT/DELETE /api/admin/news` | News CRUD |
| `POST/DELETE /api/admin/tournaments` | Tournament CRUD |
| `POST/DELETE /api/admin/gallery` | Gallery CRUD |
| `GET/PUT /api/admin/settings` | Settings |

## 🌍 Languages

- **English (EN)** - Default
- **Russian (РУ)** - Full support
- **Finnish (FI)** - Full support

Language selector in the navigation bar.

## 🎨 Design System

### Colors
```css
--primary-color: #ef4444    /* Red */
--accent-color: #fbbf24     /* Gold */
--success: #10b981          /* Green */
--info: #3b82f6             /* Blue */
--bg-dark: #0f0f1a          /* Dark background */
--bg-glass: rgba(255,255,255,0.05)  /* Glass effect */
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 900 weight, gradient text
- **Body**: 400 weight, slate colors

### Effects
- Glassmorphism cards with backdrop blur
- Gradient borders and text
- Smooth hover animations
- Loading spinners
- Pulse animations for icons

## 🔧 Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| i18n | i18next, react-i18next |
| Backend | Flask 3.0, Flask-SocketIO, Flask-CORS |
| AI | OpenRouter API (free models: Llama, Gemma, Mistral, Qwen) |
| Scraping | BeautifulSoup4 |
| Styling | CSS3 (Glassmorphism, Gradients, Animations) |

## 📦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SAMBO_DOMAIN` | Website domain | `kemi-sambo.fun` |
| `SAMBO_PORT` | Backend port | `5000` |
| `OPENROUTER_API_KEY` | AI API key | (empty) |
| `ADMIN_TOKEN` | Fallback admin token | `admin123` |
| `ADMIN_PASS` | Fallback admin password | `admin123` |

## 📞 Contact

**Kemin SamBO ry**
- Location: Kemi, Finland
- Area: Rytikarin
- Website: kemi-sambo.fun
- Email: info@kemi-sambo.fun

## 📝 License

All rights reserved - Kemin SamBO ry

---

**Version**: 5.0.0 | **Last Updated**: May 2026
# kemi-sambo.fun
# kemi-sambo.fun
