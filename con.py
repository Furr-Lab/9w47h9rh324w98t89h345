#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMBO Admin Connection Tool - Works from ANY PC
Connects to kemi-sambo.fun server remotely
Shows admin password, watches changes, tests login

Usage:
  python con.py                    # Interactive menu
  python con.py password           # Show current password
  python con.py watch              # Watch password changes live
  python con.py info               # Show all info
  python con.py connect            # Test server connection
  python con.py login              # Test admin login
  python con.py stats              # Server statistics
  python con.py news               # Latest AI news

  # Connect to different server:
  SAMBO_API_URL=https://your-server.com/api python con.py password
"""

import os
import sys
import time
import requests
from datetime import datetime

DEFAULT_API_URL = 'https://kemi-sambo.fun/api'
API_URL = os.environ.get('SAMBO_API_URL', DEFAULT_API_URL)

class AdminConnector:
    def __init__(self, api_url=None):
        self.api_url = (api_url or API_URL).rstrip('/')
        self.password = None
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'SAMBO-Con/4.0'
        })

    def fetch_password(self):
        """Fetch current password from remote server"""
        try:
            r = self.session.get(f'{self.api_url}/password', timeout=10)
            if r.status_code == 200:
                data = r.json()
                self.password = data.get('password')
                return data
            return None
        except Exception as e:
            return None

    def display_password(self):
        """Show current admin password from server"""
        print("\n" + "=" * 60)
        print("  SAMBO ADMIN PASSWORD")
        print("=" * 60)

        data = self.fetch_password()
        if data and self.password:
            print(f"\n  Password:   {self.password}")
            print(f"  Updated:    {data.get('timestamp', 'N/A')[:19]}")
            print(f"  Changes in: {data.get('time_remaining', 0)}s")
            print(f"  Rotations:  {data.get('rotation_count', 0)}")
            print(f"  Server:     {data.get('domain', self.api_url)}")
            print("\n" + "=" * 60)
            return True
        else:
            print("\n  ERROR: Cannot connect to server")
            print(f"  URL: {self.api_url}/password")
            print("\n  Fix: Set SAMBO_API_URL env variable:")
            print(f"  SAMBO_API_URL=https://your-server.com/api python con.py password")
            print("\n" + "=" * 60)
            return False

    def connect_to_server(self):
        """Test connection to server"""
        print("\nConnecting to server...")
        print(f"  URL: {self.api_url}")
        try:
            r = self.session.get(f'{self.api_url}/status', timeout=10)
            if r.status_code == 200:
                data = r.json()
                print(f"\n  CONNECTED!")
                print(f"  Status:  {data.get('status')}")
                print(f"  Version: {data.get('version')}")
                print(f"  Domain:  {data.get('domain', 'N/A')}")
                features = data.get('features', {})
                print(f"  Dynamic password: {features.get('dynamic_password', False)}")
                print(f"  AI news: {features.get('ai_news', False)}")
                return True
            else:
                print(f"\n  ERROR: HTTP {r.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print(f"\n  ERROR: Cannot reach server at {self.api_url}")
            print(f"  Make sure the server is running")
            return False
        except Exception as e:
            print(f"\n  ERROR: {e}")
            return False

    def login_admin(self):
        """Test admin login with current password"""
        data = self.fetch_password()
        if not data or not self.password:
            print("\n  ERROR: Cannot get password from server")
            return False

        print("\nTesting admin login...")
        try:
            r = self.session.post(
                f'{self.api_url}/admin/login',
                json={'username': 'admin', 'password': self.password},
                timeout=10
            )
            if r.status_code == 200:
                data = r.json()
                print(f"\n  LOGIN SUCCESSFUL!")
                print(f"  Token: {data.get('token', '')[:20]}...")
                print(f"  Expires: {data.get('expires_in', 'N/A')}s")
                return True
            else:
                print(f"\n  LOGIN FAILED: HTTP {r.status_code}")
                if r.status_code == 401:
                    print("  Password may have rotated, try again")
                return False
        except Exception as e:
            print(f"\n  ERROR: {e}")
            return False

    def get_server_stats(self):
        """Get server statistics"""
        print("\nServer Statistics:")
        try:
            r = self.session.get(f'{self.api_url}/statistics', timeout=10)
            if r.status_code == 200:
                stats = r.json()
                for key, value in stats.items():
                    print(f"  {key}: {value}")
                return True
            return False
        except Exception as e:
            print(f"  ERROR: {e}")
            return False

    def get_ai_stats(self):
        """Get AI service stats"""
        print("\nAI Service:")
        try:
            r = self.session.get(f'{self.api_url}/ai/stats', timeout=10)
            if r.status_code == 200:
                stats = r.json()
                for key, value in stats.items():
                    print(f"  {key}: {value}")
                return True
            return False
        except Exception as e:
            print(f"  ERROR: {e}")
            return False

    def get_ai_news(self, limit=5):
        """Get latest AI-fetched news"""
        print(f"\nLatest SAMBO News ({limit} items):")
        try:
            r = self.session.get(f'{self.api_url}/ai/news?limit={limit}', timeout=10)
            if r.status_code == 200:
                data = r.json()
                news = data.get('news', [])
                if news:
                    for i, item in enumerate(news, 1):
                        title = item.get('title', 'No title')[:80]
                        date = item.get('date', '')
                        source = item.get('source', '')
                        print(f"\n  {i}. {title}")
                        if date:
                            print(f"     Date: {date}")
                        if source:
                            print(f"     Source: {source}")
                        url = item.get('url', '')
                        if url:
                            print(f"     URL: {url}")
                else:
                    print("  No news cached yet")
                return True
            return False
        except Exception as e:
            print(f"  ERROR: {e}")
            return False

    def get_password_info(self):
        """Get password rotation info"""
        print("\nPassword Rotation:")
        try:
            r = self.session.get(f'{self.api_url}/password/info', timeout=10)
            if r.status_code == 200:
                info = r.json()
                print(f"  Enabled: {info.get('rotation_enabled')}")
                print(f"  Interval: {info.get('interval', 120)}s")
                print(f"  Time remaining: {info.get('time_remaining', 0)}s")
                print(f"  Rotations: {info.get('rotations', 0)}")
                return True
            return False
        except Exception as e:
            print(f"  ERROR: {e}")
            return False

    def show_all_info(self):
        """Show everything"""
        self.display_password()
        self.connect_to_server()
        self.get_password_info()
        self.get_server_stats()
        self.get_ai_stats()
        self.get_ai_news()

    def watch_password(self):
        """Watch password changes in real-time from server"""
        print("\n" + "=" * 60)
        print("  WATCHING PASSWORD CHANGES (Ctrl+C to stop)")
        print(f"  Server: {self.api_url}")
        print("=" * 60)

        last_password = None

        try:
            while True:
                data = self.fetch_password()
                if data:
                    current = data.get('password')
                    if current != last_password:
                        now = datetime.now().strftime('%H:%M:%S')
                        print(f"\n  [{now}] NEW PASSWORD: {current}")
                        print(f"  Rotations: {data.get('rotation_count', 0)}")
                        print(f"  Next change: {data.get('time_remaining', 0)}s")
                        last_password = current
                time.sleep(5)
        except KeyboardInterrupt:
            print("\n\n  Stopped watching")

    def show_menu(self):
        """Interactive menu"""
        while True:
            print("\n" + "=" * 60)
            print("  SAMBO ADMIN CONNECTION MENU")
            print(f"  Server: {self.api_url}")
            print("=" * 60)
            print("  1. View current password")
            print("  2. Connect to server")
            print("  3. Test admin login")
            print("  4. Server statistics")
            print("  5. AI service stats")
            print("  6. Latest AI news")
            print("  7. Password rotation info")
            print("  8. Show all info")
            print("  9. Watch password changes (live)")
            print("  0. Exit")
            print("=" * 60)

            choice = input("\n  Select (0-9): ").strip()

            actions = {
                '1': self.display_password,
                '2': self.connect_to_server,
                '3': self.login_admin,
                '4': self.get_server_stats,
                '5': self.get_ai_stats,
                '6': lambda: self.get_ai_news(),
                '7': self.get_password_info,
                '8': self.show_all_info,
                '9': self.watch_password,
            }

            if choice == '0':
                print("\n  Goodbye!")
                break
            elif choice in actions:
                actions[choice]()
            else:
                print("  Invalid option")

def main():
    connector = AdminConnector()

    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()

        commands = {
            'password': connector.display_password,
            'pass': connector.display_password,
            'connect': connector.connect_to_server,
            'login': connector.login_admin,
            'stats': connector.get_server_stats,
            'ai-stats': connector.get_ai_stats,
            'news': lambda: connector.get_ai_news(),
            'info': connector.show_all_info,
            'watch': connector.watch_password,
        }

        if cmd in commands:
            commands[cmd]()
        elif cmd in ('--help', '-h', 'help'):
            print("""
  SAMBO Admin Connection Tool - Works from ANY PC

  Usage: python con.py [command]

  Commands:
    password    Show current admin password (from server)
    connect     Test server connection
    login       Test admin login
    stats       Server statistics
    ai-stats    AI service statistics
    news        Latest AI-fetched news from sambo.sport
    info        Show all information
    watch       Watch password changes in real-time
    help        Show this help

  Examples:
    python con.py password
    python con.py watch
    python con.py info
    python con.py

  Connect to different server:
    SAMBO_API_URL=https://your-server.com/api python con.py password
            """)
        else:
            print(f"  Unknown command: {cmd}")
            print("  Use 'python con.py help' for commands")
    else:
        connector.show_menu()

if __name__ == '__main__':
    main()
