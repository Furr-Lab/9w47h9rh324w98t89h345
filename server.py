#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMBO Website Backend Server - v4.0
Domain: kemi-sambo.fun
Features:
- Dynamic admin password (changes every 2 minutes)
- AI-powered news fetching from sambo.sport
- Public password endpoint for remote con.py access
- 40+ REST API endpoints
- Real-time WebSocket
- OpenRouter AI integration
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import json
import os
import threading
import time
from datetime import datetime
from functools import wraps

DOMAIN = os.environ.get('SAMBO_DOMAIN', 'kemi-sambo.fun')
PORT = int(os.environ.get('SAMBO_PORT', 5000))

try:
    from password_manager import initialize_password_manager, get_password_manager
except ImportError as e:
    print(f"password_manager error: {e}")

try:
    from ai_fetcher import initialize_ai_fetcher, get_ai_fetcher
except ImportError as e:
    print(f"ai_fetcher error: {e}")

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

password_manager = None
ai_fetcher = None

def init_managers():
    global password_manager, ai_fetcher
    try:
        password_manager = initialize_password_manager()
        print("Password manager initialized")
    except Exception as e:
        print(f"Password manager error: {e}")
    try:
        ai_fetcher = initialize_ai_fetcher()
        ai_fetcher.start_auto_fetch(interval=1800)
        print("AI fetcher initialized with auto-fetch")
    except Exception as e:
        print(f"AI fetcher error: {e}")

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {
        'events': [], 'athletes': [], 'news': [], 'tournaments': [],
        'rankings': [], 'gallery': [], 'training_programs': [],
        'schedule': [], 'announcements': [], 'coaches': [],
        'members': [], 'settings': {}, 'matches': [], 'protocols': []
    }

def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Save error: {e}")

def get_admin_password():
    global password_manager
    if password_manager:
        return password_manager.get_password()
    return os.environ.get('ADMIN_PASS', 'admin123')

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        password = request.args.get('token', '') or request.form.get('token', '')
        auth_value = token or password
        current_password = get_admin_password()
        if auth_value != current_password and auth_value != os.environ.get('ADMIN_TOKEN', 'admin123'):
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid credentials'}), 401
        return f(*args, **kwargs)
    return decorated

# ==================== PUBLIC SYSTEM ROUTES ====================

@app.route('/api/status')
def system_status():
    return jsonify({
        'status': 'running',
        'domain': DOMAIN,
        'timestamp': datetime.now().isoformat(),
        'version': '4.0.0',
        'features': {
            'dynamic_password': password_manager is not None,
            'ai_news': ai_fetcher is not None,
            'real_time': True,
            'api_endpoints': 40
        }
    })

@app.route('/api/password')
def get_public_password():
    """Public endpoint - returns current admin password for con.py remote access"""
    global password_manager
    if password_manager:
        info = password_manager.get_info()
        return jsonify({
            'password': info.get('password'),
            'timestamp': info.get('timestamp'),
            'time_remaining': info.get('time_remaining'),
            'rotation_count': info.get('rotation_count'),
            'interval': info.get('interval'),
            'domain': DOMAIN
        })
    return jsonify({'error': 'Password manager not available'}), 503

@app.route('/api/password/info')
def password_info():
    global password_manager
    if password_manager:
        info = password_manager.get_info()
        return jsonify({
            'rotation_enabled': True,
            'interval': info.get('interval', 120),
            'time_remaining': info.get('time_remaining', 0),
            'rotations': info.get('rotation_count', 0),
            'status': info.get('status', 'unknown')
        })
    return jsonify({'rotation_enabled': False})

@app.route('/api/password/current')
@admin_required
def get_current_password_secure():
    global password_manager
    if password_manager:
        info = password_manager.get_info()
        return jsonify({
            'password': info.get('password'),
            'expires_in': info.get('time_remaining'),
            'rotations': info.get('rotation_count')
        })
    return jsonify({'error': 'Not available'}), 503

# ==================== AI ROUTES ====================

@app.route('/api/ai/news')
def get_ai_news():
    global ai_fetcher
    if ai_fetcher:
        limit = request.args.get('limit', 20, type=int)
        news = ai_fetcher.get_cached_news(limit)
        return jsonify({
            'news': news,
            'count': len(news),
            'timestamp': datetime.now().isoformat()
        })
    return jsonify({'news': [], 'status': 'ai_not_available'})

@app.route('/api/ai/news/fetch', methods=['POST'])
@admin_required
def fetch_ai_news():
    global ai_fetcher
    if ai_fetcher:
        news = ai_fetcher.fetch_sambo_news()
        return jsonify({'status': 'success', 'count': len(news), 'news': news})
    return jsonify({'error': 'AI not available'}), 503

@app.route('/api/ai/summarize', methods=['POST'])
def ai_summarize():
    global ai_fetcher
    if not ai_fetcher:
        return jsonify({'error': 'AI not available'}), 503
    data = request.get_json()
    text = data.get('text', '')
    language = data.get('language', 'en')
    if not text:
        return jsonify({'error': 'No text'}), 400
    result = ai_fetcher.summarize_news(text, language)
    return jsonify(result)

@app.route('/api/ai/translate', methods=['POST'])
def ai_translate():
    global ai_fetcher
    if not ai_fetcher:
        return jsonify({'error': 'AI not available'}), 503
    data = request.get_json()
    result = ai_fetcher.translate_text(
        data.get('text', ''),
        data.get('from', 'ru'),
        data.get('to', 'en')
    )
    return jsonify(result)

@app.route('/api/ai/generate', methods=['POST'])
@admin_required
def ai_generate():
    global ai_fetcher
    if not ai_fetcher:
        return jsonify({'error': 'AI not available'}), 503
    data = request.get_json()
    result = ai_fetcher.generate_article(
        data.get('topic', 'SAMBO'),
        data.get('language', 'en'),
        data.get('style', 'news')
    )
    return jsonify(result)

@app.route('/api/ai/analyze-match', methods=['POST'])
def ai_analyze_match():
    global ai_fetcher
    if not ai_fetcher:
        return jsonify({'error': 'AI not available'}), 503
    data = request.get_json()
    result = ai_fetcher.analyze_match(
        data.get('red_name', ''),
        data.get('blue_name', ''),
        data.get('red_score', 0),
        data.get('blue_score', 0)
    )
    return jsonify(result)

@app.route('/api/ai/training-tips')
def ai_training_tips():
    global ai_fetcher
    if not ai_fetcher:
        return jsonify({'error': 'AI not available'}), 503
    level = request.args.get('level', 'beginner')
    focus = request.args.get('focus', 'technique')
    result = ai_fetcher.get_training_tips(level, focus)
    return jsonify(result)

@app.route('/api/ai/stats')
def ai_stats():
    global ai_fetcher
    if ai_fetcher:
        return jsonify(ai_fetcher.get_stats())
    return jsonify({'status': 'unavailable'})

# ==================== PUBLIC ROUTES ====================

@app.route('/api/info')
def get_info():
    return jsonify({
        'name': 'SAMBO Sports Organization',
        'domain': DOMAIN,
        'location': 'Kemi, Finland',
        'description': 'Professional SAMBO sports club',
        'languages': ['en', 'ru', 'fi']
    })

@app.route('/api/events')
def get_events():
    return jsonify(load_data().get('events', []))

@app.route('/api/athletes')
def get_athletes():
    return jsonify(load_data().get('athletes', []))

@app.route('/api/news')
def get_news():
    limit = request.args.get('limit', 10, type=int)
    data = load_data()
    news = data.get('news', [])
    return jsonify(sorted(news, key=lambda x: x.get('date', ''), reverse=True)[:limit])

@app.route('/api/tournaments')
def get_tournaments():
    return jsonify(load_data().get('tournaments', []))

@app.route('/api/rankings')
def get_rankings():
    data = load_data()
    rankings = data.get('rankings', [])
    return jsonify(sorted(rankings, key=lambda x: x.get('points', 0), reverse=True))

@app.route('/api/gallery')
def get_gallery():
    return jsonify(load_data().get('gallery', []))

@app.route('/api/training-programs')
def get_training_programs():
    return jsonify(load_data().get('training_programs', []))

@app.route('/api/schedule')
def get_schedule():
    return jsonify(load_data().get('schedule', []))

@app.route('/api/coaches')
def get_coaches():
    return jsonify(load_data().get('coaches', []))

@app.route('/api/announcements')
def get_announcements():
    data = load_data()
    announcements = data.get('announcements', [])
    return jsonify(sorted(announcements, key=lambda x: x.get('date', ''), reverse=True))

@app.route('/api/statistics')
def get_statistics():
    data = load_data()
    athletes = data.get('athletes', [])
    return jsonify({
        'total_athletes': len(athletes),
        'male_athletes': len([a for a in athletes if a.get('gender') == 'M']),
        'female_athletes': len([a for a in athletes if a.get('gender') == 'F']),
        'total_events': len(data.get('events', [])),
        'total_news': len(data.get('news', [])),
        'total_tournaments': len(data.get('tournaments', [])),
        'coaches': len(data.get('coaches', []))
    })

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    credentials = request.get_json()
    username = credentials.get('username')
    password = credentials.get('password')
    current_password = get_admin_password()
    if username == 'admin' and password == current_password:
        return jsonify({
            'token': current_password,
            'username': username,
            'message': 'Login successful',
            'expires_in': 120
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/admin/events', methods=['POST'])
@admin_required
def create_event():
    data = load_data()
    event = request.get_json()
    event['id'] = str(len(data['events']) + 1)
    event['created_at'] = datetime.now().isoformat()
    data['events'].append(event)
    save_data(data)
    socketio.emit('event_created', event)
    return jsonify(event), 201

@app.route('/api/admin/events/<event_id>', methods=['PUT'])
@admin_required
def update_event(event_id):
    data = load_data()
    idx = next((i for i, e in enumerate(data['events']) if e['id'] == event_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    data['events'][idx].update(request.get_json())
    save_data(data)
    return jsonify(data['events'][idx])

@app.route('/api/admin/events/<event_id>', methods=['DELETE'])
@admin_required
def delete_event(event_id):
    data = load_data()
    data['events'] = [e for e in data['events'] if e['id'] != event_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/athletes', methods=['POST'])
@admin_required
def create_athlete():
    data = load_data()
    athlete = request.get_json()
    athlete['id'] = str(len(data['athletes']) + 1)
    athlete['created_at'] = datetime.now().isoformat()
    data['athletes'].append(athlete)
    save_data(data)
    return jsonify(athlete), 201

@app.route('/api/admin/athletes/<athlete_id>', methods=['PUT'])
@admin_required
def update_athlete(athlete_id):
    data = load_data()
    idx = next((i for i, a in enumerate(data['athletes']) if a['id'] == athlete_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    data['athletes'][idx].update(request.get_json())
    save_data(data)
    return jsonify(data['athletes'][idx])

@app.route('/api/admin/athletes/<athlete_id>', methods=['DELETE'])
@admin_required
def delete_athlete(athlete_id):
    data = load_data()
    data['athletes'] = [a for a in data['athletes'] if a['id'] != athlete_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/news', methods=['POST'])
@admin_required
def create_news():
    data = load_data()
    article = request.get_json()
    article['id'] = str(len(data['news']) + 1)
    article['date'] = datetime.now().isoformat()
    data['news'].append(article)
    save_data(data)
    return jsonify(article), 201

@app.route('/api/admin/news/<news_id>', methods=['PUT'])
@admin_required
def update_news(news_id):
    data = load_data()
    idx = next((i for i, n in enumerate(data['news']) if n['id'] == news_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    data['news'][idx].update(request.get_json())
    save_data(data)
    return jsonify(data['news'][idx])

@app.route('/api/admin/news/<news_id>', methods=['DELETE'])
@admin_required
def delete_news(news_id):
    data = load_data()
    data['news'] = [n for n in data['news'] if n['id'] != news_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/tournaments', methods=['POST'])
@admin_required
def create_tournament():
    data = load_data()
    tournament = request.get_json()
    tournament['id'] = str(len(data.get('tournaments', [])) + 1)
    if 'tournaments' not in data:
        data['tournaments'] = []
    data['tournaments'].append(tournament)
    save_data(data)
    return jsonify(tournament), 201

@app.route('/api/admin/tournaments/<tournament_id>', methods=['DELETE'])
@admin_required
def delete_tournament(tournament_id):
    data = load_data()
    data['tournaments'] = [t for t in data.get('tournaments', []) if t['id'] != tournament_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/rankings', methods=['POST'])
@admin_required
def create_ranking():
    data = load_data()
    ranking = request.get_json()
    ranking['id'] = str(len(data.get('rankings', [])) + 1)
    if 'rankings' not in data:
        data['rankings'] = []
    data['rankings'].append(ranking)
    save_data(data)
    return jsonify(ranking), 201

@app.route('/api/admin/gallery', methods=['POST'])
@admin_required
def upload_gallery():
    data = load_data()
    image = request.get_json()
    image['id'] = str(len(data.get('gallery', [])) + 1)
    image['date'] = datetime.now().isoformat()
    if 'gallery' not in data:
        data['gallery'] = []
    data['gallery'].append(image)
    save_data(data)
    return jsonify(image), 201

@app.route('/api/admin/gallery/<image_id>', methods=['DELETE'])
@admin_required
def delete_gallery(image_id):
    data = load_data()
    data['gallery'] = [i for i in data.get('gallery', []) if i['id'] != image_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/training-programs', methods=['POST'])
@admin_required
def create_training_program():
    data = load_data()
    program = request.get_json()
    program['id'] = str(len(data.get('training_programs', [])) + 1)
    if 'training_programs' not in data:
        data['training_programs'] = []
    data['training_programs'].append(program)
    save_data(data)
    return jsonify(program), 201

@app.route('/api/admin/training-programs/<program_id>', methods=['DELETE'])
@admin_required
def delete_training_program(program_id):
    data = load_data()
    data['training_programs'] = [p for p in data.get('training_programs', []) if p['id'] != program_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/schedule', methods=['POST'])
@admin_required
def create_schedule():
    data = load_data()
    schedule = request.get_json()
    schedule['id'] = str(len(data.get('schedule', [])) + 1)
    if 'schedule' not in data:
        data['schedule'] = []
    data['schedule'].append(schedule)
    save_data(data)
    return jsonify(schedule), 201

@app.route('/api/admin/schedule/<schedule_id>', methods=['DELETE'])
@admin_required
def delete_schedule(schedule_id):
    data = load_data()
    data['schedule'] = [s for s in data.get('schedule', []) if s['id'] != schedule_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/announcements', methods=['POST'])
@admin_required
def create_announcement():
    data = load_data()
    announcement = request.get_json()
    announcement['id'] = str(len(data.get('announcements', [])) + 1)
    announcement['date'] = datetime.now().isoformat()
    if 'announcements' not in data:
        data['announcements'] = []
    data['announcements'].append(announcement)
    save_data(data)
    return jsonify(announcement), 201

@app.route('/api/admin/announcements/<announcement_id>', methods=['DELETE'])
@admin_required
def delete_announcement(announcement_id):
    data = load_data()
    data['announcements'] = [a for a in data.get('announcements', []) if a['id'] != announcement_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/admin/settings', methods=['GET'])
@admin_required
def get_settings():
    return jsonify(load_data().get('settings', {}))

@app.route('/api/admin/settings', methods=['PUT'])
@admin_required
def update_settings():
    data = load_data()
    data['settings'].update(request.get_json())
    save_data(data)
    return jsonify(data['settings'])

@app.route('/api/admin/matches', methods=['POST'])
@admin_required
def create_match():
    data = load_data()
    match = request.get_json()
    match['id'] = str(len(data.get('matches', [])) + 1)
    match['created_at'] = datetime.now().isoformat()
    if 'matches' not in data:
        data['matches'] = []
    data['matches'].append(match)
    save_data(data)
    socketio.emit('match_created', match)
    return jsonify(match), 201

@app.route('/api/admin/protocols', methods=['POST'])
@admin_required
def create_protocol():
    data = load_data()
    protocol = request.get_json()
    protocol['id'] = str(len(data.get('protocols', [])) + 1)
    protocol['created_at'] = datetime.now().isoformat()
    if 'protocols' not in data:
        data['protocols'] = []
    data['protocols'].append(protocol)
    save_data(data)
    return jsonify(protocol), 201

# ==================== SCOREBOARD ====================

@app.route('/api/scoreboard')
def get_scoreboard():
    data = load_data()
    return jsonify(data.get('scoreboard', {
        'red': {'score': 0, 'name': ''},
        'blue': {'score': 0, 'name': ''},
        'timer': 720,
        'running': False
    }))

@app.route('/api/scoreboard/update', methods=['POST'])
def update_scoreboard():
    data = load_data()
    data['scoreboard'] = request.get_json()
    save_data(data)
    socketio.emit('scoreboard_update', data['scoreboard'])
    return jsonify({'success': True})

# ==================== WEBSOCKET ====================

@socketio.on('connect')
def handle_connect():
    emit('connected', {'status': 'connected', 'timestamp': datetime.now().isoformat()})

@socketio.on('subscribe')
def handle_subscribe(data):
    emit('subscribed', {'channel': data.get('channel', 'all')})

# ==================== STATIC ====================

@app.route('/')
def serve_index():
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return """
    <html><body style="background:#0a0a0f;color:white;font-family:monospace;text-align:center;padding:50px">
    <h1>SAMBO Website - kemi-sambo.fun</h1>
    <p>Server running on """ + DOMAIN + """</p>
    <p>API Status: <a href="/api/status">/api/status</a></p>
    <p>AI News: <a href="/api/ai/news">/api/ai/news</a></p>
    <p>Password: <a href="/api/password">/api/password</a></p>
    </body></html>
    """

@app.errorhandler(404)
def serve_spa(e):
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    print("\n" + "=" * 70)
    print(f"  SAMBO WEBSITE SERVER v4.0")
    print(f"  Domain: {DOMAIN}")
    print(f"  Port: {PORT}")
    print("=" * 70)

    init_managers()

    print("\nFeatures:")
    print("  Dynamic password rotation (every 2 min)")
    print("  AI news from sambo.sport (auto-fetch)")
    print("  40+ API endpoints")
    print("  Real-time WebSocket")
    print("  Remote con.py access via /api/password")

    print(f"\nURLs:")
    print(f"  Website: https://{DOMAIN}")
    print(f"  API: https://{DOMAIN}/api/status")
    print(f"  Password: https://{DOMAIN}/api/password")
    print(f"  AI News: https://{DOMAIN}/api/ai/news")

    print(f"\nRemote con.py (from any PC):")
    print(f"  python con.py password")
    print(f"  python con.py watch")
    print(f"  python con.py info")
    print(f"  SAMBO_API_URL=https://{DOMAIN}/api python con.py password")

    print("\n" + "=" * 70)
    print(f"  Starting on 0.0.0.0:{PORT}")
    print("=" * 70 + "\n")

    socketio.run(app, debug=True, host='0.0.0.0', port=PORT, use_reloader=False, allow_unsafe_werkzeug=True)
