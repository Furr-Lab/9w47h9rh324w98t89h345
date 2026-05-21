# Kemi SamBO Website v5.0 - Features Guide

## 🌐 Public Website

### Pages

| Page | Description | Features |
|------|-------------|----------|
| **Home** | Landing page | Animated hero, stats, AI news preview |
| **Events** | Event listings | Card layout, date/location display |
| **Athletes** | Athlete directory | Profile cards with photos & achievements |
| **News** | News & blog | Tabs (All/AI/Local), AI badges, images |
| **Tournaments** | Tournament info | Type, level, participant count |
| **Rankings** | Leaderboard | Sortable table, category filters, medals |
| **Gallery** | Photo gallery | Grid layout, lightbox viewer, hover effects |
| **Training** | Programs | Level, age group, schedule, trainer info |
| **About** | Organization info | History, mission, team, facilities |
| **Contact** | Contact form | Info cards, form with validation |

### Design System

**Visual Style:**
- Dark theme with glassmorphism effects
- Gradient text and borders
- Smooth CSS animations (fadeIn, slideIn, pulse, glow)
- Backdrop blur on cards
- Hover transformations with shadows

**Color Palette:**
```
Primary:    #ef4444 (Red)
Accent:     #fbbf24 (Gold)
Success:    #10b981 (Green)
Info:       #3b82f6 (Blue)
Warning:    #f59e0b (Amber)
Error:      #ef4444 (Red)
Background: #0f0f1a (Dark navy)
Cards:      rgba(255,255,255,0.05) (Glass)
```

**Typography:**
- Font: Inter (Google Fonts)
- Headings: 900 weight with gradient
- Body: 400 weight, slate colors

### Internationalization

- **Languages**: English, Russian, Finnish
- **Detection**: Browser language auto-detection
- **Selector**: Navigation bar buttons (EN/РУ/FI)
- **Files**: `src/locales/{en,ru,fi}.json`

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px (mobile), 1024px (tablet)
- Adaptive navigation
- Touch-friendly targets
- Flexible grid layouts

---

## 🔧 Admin Panel

### Dashboard
- Real-time statistics
- Quick action buttons
- System status overview

### Content Management

| Module | Create | Edit | Delete | Features |
|--------|--------|------|--------|----------|
| Events | ✓ | ✓ | ✓ | Date, location, description |
| Athletes | ✓ | ✓ | ✓ | Photo, category, weight, achievements |
| News | ✓ | ✓ | ✓ | Title, image, excerpt, source |
| Tournaments | ✓ | - | ✓ | Type, level, participants |
| Gallery | ✓ | - | ✓ | Image URL, title, date |
| Training | ✓ | - | ✓ | Level, age, schedule, trainer |
| Schedule | ✓ | - | ✓ | Time, location, type |
| Announcements | ✓ | - | ✓ | Date, content, priority |
| Matches | ✓ | - | - | Red/blue players, scores |
| Protocols | ✓ | - | - | Match results, details |

### Settings
- Organization name and info
- Contact details
- Social media links
- System configuration

### Authentication
- Dynamic password rotation (every 2 min)
- Token-based session
- Secure admin routes

---

## 📡 Backend API

### Public Endpoints (15+)

```
GET  /api/info              - Organization info
GET  /api/events            - All events
GET  /api/athletes          - All athletes
GET  /api/news              - News articles
GET  /api/tournaments       - Tournaments
GET  /api/rankings          - Rankings (sorted)
GET  /api/gallery           - Gallery images
GET  /api/training-programs - Training programs
GET  /api/schedule          - Schedule
GET  /api/coaches           - Coaches
GET  /api/announcements     - Announcements
GET  /api/statistics        - Site statistics
GET  /api/scoreboard        - Live scoreboard
GET  /api/status            - Server status
GET  /api/password          - Current admin password
```

### AI Endpoints (8)

```
GET  /api/ai/news           - AI-curated news
POST /api/ai/news/fetch     - Trigger news fetch (admin)
POST /api/ai/summarize      - Summarize text
POST /api/ai/translate      - Translate text
POST /api/ai/generate       - Generate articles (admin)
POST /api/ai/analyze-match  - Match analysis
GET  /api/ai/training-tips  - Training tips
GET  /api/ai/stats          - AI fetcher stats
```

### Admin Endpoints (25+)

All admin routes require authentication via:
- `Authorization: Bearer <token>` header
- `?token=<token>` query parameter

```
POST   /api/admin/login              - Login
POST   /api/admin/events             - Create event
PUT    /api/admin/events/:id         - Update event
DELETE /api/admin/events/:id         - Delete event
POST   /api/admin/athletes           - Create athlete
PUT    /api/admin/athletes/:id       - Update athlete
DELETE /api/admin/athletes/:id       - Delete athlete
POST   /api/admin/news               - Create news
PUT    /api/admin/news/:id           - Update news
DELETE /api/admin/news/:id           - Delete news
... and more for tournaments, gallery, training, etc.
```

### WebSocket Events

```
connect     - Client connected
subscribe   - Subscribe to channel
event_created     - New event
match_created     - New match
scoreboard_update - Scoreboard changed
```

---

## 🤖 AI Features

### News Fetching
- Scrapes sambo.sport for latest news
- Intelligent deduplication
- Auto-fetch every 30 minutes
- Caching with TTL

### AI Models (Free via OpenRouter)
- Llama 3.2 3B
- Gemma 2 9B
- Mistral 7B
- Qwen 2 7B
- Phi-3 Mini
- Zephyr 7B
- Llama 3.1 8B
- DeepSeek Chat

### AI Capabilities
- **Summarization**: Condense news articles
- **Translation**: Multi-language with sports context
- **Generation**: Create articles, blog posts, analyses
- **Match Analysis**: Professional bout breakdowns
- **Training Tips**: Level-specific coaching advice

---

## 🔐 Security

### Password Rotation
- Auto-rotates every 120 seconds
- Strong 16-char passwords (upper, lower, digits, symbols)
- Password history tracking (last 100)
- Thread-safe operations

### Admin Authentication
- Token-based auth
- Bearer header or query param
- Fallback credentials via environment variables

### CORS
- Enabled for all origins (development)
- Configurable for production

---

## 📊 Data Storage

### JSON Collections (13)
- events, athletes, news, tournaments
- rankings, gallery, training_programs
- schedule, announcements, coaches
- members, settings, matches, protocols, scoreboard

### Cache Files
- `.sambo_news.json` - AI news cache
- `.ai_cache.json` - AI response cache
- `.admin_password.json` - Current password
- `.password_history.json` - Password history

---

## 🚀 Performance

### Frontend
- Vite 5 for fast builds
- Code splitting
- Lazy loading routes
- Optimized CSS

### Backend
- Threading async mode for SocketIO
- Intelligent caching
- Rate limiting on scraping
- Error recovery

---

**Version**: 5.0.0 | **Last Updated**: May 2026
