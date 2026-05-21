const FALLBACK_DATA = {
  events: [
    { id: 1, title: 'Kemin Cup 2025', date: '2025-06-15', location: 'Kemi Sports Hall, Kemi', description: 'Annual SAMBO tournament featuring competitors from across Finland. Categories for all age groups and skill levels.', image: '' },
    { id: 2, title: 'Northern Finland Championship', date: '2025-07-20', location: 'Oulu Arena, Oulu', description: 'Regional championship for Northern Finland athletes. Qualification for national championships.', image: '' },
    { id: 3, title: 'Summer Training Camp', date: '2025-08-05', location: 'Kemi Training Center, Kemi', description: 'Intensive week-long training camp for advanced SAMBO athletes.', image: '' }
  ],
  athletes: [
    { id: 1, name: 'Mikko Mäkelä', photo: '', category: 'Sports SAMBO', weight: '74kg', achievements: 'Finnish Champion 2024, Nordic Cup Bronze 2023' },
    { id: 2, name: 'Anna Nieminen', photo: '', category: 'Combat SAMBO', weight: '64kg', achievements: 'European Championship Silver 2024, Finnish Champion 2023' },
    { id: 3, name: 'Jussi Korhonen', photo: '', category: 'Sports SAMBO', weight: '90kg', achievements: 'Nordic Champion 2024, 2x Finnish Champion' },
    { id: 4, name: 'Elina Virtanen', photo: '', category: 'Combat SAMBO', weight: '56kg', achievements: 'World Junior Bronze 2024, Finnish Champion 2024' },
    { id: 5, name: 'Petri Laine', photo: '', category: 'Sports SAMBO', weight: '82kg', achievements: 'Finnish Cup Winner 2024, National Team Member' },
    { id: 6, name: 'Sofia Heikkinen', photo: '', category: 'Sports SAMBO', weight: '70kg', achievements: 'Nordic Junior Champion 2024, 3x Finnish Champion' }
  ],
  news: [
    { id: 1, title: 'Kemin SamBO ry Welcomes New Head Coach', excerpt: 'We are excited to announce the appointment of a new head coach with extensive international SAMBO experience.', content: '', image: '', source: 'local', date: '2025-05-01' },
    { id: 2, title: 'Successful Tournament Season Ahead', excerpt: 'Our athletes are preparing for an exciting summer tournament season with events across Finland and Scandinavia.', content: '', image: '', source: 'local', date: '2025-04-28' },
    { id: 3, title: 'New Training Equipment Arrives at Kemi Dojo', excerpt: 'State-of-the-art SAMBO mats and training equipment have been installed at our facility.', content: '', image: '', source: 'local', date: '2025-04-15' }
  ],
  tournaments: [
    { id: 1, name: 'Kemin Cup', type: 'Sports SAMBO', date: '2025-06-15', level: 'National', participants: 120 },
    { id: 2, name: 'Northern Lights Open', type: 'Combat SAMBO', date: '2025-07-10', level: 'International', participants: 200 },
    { id: 3, name: 'Winter Challenge', type: 'Both', date: '2025-12-05', level: 'Regional', participants: 80 }
  ],
  rankings: [
    { id: 1, name: 'Mikko Mäkelä', category: '-74kg', gold: 3, silver: 1, bronze: 2, points: 320, wins: 15, losses: 3 },
    { id: 2, name: 'Jussi Korhonen', category: '-90kg', gold: 4, silver: 0, bronze: 1, points: 410, wins: 18, losses: 2 },
    { id: 3, name: 'Anna Nieminen', category: '-64kg', gold: 2, silver: 3, bronze: 0, points: 290, wins: 12, losses: 4 },
    { id: 4, name: 'Elina Virtanen', category: '-56kg', gold: 1, silver: 2, bronze: 3, points: 210, wins: 10, losses: 5 },
    { id: 5, name: 'Petri Laine', category: '-82kg', gold: 2, silver: 2, bronze: 1, points: 250, wins: 11, losses: 4 },
    { id: 6, name: 'Sofia Heikkinen', category: '-70kg', gold: 3, silver: 1, bronze: 1, points: 340, wins: 16, losses: 2 }
  ],
  gallery: [
    { id: 1, url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800', title: 'Training Session', description: 'Intense training at Kemi Dojo' },
    { id: 2, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', title: 'Competition Day', description: 'Athletes competing in Kemin Cup' },
    { id: 3, url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', title: 'Team Photo', description: 'Kemin SamBO ry team 2024' },
    { id: 4, url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', title: 'Training Camp', description: 'Summer training camp activities' },
    { id: 5, url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', title: 'Award Ceremony', description: 'Medal ceremony at Northern Championship' },
    { id: 6, url: 'https://images.unsplash.com/photo-1583473848882-f6405dfcab24?w=800', title: 'Youth Program', description: 'Junior SAMBO training session' }
  ],
  training: [
    { id: 1, name: 'Beginner SAMBO', level: 'Beginner', ageGroup: '7-12 years', schedule: 'Mon/Wed 16:00-17:30', trainer: 'Mikko Mäkelä', description: 'Introduction to SAMBO techniques for children. Focus on basic throws, groundwork, and safe falling.' },
    { id: 2, name: 'Intermediate SAMBO', level: 'Intermediate', ageGroup: '13-17 years', schedule: 'Tue/Thu 17:00-18:30', trainer: 'Jussi Korhonen', description: 'Advanced techniques and combination drills for teenage athletes.' },
    { id: 3, name: 'Advanced Competitive', level: 'Advanced', ageGroup: '18+ years', schedule: 'Mon-Fri 18:00-20:00', trainer: 'Anna Nieminen', description: 'High-intensity training for competitive athletes preparing for national and international events.' }
  ],
  statistics: {
    total_athletes: 6,
    male_athletes: 4,
    female_athletes: 2,
    total_events: 3,
    total_news: 3,
    total_tournaments: 3,
    coaches: 4,
    athletes: 6,
    events: 3,
    news: 3,
    tournaments: 3,
    members: 45
  }
}

export async function apiFetch(endpoint, fallbackKey) {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data
  } catch {
    if (fallbackKey && FALLBACK_DATA[fallbackKey]) {
      console.warn(`[api] Using fallback data for: ${fallbackKey}`)
      return FALLBACK_DATA[fallbackKey]
    }
    return null
  }
}

export async function apiPost(endpoint, body, authToken) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = authToken
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  return res.json()
}

export async function apiPut(endpoint, body, authToken) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = authToken
  const res = await fetch(endpoint, { method: 'PUT', headers, body: JSON.stringify(body) })
  return res.json()
}

export async function apiDelete(endpoint, authToken) {
  const headers = {}
  if (authToken) headers['Authorization'] = authToken
  const res = await fetch(endpoint, { method: 'DELETE', headers })
  return res.json()
}

export { FALLBACK_DATA }
