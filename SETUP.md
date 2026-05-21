# Setup Guide - Kemi SamBO Website v5.0

## Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Python | 3.10+ | `python --version` |
| pip | Latest | `pip --version` |

## Installation

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

### 2. Environment Variables (Optional)

Create a `.env` file or export variables:

```bash
export SAMBO_DOMAIN=kemi-sambo.fun
export SAMBO_PORT=5000
export OPENROUTER_API_KEY=sk-or-xxx  # For AI features
```

### 3. Start the Application

**Development (two servers):**

```bash
# Terminal 1 - Backend API
python server.py

# Terminal 2 - Frontend (Vite dev server with hot reload)
npm run dev
```

**Production (single server):**

```bash
npm run build
python server.py
```

## Access Points

| Service | Development | Production |
|---------|-------------|------------|
| Website | http://localhost:3000 | http://your-domain:5000 |
| API | http://localhost:5000/api | http://your-domain:5000/api |
| Admin | /admin/login | /admin/login |

## Admin Access

The admin password **rotates every 2 minutes** for security.

**Get current password:**
- Visit: `http://localhost:5000/api/password`
- CLI: `python con.py password`
- Remote: `SAMBO_API_URL=http://your-domain/api python con.py password`

**Login:**
- Username: `admin`
- Password: (from /api/password)

## AI Features Setup

1. Get a free API key from [OpenRouter](https://openrouter.ai)
2. Set the environment variable:
   ```bash
   export OPENROUTER_API_KEY=your_key_here
   ```
3. Restart the server

**Available AI features:**
- News summarization
- Multi-language translation
- Article generation
- Match analysis
- Training tips

## Troubleshooting

### Frontend proxy errors (ECONNREFUSED)
```
Error: http proxy error: /api/...
```
**Fix:** Start the backend server first: `python server.py`

### Port already in use
```
Error: [Errno 98] Address already in use
```
**Fix:** Use a different port:
```bash
SAMBO_PORT=5001 python server.py
```

### AI features show "not available"
**Fix:** Set `OPENROUTER_API_KEY` environment variable and restart.

### Dependencies missing
**Fix:** Run `python run.py` which auto-installs missing packages.

### Data not persisting
**Fix:** Ensure `data.json` is writable:
```bash
chmod 666 data.json
```

## File Permissions

```bash
# Make scripts executable
chmod +x run.py server.py con.py ai_fetcher.py

# Ensure data files are writable
touch data.json
chmod 666 data.json
```

## Next Steps

1. Add your organization info via Admin → Settings
2. Create your first event, athlete, and news article
3. Customize colors in `src/index.css`
4. Update translations in `src/locales/`

---

For detailed feature documentation, see `FEATURES.md`.
For deployment guides, see `DEPLOYMENT.md`.
