#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Dynamic Password Manager for SAMBO Admin
- Auto-rotation every 2 minutes
- Strong 16-char passwords with symbols
- Password history tracking
- Thread-safe operations
"""

import os
import json
import time
import threading
import string
import random
import hashlib
from datetime import datetime, timedelta

PASSWORD_FILE = os.path.join(os.path.dirname(__file__), '.admin_password.json')
PASSWORD_HISTORY_FILE = os.path.join(os.path.dirname(__file__), '.password_history.json')
PASSWORD_CHANGE_INTERVAL = 120

class PasswordManager:
    def __init__(self, interval=PASSWORD_CHANGE_INTERVAL):
        self.interval = interval
        self.lock = threading.Lock()
        self.rotation_count = 0
        self.start_time = datetime.now()
        self.running = False
        self.current_password = self._load_password()

    def generate_password(self, length=16):
        lowercase = string.ascii_lowercase
        uppercase = string.ascii_uppercase
        digits = string.digits
        symbols = "!@#$%^&*()-_=+"
        all_chars = lowercase + uppercase + digits + symbols
        while True:
            password = ''.join(random.SystemRandom().choice(all_chars) for _ in range(length))
            if (any(c in lowercase for c in password) and
                any(c in uppercase for c in password) and
                any(c in digits for c in password) and
                any(c in symbols for c in password)):
                return password

    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()[:12]

    def _save_password(self, password):
        with self.lock:
            now = datetime.now()
            data = {
                'password': password,
                'timestamp': now.isoformat(),
                'next_change': (now + timedelta(seconds=self.interval)).isoformat(),
                'rotation_count': self.rotation_count + 1,
                'expires_at': (now + timedelta(seconds=self.interval)).timestamp()
            }
            os.makedirs(os.path.dirname(PASSWORD_FILE) or '.', exist_ok=True)
            with open(PASSWORD_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            os.environ['ADMIN_PASS'] = password
            os.environ['ADMIN_TOKEN'] = password
            self.current_password = password
            self.rotation_count += 1
            self._add_to_history(password, now)

    def _add_to_history(self, password, timestamp):
        try:
            history = []
            if os.path.exists(PASSWORD_HISTORY_FILE):
                with open(PASSWORD_HISTORY_FILE, 'r') as f:
                    history = json.load(f)
            history.append({
                'timestamp': timestamp.isoformat(),
                'hash': self._hash_password(password),
                'rotation': self.rotation_count + 1
            })
            if len(history) > 100:
                history = history[-50:]
            with open(PASSWORD_HISTORY_FILE, 'w') as f:
                json.dump(history, f, indent=2)
        except Exception as e:
            print(f"History error: {e}")

    def _load_password(self):
        try:
            if os.path.exists(PASSWORD_FILE):
                with open(PASSWORD_FILE, 'r') as f:
                    data = json.load(f)
                    stored_pass = data.get('password', '')
                    expires_at = data.get('expires_at', 0)
                    if time.time() < expires_at and stored_pass:
                        return stored_pass
        except Exception as e:
            print(f"Load error: {e}")
        initial_pass = self.generate_password()
        self._save_password(initial_pass)
        return initial_pass

    def get_password(self):
        with self.lock:
            return self.current_password

    def get_time_remaining(self):
        try:
            if os.path.exists(PASSWORD_FILE):
                with open(PASSWORD_FILE, 'r') as f:
                    data = json.load(f)
                    expires_at = data.get('expires_at', 0)
                    return max(0, int(expires_at - time.time()))
        except:
            pass
        return self.interval

    def rotate_password(self):
        new_password = self.generate_password()
        self._save_password(new_password)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Password rotated (#{self.rotation_count})")
        return new_password

    def start_rotation(self):
        self.running = True
        thread = threading.Thread(target=self._rotation_loop, daemon=True)
        thread.start()
        print(f"Password rotation started (every {self.interval}s)")

    def _rotation_loop(self):
        while self.running:
            time.sleep(self.interval)
            self.rotate_password()

    def stop_rotation(self):
        self.running = False

    def get_info(self):
        with self.lock:
            return {
                'password': self.current_password,
                'timestamp': datetime.now().isoformat(),
                'rotation_count': self.rotation_count,
                'time_remaining': self.get_time_remaining(),
                'interval': self.interval,
                'uptime': str(datetime.now() - self.start_time),
                'status': 'rotating' if self.running else 'stopped'
            }

    def get_history(self):
        try:
            if os.path.exists(PASSWORD_HISTORY_FILE):
                with open(PASSWORD_HISTORY_FILE, 'r') as f:
                    return json.load(f)
        except:
            pass
        return []

pm = None

def initialize_password_manager(interval=PASSWORD_CHANGE_INTERVAL):
    global pm
    pm = PasswordManager(interval=interval)
    pm.start_rotation()
    return pm

def get_password_manager():
    global pm
    if pm is None:
        pm = PasswordManager()
    return pm

if __name__ == '__main__':
    manager = PasswordManager()
    manager.start_rotation()
    print("=" * 60)
    print("SAMBO Admin Password Manager")
    print("=" * 60)
    print(f"Current: {manager.get_password()}")
    print(f"Interval: {manager.interval}s")
    print("\nRotating... (Ctrl+C to stop)")
    print("=" * 60)
    try:
        while True:
            time.sleep(10)
            info = manager.get_info()
            print(f"[{info['timestamp'][:19]}] Pass: {info['password']} | Next: {info['time_remaining']}s | Rotations: {info['rotation_count']}")
    except KeyboardInterrupt:
        print("\nStopped")
        manager.stop_rotation()
