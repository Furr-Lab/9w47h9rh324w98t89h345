# Kemi SamBO Website - API Documentation

## Overview

Complete REST API for the Kemi SamBO website. All responses are in JSON format.

**Base URL**: `http://localhost:5000/api`

---

## Authentication

Admin endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

Get token from `/api/admin/login` endpoint.

---

## Public Endpoints

### Organization Info

#### Get Organization Information
```
GET /api/info
```

Returns basic organization information including name, location, and languages.

**Example Response:**
```json
{
  "name": "Kemin SamBO ry",
  "location": "Kemi, Finland",
  "address": "Rytikarin, Kemi",
  "website": "kemi-sambo.fun",
  "description": "Professional SAMBO sports organization",
  "languages": ["en", "ru", "fi"]
}
```

---

### Events

#### Get All Events
```
GET /api/events
```

Returns list of all events.

**Example Response:**
```json
[
  {
    "id": "1",
    "title": "Regional Championship",
    "date": "2026-06-15T10:00:00",
    "location": "Kemi Sports Hall",
    "description": "Annual SAMBO championship",
    "category": "Professional",
    "created_at": "2026-05-21T10:00:00"
  }
]
```

#### Get Specific Event
```
GET /api/events/{event_id}
```

Returns details of a specific event.

---

### Athletes

#### Get All Athletes
```
GET /api/athletes
```

Returns list of all athletes.

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "category": "Heavyweight",
    "weight": 85,
    "height": 185,
    "birthDate": "1990-05-15",
    "achievements": "2x National Champion",
    "coach": "Head Coach",
    "gender": "M",
    "created_at": "2026-05-21T10:00:00"
  }
]
```

#### Get Specific Athlete
```
GET /api/athletes/{athlete_id}
```

Returns details of a specific athlete.

---

### News

#### Get All News
```
GET /api/news?limit=10
```

Returns list of news articles. Optional `limit` parameter (default: 10).

**Example Response:**
```json
[
  {
    "id": "1",
    "title": "Championship Results",
    "excerpt": "Final results of the recent championship...",
    "content": "Full article content here...",
    "category": "Results",
    "image": "https://example.com/image.jpg",
    "date": "2026-05-21T10:00:00"
  }
]
```

#### Get Specific News Article
```
GET /api/news/{news_id}
```

Returns full details of a specific news article.

---

### Tournaments

#### Get All Tournaments
```
GET /api/tournaments
```

Returns list of all tournaments.

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "National Championship",
    "type": "Championship",
    "date": "2026-07-10T09:00:00",
    "level": "National",
    "participants": 120,
    "location": "Kemi Sports Hall"
  }
]
```

---

### Rankings

#### Get Rankings
```
GET /api/rankings
```

Returns athlete rankings sorted by points (highest first).

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "category": "Heavyweight",
    "points": 2500,
    "wins": 45,
    "losses": 5,
    "rank": 1
  }
]
```

---

### Gallery

#### Get Gallery Images
```
GET /api/gallery
```

Returns list of gallery images.

**Example Response:**
```json
[
  {
    "id": "1",
    "title": "Championship Final",
    "url": "https://example.com/image.jpg",
    "category": "Events",
    "date": "2026-05-20T15:30:00"
  }
]
```

---

### Training Programs

#### Get Training Programs
```
GET /api/training-programs
```

Returns available training programs.

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "Beginner Program",
    "level": "Beginner",
    "ageGroup": "6-12",
    "schedule": "Mon, Wed, Fri 17:00",
    "trainer": "Coach Name",
    "description": "Basic SAMBO techniques",
    "capacity": 20,
    "enrolled": 18
  }
]
```

---

### Schedule

#### Get Weekly Schedule
```
GET /api/schedule
```

Returns weekly training schedule.

**Example Response:**
```json
[
  {
    "id": "1",
    "day": "Monday",
    "time": "17:00",
    "activity": "Beginner Training",
    "trainer": "Coach Name",
    "location": "Training Hall",
    "capacity": 20
  }
]
```

---

### Statistics

#### Get General Statistics
```
GET /api/statistics
```

Returns basic statistics.

**Example Response:**
```json
{
  "total_athletes": 150,
  "total_events": 8,
  "total_news": 25,
  "members": 300
}
```

#### Get Detailed Statistics
```
GET /api/stats
```

Returns comprehensive statistics.

**Example Response:**
```json
{
  "total_athletes": 150,
  "male_athletes": 95,
  "female_athletes": 55,
  "total_events": 8,
  "total_news": 25,
  "total_tournaments": 5,
  "members": 300,
  "coaches": 8
}
```

---

## Admin Endpoints

### Authentication

#### Admin Login
```
POST /api/admin/login
```

Authenticates admin user and returns token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "generated_token",
  "username": "admin"
}
```

---

### Events Management

#### Create Event
```
POST /api/admin/events
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "New Event",
  "date": "2026-06-15T10:00:00",
  "location": "Venue Name",
  "description": "Event details",
  "category": "Category"
}
```

#### Update Event
```
PUT /api/admin/events/{event_id}
Authorization: Bearer {token}
```

Updates specific event with new data.

#### Delete Event
```
DELETE /api/admin/events/{event_id}
Authorization: Bearer {token}
```

Deletes specific event.

---

### Athletes Management

#### Create Athlete
```
POST /api/admin/athletes
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Athlete Name",
  "category": "Weight Category",
  "weight": 80,
  "height": 180,
  "birthDate": "1995-03-10",
  "achievements": "Achievements",
  "coach": "Coach Name",
  "gender": "M"
}
```

#### Update Athlete
```
PUT /api/admin/athletes/{athlete_id}
Authorization: Bearer {token}
```

#### Delete Athlete
```
DELETE /api/admin/athletes/{athlete_id}
Authorization: Bearer {token}
```

---

### News Management

#### Create News Article
```
POST /api/admin/news
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Article Title",
  "excerpt": "Short excerpt",
  "content": "Full article content",
  "category": "Category",
  "image": "https://example.com/image.jpg"
}
```

#### Update News Article
```
PUT /api/admin/news/{news_id}
Authorization: Bearer {token}
```

#### Delete News Article
```
DELETE /api/admin/news/{news_id}
Authorization: Bearer {token}
```

---

### Gallery Management

#### Upload Gallery Image
```
POST /api/admin/gallery
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Image Title",
  "url": "https://example.com/image.jpg",
  "category": "Category"
}
```

#### Delete Gallery Image
```
DELETE /api/admin/gallery/{image_id}
Authorization: Bearer {token}
```

---

### Training Programs

#### Create Training Program
```
POST /api/admin/training-programs
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Program Name",
  "level": "Beginner",
  "ageGroup": "6-12",
  "schedule": "Mon, Wed, Fri 17:00",
  "trainer": "Coach Name",
  "description": "Program description",
  "capacity": 20
}
```

#### Delete Training Program
```
DELETE /api/admin/training-programs/{program_id}
Authorization: Bearer {token}
```

---

### Schedule Management

#### Create Schedule Entry
```
POST /api/admin/schedule
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "day": "Monday",
  "time": "17:00",
  "activity": "Activity Name",
  "trainer": "Coach Name",
  "location": "Location",
  "capacity": 20
}
```

#### Delete Schedule Entry
```
DELETE /api/admin/schedule/{schedule_id}
Authorization: Bearer {token}
```

---

### Announcements

#### Create Announcement
```
POST /api/admin/announcements
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Announcement Title",
  "content": "Announcement content",
  "priority": "high"
}
```

#### Delete Announcement
```
DELETE /api/admin/announcements/{announcement_id}
Authorization: Bearer {token}
```

---

### Settings

#### Get Settings
```
GET /api/admin/settings
Authorization: Bearer {token}
```

Returns organization settings.

#### Update Settings
```
PUT /api/admin/settings
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "organization_name": "New Name",
  "location": "New Location",
  "address": "New Address",
  "website": "website.com",
  "email": "email@example.com",
  "phone": "+358...",
  "members_count": 300,
  "description": "Organization description"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Implement as needed for production.

---

## CORS

CORS is enabled for all origins. Modify in production:

```python
CORS(app, resources={
    r"/api/*": {"origins": ["https://kemi-sambo.fun"]}
})
```

---

## Pagination

Add pagination with limit and offset:

```
GET /api/news?limit=10&offset=0
```

---

## Filtering

Filter events by category:

```
GET /api/events?category=Professional
```

Filter athletes by weight category:

```
GET /api/athletes?category=Heavyweight
```

---

## Version History

- **v1.0** (May 2026) - Initial release with core features
- Future: WebSocket support for real-time updates

---

## Support

For API issues or questions, contact: info@kemi-sambo.fun
