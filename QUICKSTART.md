# Quick Start - Kemi SamBO Website v5.0

Get up and running in under 5 minutes.

## ⚡ Quick Setup

### Option 1: Auto Launcher (Easiest - 1 min)

```bash
python run.py
```

This automatically:
- Installs all Python dependencies
- Starts the backend server
- Opens your browser
- Shows the current admin password

### Option 2: Manual Start (2 min)

**Terminal 1 - Backend:**
```bash
pip install -r requirements.txt
python server.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Access

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin/login |
| API Status | http://localhost:5000/api/status |
| Current Password | http://localhost:5000/api/password |

## 🔐 Admin Login

- **Username**: `admin`
- **Password**: Changes every 2 minutes! Get it from `/api/password`

## 📝 Add Content

1. Login to admin panel
2. Use the sidebar to navigate: Events, Athletes, News, etc.
3. Click "+ Add" to create new items
4. Changes appear instantly on the website

## 🎨 Design

The site features a modern dark theme with:
- Glassmorphism cards
- Gradient text and borders
- Smooth animations
- Responsive layout for all devices

## ❓ Common Issues

**ECONNREFUSED errors in frontend?**
- The backend (Flask) is not running. Start it with `python server.py`

**Port already in use?**
- Change port: `SAMBO_PORT=5001 python server.py`

**AI features not working?**
- Set your API key: `export OPENROUTER_API_KEY=your_key`
- Get a free key at https://openrouter.ai

## 🚀 Production

```bash
npm run build
python server.py
```

The Flask server will serve the built files directly.

---

**Need help?** Check `README.md` or `SETUP.md` for detailed guides.
