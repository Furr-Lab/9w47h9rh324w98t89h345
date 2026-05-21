#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMBO Website - Auto Launcher v4.0
- Auto-installs dependencies
- Auto-starts server
- Auto-fetches AI news
- Opens browser
- Shows password
Domain: kemi-sambo.fun
"""

import os
import sys
import subprocess
import webbrowser
import time
import threading

DOMAIN = os.environ.get('SAMBO_DOMAIN', 'kemi-sambo.fun')
PORT = int(os.environ.get('SAMBO_PORT', 5000))

def check_dependencies():
    required = {
        'flask': 'flask',
        'flask_cors': 'flask-cors',
        'flask_socketio': 'flask-socketio',
        'requests': 'requests',
        'bs4': 'beautifulsoup4',
    }
    missing = []
    for module, package in required.items():
        try:
            __import__(module)
        except ImportError:
            missing.append(package)
    if missing:
        print(f"\nInstalling: {', '.join(missing)}")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', *missing])
        print("Done!\n")

def print_banner():
    print("\n" + "=" * 70)
    print("  SAMBO WEBSITE v4.0 - AUTO LAUNCHER")
    print(f"  Domain: {DOMAIN}")
    print(f"  Port: {PORT}")
    print("  AI-Powered | Dynamic Password | sambo.sport Integration")
    print("=" * 70)

def print_info(password):
    print(f"\n  WEBSITE:  https://{DOMAIN}")
    print(f"  API:      https://{DOMAIN}/api/status")
    print(f"  PASSWORD: {password}")
    print(f"  Rotates:  Every 2 minutes automatically")

    print(f"\n  REMOTE ACCESS (from any PC):")
    print(f"  python con.py password")
    print(f"  python con.py watch")
    print(f"  python con.py info")
    print(f"  SAMBO_API_URL=https://{DOMAIN}/api python con.py password")

    print(f"\n  AI FEATURES:")
    print(f"  News from sambo.sport: /api/ai/news")
    print(f"  Auto-fetch: Every 30 minutes")
    print(f"  Set OPENROUTER_API_KEY for full AI features")

    print("\n" + "=" * 70)
    print("  Press Ctrl+C to stop")
    print("=" * 70 + "\n")

def open_browser():
    time.sleep(3)
    try:
        webbrowser.open(f'http://localhost:{PORT}')
    except:
        pass

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print_banner()
    check_dependencies()

    print("Starting server...")

    from password_manager import PasswordManager
    pm = PasswordManager()
    current_password = pm.get_password()

    threading.Thread(target=open_browser, daemon=True).start()
    print_info(current_password)

    try:
        from server import app, init_managers, socketio
        init_managers()
        socketio.run(app, debug=False, host='0.0.0.0', port=PORT, use_reloader=False, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("\nServer stopped")
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
