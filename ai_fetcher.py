#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced AI-Powered News Fetcher for SAMBO v3.0
Features:
- Scrapes sambo.sport and other SAMBO news sources
- Uses multiple free OpenRouter AI models with fallback
- News summarization, translation, and content generation
- Auto-fetch with intelligent caching and deduplication
- Sports insights, match analysis, and training tips
- Rate limiting and error recovery
"""

import requests
import json
import os
import re
import hashlib
import threading
import time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from html import unescape

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

FREE_MODELS = [
    'meta-llama/llama-3.2-3b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'huggingfaceh4/zephyr-7b-beta:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'deepseek/deepseek-chat:free',
]

NEWS_URLS = [
    'https://www.sambo.sport/en/news',
    'https://www.sambo.sport/ru/news',
    'https://www.sambo.sport/en/events',
    'https://www.sambo.sport/en/calendar',
    'https://www.sambo.sport/en/announcements',
]

SAMBO_NEWS_STORAGE = os.path.join(os.path.dirname(__file__), '.sambo_news.json')
AI_CACHE_FILE = os.path.join(os.path.dirname(__file__), '.ai_cache.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

class AINewsFetcher:
    """Enhanced AI news fetcher with sambo.sport integration and intelligent caching"""

    def __init__(self, api_key=None):
        self.ai_key = api_key or OPENROUTER_API_KEY
        self.news_cache = []
        self.ai_cache = {}
        self.fetch_stats = {
            'success': 0,
            'failed': 0,
            'last_fetch': None,
            'last_error': None,
            'total_fetched': 0,
        }
        self.lock = threading.Lock()
        self._running = False
        self.load_cache()
        self.load_ai_cache()

    def load_cache(self):
        """Load news cache from disk"""
        try:
            if os.path.exists(SAMBO_NEWS_STORAGE):
                with open(SAMBO_NEWS_STORAGE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.news_cache = data.get('news', [])
                    print(f"Loaded {len(self.news_cache)} cached news items")
        except Exception as e:
            print(f"Cache load error: {e}")
            self.news_cache = []

    def save_cache(self):
        """Save news cache to disk"""
        try:
            data = {
                'news': self.news_cache,
                'last_updated': datetime.now().isoformat(),
                'total_items': len(self.news_cache),
                'source': 'SAMBO AI News Fetcher v3.0',
                'version': '3.0.0',
            }
            with open(SAMBO_NEWS_STORAGE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Cache save error: {e}")

    def load_ai_cache(self):
        """Load AI response cache from disk"""
        try:
            if os.path.exists(AI_CACHE_FILE):
                with open(AI_CACHE_FILE, 'r', encoding='utf-8') as f:
                    self.ai_cache = json.load(f)
                print(f"Loaded {len(self.ai_cache)} AI cache entries")
        except Exception:
            self.ai_cache = {}

    def save_ai_cache(self):
        """Save AI response cache to disk"""
        try:
            with open(AI_CACHE_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.ai_cache, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"AI cache save error: {e}")

    def _cache_key(self, prompt):
        """Generate cache key for AI requests"""
        return hashlib.md5(prompt[:200].encode()).hexdigest()[:16]

    def scrape_sambo_sport(self, url):
        """Scrape news from sambo.sport with improved parsing"""
        try:
            response = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
            if response.status_code != 200:
                print(f"HTTP {response.status_code} for {url}")
                return []

            soup = BeautifulSoup(response.text, 'html.parser')
            news_items = []

            # Strategy 1: Look for article/post/card elements
            selectors = [
                'article',
                'div.news-item',
                'div.post',
                'div.card',
                'div.news-card',
                'div.item',
                'div.news-block',
                'li.news-item',
            ]

            for selector in selectors:
                articles = soup.select(selector)
                for article in articles:
                    item = self._extract_news_item(article, url)
                    if item:
                        news_items.append(item)

            # Strategy 2: Fallback - look for links with relevant keywords
            if not news_items:
                for link in soup.find_all('a', href=True):
                    text = link.get_text(strip=True)
                    if len(text) > 15 and any(kw in text.lower() for kw in [
                        'sambo', 'championship', 'tournament', 'competition',
                        'world', 'european', 'cup', 'medal', 'winner'
                    ]):
                        news_items.append({
                            'title': text[:150],
                            'url': link['href'] if link['href'].startswith('http') else 'https://www.sambo.sport' + link['href'],
                            'date': datetime.now().strftime('%Y-%m-%d'),
                            'description': '',
                            'source': 'sambo.sport',
                            'fetched_at': datetime.now().isoformat(),
                            'language': 'ru' if '/ru/' in url else 'en',
                        })

            # Strategy 3: Look for any meaningful headings
            if not news_items:
                for heading in soup.find_all(['h1', 'h2', 'h3'], class_=True):
                    text = heading.get_text(strip=True)
                    if len(text) > 10 and len(text) < 200:
                        parent = heading.parent
                        link = parent.find('a', href=True) if parent else None
                        news_items.append({
                            'title': text[:150],
                            'url': link['href'] if link and link['href'].startswith('http') else url,
                            'date': datetime.now().strftime('%Y-%m-%d'),
                            'description': '',
                            'source': 'sambo.sport',
                            'fetched_at': datetime.now().isoformat(),
                        })

            return news_items[:25]

        except requests.exceptions.Timeout:
            print(f"Timeout scraping {url}")
            return []
        except requests.exceptions.ConnectionError:
            print(f"Connection error scraping {url}")
            return []
        except Exception as e:
            print(f"Scrape error {url}: {e}")
            return []

    def _extract_news_item(self, element, base_url):
        """Extract a news item from an HTML element"""
        try:
            # Find title
            title_el = element.find(['h1', 'h2', 'h3', 'a'], class_=True)
            if not title_el:
                title_el = element.find('a')
            if not title_el:
                title_el = element

            title = title_el.get_text(strip=True)
            if not title or len(title) < 10:
                return None

            # Find link
            link_el = element.find('a', href=True)
            if not link_el:
                link_el = title_el.find('a', href=True) if title_el != element else None

            link = link_el['href'] if link_el else base_url
            if not link.startswith('http'):
                link = 'https://www.sambo.sport' + link

            # Find date
            date_el = element.find(['time', 'span', 'div'], class_=re.compile(r'date|time|published', re.I))
            date = date_el.get_text(strip=True) if date_el else datetime.now().strftime('%Y-%m-%d')

            # Find description
            desc_el = element.find(['p', 'div'], class_=re.compile(r'desc|excerpt|summary|text|content', re.I))
            description = desc_el.get_text(strip=True)[:300] if desc_el else ''

            # Find image
            img_el = element.find('img', src=True)
            image = img_el['src'] if img_el else ''

            return {
                'title': unescape(title),
                'url': link,
                'date': date,
                'description': unescape(description),
                'image': image,
                'source': 'sambo.sport',
                'fetched_at': datetime.now().isoformat(),
                'language': 'ru' if '/ru/' in base_url else 'en',
            }
        except Exception:
            return None

    def fetch_sambo_news(self):
        """Fetch all SAMBO news from all sources with deduplication"""
        all_news = []

        for url in NEWS_URLS:
            print(f"Fetching {url}...")
            items = self.scrape_sambo_sport(url)
            all_news.extend(items)
            time.sleep(1.5)  # Rate limiting

        if all_news:
            # Deduplicate by title similarity
            seen = set()
            unique_news = []
            for item in all_news:
                # Normalize title for comparison
                key = re.sub(r'[^\w\s]', '', item['title'][:50].lower().strip())
                if key not in seen and key:
                    seen.add(key)
                    unique_news.append(item)

            # Sort by date (newest first)
            unique_news.sort(key=lambda x: x.get('fetched_at', ''), reverse=True)

            with self.lock:
                self.news_cache = unique_news
                self.fetch_stats['success'] += 1
                self.fetch_stats['last_fetch'] = datetime.now().isoformat()
                self.fetch_stats['total_fetched'] += len(unique_news)
                self.save_cache()

            print(f"Fetched {len(unique_news)} unique news items")
        else:
            self.fetch_stats['failed'] += 1
            self.fetch_stats['last_error'] = 'No news items found'
            print("No news items found, using cached data")

        return self.news_cache

    def call_openrouter(self, prompt, model=None, max_tokens=500):
        """Call OpenRouter API with free model and automatic fallback"""
        if not self.ai_key:
            return {
                'status': 'no_key',
                'message': 'Set OPENROUTER_API_KEY environment variable for AI features',
                'content': 'AI features require an OpenRouter API key. Get one at https://openrouter.ai',
            }

        cache_key = self._cache_key(prompt)

        # Check cache (1 hour TTL)
        if cache_key in self.ai_cache:
            cached = self.ai_cache[cache_key]
            if datetime.now().timestamp() - cached.get('timestamp', 0) < 3600:
                return cached.get('response', {})

        # Try each model in order
        for model in FREE_MODELS:
            try:
                payload = {
                    'model': model,
                    'messages': [{'role': 'user', 'content': prompt}],
                    'temperature': 0.7,
                    'max_tokens': max_tokens,
                }

                headers = {
                    'Authorization': f'Bearer {self.ai_key}',
                    'HTTP-Referer': 'https://kemi-sambo.fun',
                    'X-Title': 'SAMBO Website',
                    'Content-Type': 'application/json',
                }

                response = requests.post(OPENROUTER_API_URL, json=payload, headers=headers, timeout=30)

                if response.status_code == 200:
                    data = response.json()
                    content = data['choices'][0]['message']['content']
                    result = {
                        'status': 'success',
                        'content': content,
                        'model': model,
                        'tokens': data.get('usage', {}).get('total_tokens', 0),
                    }

                    # Cache the result
                    self.ai_cache[cache_key] = {
                        'response': result,
                        'timestamp': datetime.now().timestamp(),
                    }
                    self.save_ai_cache()

                    return result
                elif response.status_code == 429:
                    # Rate limited, try next model
                    continue
                elif response.status_code >= 500:
                    # Server error, try next model
                    continue
                else:
                    continue

            except requests.exceptions.Timeout:
                continue
            except Exception:
                continue

        return {'status': 'error', 'message': 'All AI models failed. Please try again later.'}

    def summarize_news(self, text, language='en'):
        """Summarize news text using AI"""
        lang_names = {'en': 'English', 'ru': 'Russian', 'fi': 'Finnish'}
        lang = lang_names.get(language, 'English')

        prompt = f"""You are a SAMBO sports news editor. Summarize the following news article in 2-3 concise sentences in {lang}. Focus on the key facts and outcomes.

Article:
{text[:1000]}

Summary:"""
        return self.call_openrouter(prompt)

    def translate_text(self, text, from_lang='ru', to_lang='en'):
        """Translate text using AI with context awareness"""
        lang_names = {'en': 'English', 'ru': 'Russian', 'fi': 'Finnish'}
        from_name = lang_names.get(from_lang, from_lang)
        to_name = lang_names.get(to_lang, to_lang)

        prompt = f"""You are a professional translator specializing in sports terminology. Translate the following text from {from_name} to {to_name}. Preserve SAMBO-specific terms and proper names.

Text to translate:
{text[:1000]}

Translation:"""
        return self.call_openrouter(prompt)

    def generate_article(self, topic, language='en', style='news'):
        """Generate AI article about SAMBO topic"""
        lang_names = {'en': 'English', 'ru': 'Russian', 'fi': 'Finnish'}
        lang = lang_names.get(language, 'English')

        style_prompts = {
            'news': 'Write a professional news article',
            'blog': 'Write an engaging blog post',
            'analysis': 'Write a detailed analytical piece',
            'preview': 'Write an exciting tournament preview',
            'report': 'Write a comprehensive match report',
        }

        action = style_prompts.get(style, 'Write about')
        prompt = f"""You are a SAMBO sports journalist. {action} about '{topic}' in SAMBO sports.

Requirements:
- Write in {lang}
- 200-300 words
- Include recent developments and context
- Use professional sports journalism style
- Be factual and engaging

Article:"""

        result = self.call_openrouter(prompt, max_tokens=600)
        if result.get('status') == 'success':
            result['title'] = topic
            result['language'] = language
            result['style'] = style
        return result

    def analyze_match(self, red_name, blue_name, red_score, blue_score):
        """Generate AI match analysis with detailed breakdown"""
        winner = 'Red' if red_score > blue_score else 'Blue' if blue_score > red_score else 'Draw'

        prompt = f"""You are a SAMBO sports analyst. Provide a professional match analysis for this SAMBO bout:

🔴 Red: {red_name} - Score: {red_score}
🔵 Blue: {blue_name} - Score: {blue_score}
🏆 Winner: {winner}

Provide:
1. A brief match summary (2-3 sentences)
2. Key moments analysis
3. Technical observations
4. What this result means for both athletes

Keep it professional and insightful."""
        return self.call_openrouter(prompt)

    def get_training_tips(self, level='beginner', focus='technique'):
        """Generate AI training tips with practical advice"""
        prompt = f"""You are a SAMBO master coach. Provide 5 specific, practical training tips for {level} level athletes focusing on {focus}.

For each tip include:
- The technique or concept
- How to practice it
- Common mistakes to avoid
- Progression advice

Format as a numbered list with clear headings."""
        return self.call_openrouter(prompt, max_tokens=500)

    def auto_fetch_loop(self, interval=1800):
        """Auto-fetch news in background with error recovery"""
        self._running = True
        print(f"AI auto-fetch started (every {interval}s)")
        while self._running:
            try:
                self.fetch_sambo_news()
                time.sleep(interval)
            except Exception as e:
                print(f"Auto-fetch error: {e}")
                self.fetch_stats['last_error'] = str(e)
                time.sleep(300)  # Wait 5 minutes before retry

    def start_auto_fetch(self, interval=1800):
        """Start background auto-fetch thread"""
        thread = threading.Thread(target=self.auto_fetch_loop, args=(interval,), daemon=True)
        thread.start()
        return thread

    def stop_auto_fetch(self):
        """Stop the auto-fetch loop"""
        self._running = False

    def get_cached_news(self, limit=20):
        """Get cached news items"""
        return self.news_cache[:limit]

    def get_stats(self):
        """Get comprehensive fetcher statistics"""
        return {
            'cached_news': len(self.news_cache),
            'fetch_stats': self.fetch_stats,
            'ai_key_set': bool(self.ai_key),
            'available_models': len(FREE_MODELS),
            'cache_entries': len(self.ai_cache),
            'status': 'active' if self.ai_key else 'no_api_key',
            'version': '3.0.0',
            'models': [m.split('/')[0] for m in FREE_MODELS],
        }


ai_fetcher = None

def initialize_ai_fetcher(api_key=None):
    """Initialize and return AI fetcher instance"""
    global ai_fetcher
    ai_fetcher = AINewsFetcher(api_key=api_key)
    return ai_fetcher

def get_ai_fetcher():
    """Get existing or create new AI fetcher instance"""
    global ai_fetcher
    if ai_fetcher is None:
        ai_fetcher = AINewsFetcher()
    return ai_fetcher

if __name__ == '__main__':
    print("=" * 70)
    print("  SAMBO AI News Fetcher v3.0")
    print("=" * 70)

    fetcher = AINewsFetcher()

    print("\n[1/4] Fetching news from sambo.sport...")
    news = fetcher.fetch_sambo_news()
    print(f"      Found {len(news)} items")

    if news:
        print("\n[2/4] Latest headlines:")
        for i, item in enumerate(news[:5], 1):
            print(f"      {i}. {item['title'][:80]}")

    print("\n[3/4] Statistics:")
    stats = fetcher.get_stats()
    for k, v in stats.items():
        if k != 'models':
            print(f"      {k}: {v}")

    print("\n[4/4] Available AI models:")
    for m in stats.get('models', []):
        print(f"      - {m}")

    print("\n" + "=" * 70)
