# Website Generation Prompt

Copy and paste this prompt into any AI code generator to create this exact website:

---

Create a complete SAMBO sports website for "Kemin SamBO ry" in Kemi, Finland with the following specifications:

## Tech Stack
- **Frontend**: React 18 with Vite 5, React Router DOM 6, i18next for i18n
- **Backend**: Python Flask 3.0 with Flask-CORS, Flask-SocketIO
- **Styling**: Pure CSS3 with CSS variables for theming
- **AI**: OpenRouter API integration for news summarization and content generation

## Design Requirements

### Theme System
- Dark/light theme toggle with smooth 0.5s transitions
- CSS variables for all colors, stored in `:root` and `[data-theme='light']`
- Theme preference saved to localStorage
- Default theme: dark

### Dark Theme Colors
```css
--primary-color: #ef4444;
--primary-dark: #dc2626;
--primary-light: #f87171;
--accent-color: #fbbf24;
--bg-primary: #0f0f1a;
--bg-secondary: #1a1a2e;
--bg-glass: rgba(255, 255, 255, 0.05);
--border-glass: rgba(255, 255, 255, 0.1);
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
--text-muted: #64748b;
--success: #10b981;
--info: #3b82f6;
```

### Light Theme Colors
```css
--primary-color: #dc2626;
--accent-color: #d97706;
--bg-primary: #f8fafc;
--bg-secondary: #f1f5f9;
--bg-glass: rgba(255, 255, 255, 0.8);
--border-glass: rgba(0, 0, 0, 0.08);
--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;
```

### Visual Effects
- Glassmorphism cards: `backdrop-filter: blur(20px)` with semi-transparent backgrounds
- Gradient text on headings using `background-clip: text`
- Smooth hover animations with `transform: translateY()` and box-shadows
- CSS animations: fadeIn, fadeInUp, slideIn, pulse, float, glow, scaleIn, shimmer
- Staggered animation delays for grid items
- Floating emoji icons with pulse animation
- Gradient top-borders on cards that appear on hover

### Typography
- Font: Inter from Google Fonts (weights 300-900)
- Page headings: 3rem, 900 weight, gradient text
- Body: 400 weight, line-height 1.6

## Pages (10 public + admin)

### Public Pages
1. **Home**: Animated hero section with gradient background, features grid with emoji icons, AI news preview, location info cards, statistics counters
2. **Events**: Card grid with date, location, description, detail button
3. **Athletes**: Profile cards with photo, name, category, weight, achievements
4. **News**: Tabbed interface (All/AI/Local), news cards with images, AI badges, excerpts
5. **Tournaments**: Cards with type, date, level, participant count
6. **Rankings**: Filterable table with medals (🥇🥈🥉), points, wins, losses
7. **Gallery**: Image grid with hover overlay, lightbox modal viewer
8. **Training**: Program cards with level, age group, schedule, trainer, enroll button
9. **About**: Sections for history, mission, team grid, facilities list
10. **Contact**: Two-column layout with info cards and contact form

### Admin Panel
- Login page with dynamic password authentication
- Dashboard with statistics
- CRUD interfaces for events, athletes, news, tournaments, gallery, training programs

## Navigation
- Sticky navbar with glassmorphism effect
- Logo with gradient text and animated emoji
- Navigation links with animated underline on hover
- Theme toggle button (sun/moon icons)
- Language selector (EN/РУ/FI) as pill buttons
- Admin link and logout button

## API Error Handling
- All API calls must have fallback data when backend is unavailable
- Create an `apiFetch(endpoint, fallbackKey)` utility function
- Fallback data for: events, athletes, news, tournaments, rankings, gallery, training programs, statistics
- Show empty state components with icons when no data available
- Loading spinner during data fetch

## Backend API (Flask)
- 40+ REST endpoints for CRUD operations
- Dynamic password rotation every 2 minutes
- AI news fetching from sambo.sport with OpenRouter integration
- WebSocket support for real-time updates
- JSON file-based data storage
- CORS enabled

## File Structure
```
src/
├── context/ThemeContext.jsx
├── utils/api.js
├── components/Navigation.jsx
├── pages/{Home,Events,Athletes,News,About,Contact,Tournaments,Rankings,Gallery,Training}.jsx
├── admin/{AdminLogin,AdminPanel,AdminDashboard,AdminEvents,AdminAthletes,AdminNews,AdminSettings}.jsx
├── styles/{App,Navigation,Events,Athletes,News,About,Contact,Tournaments,Rankings,Gallery,Training}.css
├── locales/{en,ru,fi}.json
├── App.jsx
├── i18n.js
├── main.jsx
└── index.css
```

## Key Implementation Details
1. ThemeContext provides `theme` and `toggleTheme` via React context
2. apiFetch utility catches errors and returns fallback data from a FALLBACK_DATA object
3. All page components use `apiFetch` with appropriate fallback keys
4. CSS uses `animation: fadeInUp 0.5s ease-out both` with inline `animationDelay` for staggered effects
5. Empty state component with icon, heading, and description for no-data scenarios
6. Page header component with gradient h1 and subtitle paragraph
7. Glass cards with `backdrop-filter: blur(20px)` and border transitions
8. Responsive design with breakpoints at 768px and media queries for grid adjustments

## Internationalization
- Three languages: English (default), Russian, Finnish
- i18next with browser language detection
- Translation files in src/locales/
- Language selector in navigation bar

Build this as a complete, production-ready website with all the described features, animations, and error handling.
