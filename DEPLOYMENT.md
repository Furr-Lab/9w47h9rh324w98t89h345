# Deployment Guide - Kemi SamBO Website

## 📦 Prerequisites

- Node.js 16+ (with npm)
- Python 3.8+
- Git (optional)
- A web hosting service

---

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
cd website

# Frontend dependencies
npm install

# Backend dependencies
pip install -r requirements.txt
```

### 2. Run Development Server

**Terminal 1 - Backend:**
```bash
python server.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Admin: http://localhost:3000/admin/login

---

## 🔐 Configuration

### Environment Variables

Create `.env` file in website directory:

```env
# Admin Authentication
ADMIN_TOKEN=your_secure_random_token
ADMIN_PASS=your_secure_password

# Optional: API Configuration
API_PORT=5000
API_HOST=0.0.0.0

# Optional: Security
DEBUG=False
SECRET_KEY=your_secret_key
```

### Update Organization Details

Edit `server.py` lines with organization info:

```python
'organization_name': 'Kemin SamBO ry',
'location': 'Kemi, Finland',
'address': 'Rytikarin, Kemi',
'website': 'kemi-sambo.fun',
'email': 'info@kemi-sambo.fun'
```

---

## 🏗️ Production Build

### 1. Build Frontend

```bash
npm run build
```

Creates optimized build in `dist/` folder.

### 2. Test Production Build

```bash
npm run preview
```

Preview production build locally.

### 3. Prepare Backend

Create production settings file `config.py`:

```python
class Config:
    DEBUG = False
    TESTING = False
    PROPAGATE_EXCEPTIONS = True

class ProductionConfig(Config):
    pass
```

---

## 🌐 Deployment Options

### Option 1: Shared Hosting (Simple)

1. **Upload Frontend:**
   - Build frontend: `npm run build`
   - Upload `dist/` contents to web root
   - Configure index.html rewrite for SPA

2. **Deploy Backend:**
   - Upload Python files
   - Install requirements
   - Run with Python hosting service

### Option 2: VPS/Cloud Server (Recommended)

**Using Ubuntu 20.04+:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# Install Gunicorn
pip3 install gunicorn

# Clone or upload project
git clone <your-repo>
cd website

# Install dependencies
npm install
pip3 install -r requirements.txt

# Build frontend
npm run build
```

### Option 3: Docker Deployment

**Dockerfile:**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install Node
RUN apt-get update && apt-get install -y nodejs npm

# Copy files
COPY . .

# Install dependencies
RUN npm install && pip install -r requirements.txt

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Run server
CMD ["python", "server.py"]
```

**Build and run:**

```bash
docker build -t kemi-sambo .
docker run -p 5000:5000 kemi-sambo
```

### Option 4: Heroku Deployment

**Create Procfile:**

```
web: gunicorn server:app
```

**Deploy:**

```bash
heroku create kemi-sambo
git push heroku main
```

### Option 5: Vercel (Frontend Only)

```bash
npm install -g vercel

# In website directory
vercel
```

Then deploy backend separately.

---

## 🔧 Server Configuration

### Using Gunicorn (Production)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

### Using Nginx as Reverse Proxy

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name kemi-sambo.fun;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Using Apache

**Enable mod_proxy:**

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
```

**.htaccess:**

```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

---

## 🔒 HTTPS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot certonly --nginx -d kemi-sambo.fun

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 📊 Database Migration (Optional)

### From JSON to PostgreSQL

1. **Install database:**
```bash
sudo apt install postgresql -y
```

2. **Create database:**
```bash
psql -U postgres
CREATE DATABASE kemi_sambo;
```

3. **Update server.py:**

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/kemi_sambo'
db = SQLAlchemy(app)

# Use SQLAlchemy models instead of JSON
```

---

## 📈 Monitoring & Maintenance

### Log Monitoring

```bash
# View Python logs
tail -f /var/log/gunicorn.log

# View Nginx logs
tail -f /var/log/nginx/error.log
```

### Backup Data

```bash
# Backup data.json
cp data.json data.json.backup

# Schedule daily backups
crontab -e

# Add line:
0 2 * * * cp /path/to/data.json /backups/data-$(date +\%Y\%m\%d).json
```

### Health Check

```bash
curl http://localhost:5000/api/info
```

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### CORS Errors

Ensure backend URL in frontend matches actual backend location.

### 502 Bad Gateway

Check if backend is running and Nginx/Apache is configured correctly.

### Database Connection Errors

Verify database credentials and connection string.

### Out of Memory

Increase available RAM or use load balancer to distribute traffic.

---

## 📋 Pre-Launch Checklist

- [ ] Environment variables set
- [ ] Database backed up
- [ ] HTTPS certificate installed
- [ ] Admin credentials changed
- [ ] Organization details updated
- [ ] Contact information verified
- [ ] Domain DNS configured
- [ ] Email notifications tested
- [ ] API endpoints tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Error handling working
- [ ] Logging enabled
- [ ] Backup system active

---

## 🎯 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm install -D rollup-plugin-visualizer
```

### Backend
```bash
# Use production WSGI server
pip install gunicorn gevent

# Run with gevent workers
gunicorn -w 4 -k gevent server:app
```

### Caching
- Enable Redis for session storage
- Set appropriate cache headers
- Use CDN for static files

---

## 📞 Support

For deployment issues:
- Check logs in `/var/log/`
- Test endpoints with curl
- Review firewall rules
- Verify all dependencies installed

**Contact**: info@kemi-sambo.fun

---

## 🔗 Useful Links

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated**: May 2026
**Version**: 1.0.0
