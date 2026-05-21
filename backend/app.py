import json
import os
import hashlib
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from threading import Thread

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(32).hex()
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

PASSWORD_FILE = os.path.join(DATA_DIR, 'password.json')
password_rotated_at = time.time()

DATA_FILES = ['events', 'athletes', 'news', 'tournaments', 'rankings', 'gallery', 'training', 'settings']

def get_data_path(name):
    return os.path.join(DATA_DIR, f'{name}.json')

def load_data(name):
    path = get_data_path(name)
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return []

def save_data(name, data):
    path = get_data_path(name)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def load_password():
    if os.path.exists(PASSWORD_FILE):
        with open(PASSWORD_FILE, 'r') as f:
            return json.load(f).get('password', 'admin123')
    return 'admin123'

def save_password(pwd):
    with open(PASSWORD_FILE, 'w') as f:
        json.dump({'password': pwd}, f)
    global password_rotated_at
    password_rotated_at = time.time()

if not os.path.exists(PASSWORD_FILE):
    save_password('admin123')

def rotate_password():
    global password_rotated_at
    while True:
        time.sleep(120)
        current = load_password()
        new_pwd = hashlib.sha256((current + str(int(time.time()))).encode()).hexdigest()[:12]
        save_password(new_pwd)
        socketio.emit('password_rotated', {'password': new_pwd})

Thread(target=rotate_password, daemon=True).start()

def get_current_password():
    pwd = load_password()
    if time.time() - password_rotated_at > 120:
        new_pwd = hashlib.sha256((pwd + str(int(time.time()))).encode()).hexdigest()[:12]
        save_password(new_pwd)
    return load_password()

def require_auth(f):
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if auth != f'Bearer {get_current_password()}':
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(load_data('events'))

@app.route('/api/events', methods=['POST'])
@require_auth
def create_event():
    data = request.json
    events = load_data('events')
    event = {
        'id': len(events) + 1,
        'title': data.get('title', ''),
        'date': data.get('date', ''),
        'location': data.get('location', ''),
        'description': data.get('description', ''),
        'image': data.get('image', '')
    }
    events.append(event)
    save_data('events', events)
    socketio.emit('data_update', {'type': 'events'})
    return jsonify(event), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@require_auth
def update_event(event_id):
    data = request.json
    events = load_data('events')
    for e in events:
        if e['id'] == event_id:
            e.update({k: data.get(k, e[k]) for k in ['title', 'date', 'location', 'description', 'image']})
            save_data('events', events)
            socketio.emit('data_update', {'type': 'events'})
            return jsonify(e)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@require_auth
def delete_event(event_id):
    events = load_data('events')
    events = [e for e in events if e['id'] != event_id]
    save_data('events', events)
    socketio.emit('data_update', {'type': 'events'})
    return jsonify({'ok': True})

@app.route('/api/athletes', methods=['GET'])
def get_athletes():
    return jsonify(load_data('athletes'))

@app.route('/api/athletes', methods=['POST'])
@require_auth
def create_athlete():
    data = request.json
    athletes = load_data('athletes')
    athlete = {
        'id': len(athletes) + 1,
        'name': data.get('name', ''),
        'photo': data.get('photo', ''),
        'category': data.get('category', ''),
        'weight': data.get('weight', ''),
        'achievements': data.get('achievements', '')
    }
    athletes.append(athlete)
    save_data('athletes', athletes)
    socketio.emit('data_update', {'type': 'athletes'})
    return jsonify(athlete), 201

@app.route('/api/athletes/<int:athlete_id>', methods=['PUT'])
@require_auth
def update_athlete(athlete_id):
    data = request.json
    athletes = load_data('athletes')
    for a in athletes:
        if a['id'] == athlete_id:
            a.update({k: data.get(k, a[k]) for k in ['name', 'photo', 'category', 'weight', 'achievements']})
            save_data('athletes', athletes)
            socketio.emit('data_update', {'type': 'athletes'})
            return jsonify(a)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/athletes/<int:athlete_id>', methods=['DELETE'])
@require_auth
def delete_athlete(athlete_id):
    athletes = load_data('athletes')
    athletes = [a for a in athletes if a['id'] != athlete_id]
    save_data('athletes', athletes)
    socketio.emit('data_update', {'type': 'athletes'})
    return jsonify({'ok': True})

@app.route('/api/news', methods=['GET'])
def get_news():
    return jsonify(load_data('news'))

@app.route('/api/news', methods=['POST'])
@require_auth
def create_news():
    data = request.json
    news_list = load_data('news')
    news_item = {
        'id': len(news_list) + 1,
        'title': data.get('title', ''),
        'excerpt': data.get('excerpt', ''),
        'content': data.get('content', ''),
        'image': data.get('image', ''),
        'source': data.get('source', 'local'),
        'date': data.get('date', '')
    }
    news_list.append(news_item)
    save_data('news', news_list)
    socketio.emit('data_update', {'type': 'news'})
    return jsonify(news_item), 201

@app.route('/api/news/<int:news_id>', methods=['PUT'])
@require_auth
def update_news(news_id):
    data = request.json
    news_list = load_data('news')
    for n in news_list:
        if n['id'] == news_id:
            n.update({k: data.get(k, n[k]) for k in ['title', 'excerpt', 'content', 'image', 'source', 'date']})
            save_data('news', news_list)
            socketio.emit('data_update', {'type': 'news'})
            return jsonify(n)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/news/<int:news_id>', methods=['DELETE'])
@require_auth
def delete_news(news_id):
    news_list = load_data('news')
    news_list = [n for n in news_list if n['id'] != news_id]
    save_data('news', news_list)
    socketio.emit('data_update', {'type': 'news'})
    return jsonify({'ok': True})

@app.route('/api/news/ai-fetch', methods=['POST'])
@require_auth
def fetch_ai_news():
    try:
        api_key = request.json.get('api_key', '')
        if api_key:
            headers = {'Authorization': f'Bearer {api_key}'}
            payload = {
                'model': 'openai/gpt-4o-mini',
                'messages': [{
                    'role': 'user',
                    'content': 'Summarize the latest SAMBO news from sambo.sport in 3 bullet points. Return as JSON array with title, excerpt, date fields.'
                }]
            }
            resp = requests.post('https://openrouter.ai/api/v1/chat/completions', json=payload, headers=headers, timeout=15)
            if resp.ok:
                content = resp.json()['choices'][0]['message']['content']
                import re
                match = re.search(r'\[.*?\]', content, re.DOTALL)
                if match:
                    items = json.loads(match.group())
                    news_list = load_data('news')
                    for item in items:
                        item['id'] = len(news_list) + 1
                        item['source'] = 'ai'
                        item['image'] = item.get('image', '')
                        news_list.append(item)
                    save_data('news', news_list)
                    socketio.emit('data_update', {'type': 'news'})
                    return jsonify(items)
        return jsonify({'error': 'AI fetch failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tournaments', methods=['GET'])
def get_tournaments():
    return jsonify(load_data('tournaments'))

@app.route('/api/tournaments', methods=['POST'])
@require_auth
def create_tournament():
    data = request.json
    tournaments = load_data('tournaments')
    t = {
        'id': len(tournaments) + 1,
        'name': data.get('name', ''),
        'type': data.get('type', ''),
        'date': data.get('date', ''),
        'level': data.get('level', ''),
        'participants': data.get('participants', 0)
    }
    tournaments.append(t)
    save_data('tournaments', tournaments)
    socketio.emit('data_update', {'type': 'tournaments'})
    return jsonify(t), 201

@app.route('/api/tournaments/<int:tid>', methods=['PUT'])
@require_auth
def update_tournament(tid):
    data = request.json
    tournaments = load_data('tournaments')
    for t in tournaments:
        if t['id'] == tid:
            t.update({k: data.get(k, t[k]) for k in ['name', 'type', 'date', 'level', 'participants']})
            save_data('tournaments', tournaments)
            socketio.emit('data_update', {'type': 'tournaments'})
            return jsonify(t)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/tournaments/<int:tid>', methods=['DELETE'])
@require_auth
def delete_tournament(tid):
    tournaments = load_data('tournaments')
    tournaments = [t for t in tournaments if t['id'] != tid]
    save_data('tournaments', tournaments)
    socketio.emit('data_update', {'type': 'tournaments'})
    return jsonify({'ok': True})

@app.route('/api/rankings', methods=['GET'])
def get_rankings():
    return jsonify(load_data('rankings'))

@app.route('/api/rankings', methods=['POST'])
@require_auth
def create_ranking():
    data = request.json
    rankings = load_data('rankings')
    r = {
        'id': len(rankings) + 1,
        'name': data.get('name', ''),
        'category': data.get('category', ''),
        'gold': data.get('gold', 0),
        'silver': data.get('silver', 0),
        'bronze': data.get('bronze', 0),
        'points': data.get('points', 0),
        'wins': data.get('wins', 0),
        'losses': data.get('losses', 0)
    }
    rankings.append(r)
    save_data('rankings', rankings)
    return jsonify(r), 201

@app.route('/api/rankings/<int:rid>', methods=['PUT'])
@require_auth
def update_ranking(rid):
    data = request.json
    rankings = load_data('rankings')
    for r in rankings:
        if r['id'] == rid:
            r.update({k: data.get(k, r[k]) for k in ['name', 'category', 'gold', 'silver', 'bronze', 'points', 'wins', 'losses']})
            save_data('rankings', rankings)
            return jsonify(r)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/rankings/<int:rid>', methods=['DELETE'])
@require_auth
def delete_ranking(rid):
    rankings = load_data('rankings')
    rankings = [r for r in rankings if r['id'] != rid]
    save_data('rankings', rankings)
    return jsonify({'ok': True})

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    return jsonify(load_data('gallery'))

@app.route('/api/gallery', methods=['POST'])
@require_auth
def create_gallery_item():
    data = request.json
    gallery = load_data('gallery')
    item = {
        'id': len(gallery) + 1,
        'url': data.get('url', ''),
        'title': data.get('title', ''),
        'description': data.get('description', '')
    }
    gallery.append(item)
    save_data('gallery', gallery)
    socketio.emit('data_update', {'type': 'gallery'})
    return jsonify(item), 201

@app.route('/api/gallery/<int:gid>', methods=['PUT'])
@require_auth
def update_gallery_item(gid):
    data = request.json
    gallery = load_data('gallery')
    for g in gallery:
        if g['id'] == gid:
            g.update({k: data.get(k, g[k]) for k in ['url', 'title', 'description']})
            save_data('gallery', gallery)
            socketio.emit('data_update', {'type': 'gallery'})
            return jsonify(g)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/gallery/<int:gid>', methods=['DELETE'])
@require_auth
def delete_gallery_item(gid):
    gallery = load_data('gallery')
    gallery = [g for g in gallery if g['id'] != gid]
    save_data('gallery', gallery)
    socketio.emit('data_update', {'type': 'gallery'})
    return jsonify({'ok': True})

@app.route('/api/training', methods=['GET'])
def get_training():
    return jsonify(load_data('training'))

@app.route('/api/training', methods=['POST'])
@require_auth
def create_training():
    data = request.json
    training = load_data('training')
    t = {
        'id': len(training) + 1,
        'name': data.get('name', ''),
        'level': data.get('level', ''),
        'ageGroup': data.get('ageGroup', ''),
        'schedule': data.get('schedule', ''),
        'trainer': data.get('trainer', ''),
        'description': data.get('description', '')
    }
    training.append(t)
    save_data('training', training)
    socketio.emit('data_update', {'type': 'training'})
    return jsonify(t), 201

@app.route('/api/training/<int:tid>', methods=['PUT'])
@require_auth
def update_training(tid):
    data = request.json
    training = load_data('training')
    for t in training:
        if t['id'] == tid:
            t.update({k: data.get(k, t[k]) for k in ['name', 'level', 'ageGroup', 'schedule', 'trainer', 'description']})
            save_data('training', training)
            socketio.emit('data_update', {'type': 'training'})
            return jsonify(t)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/training/<int:tid>', methods=['DELETE'])
@require_auth
def delete_training(tid):
    training = load_data('training')
    training = [t for t in training if t['id'] != tid]
    save_data('training', training)
    socketio.emit('data_update', {'type': 'training'})
    return jsonify({'ok': True})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    pwd = data.get('password', '')
    if pwd == get_current_password():
        return jsonify({'token': f'Bearer {pwd}', 'success': True})
    return jsonify({'error': 'Invalid password', 'success': False}), 401

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    auth = request.headers.get('Authorization', '')
    if auth == f'Bearer {get_current_password()}':
        return jsonify({'authenticated': True})
    return jsonify({'authenticated': False}), 401

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'events': len(load_data('events')),
        'athletes': len(load_data('athletes')),
        'news': len(load_data('news')),
        'tournaments': len(load_data('tournaments'))
    })

@socketio.on('connect')
def handle_connect():
    emit('connected', {'message': 'Connected to SAMBO API'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
