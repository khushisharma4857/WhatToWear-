# WhatToWear - API Specifications

## API Overview

**Base URL**: `https://api.whatwear.app/v1`
**Authentication**: JWT Bearer Token in Authorization header
**Response Format**: JSON
**Rate Limits**: 100 requests/minute per user

---

## Authentication Endpoints

### 1. User Registration
```
POST /auth/register

Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "username": "fashionista_jane",
  "first_name": "Jane",
  "last_name": "Doe"
}

Response: 201 Created
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "fashionista_jane",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "created_at": "2024-01-15T10:30:00Z"
}

Error: 400 Bad Request
{
  "error": "email_already_exists",
  "message": "An account with this email already exists"
}
```

### 2. User Login
```
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "last_login_at": "2024-01-15T10:30:00Z"
}

Error: 401 Unauthorized
{
  "error": "invalid_credentials",
  "message": "Email or password is incorrect"
}
```

### 3. OAuth Login (Google)
```
POST /auth/oauth/google

Request:
{
  "code": "4/0AX4XfWh...",
  "redirect_uri": "https://whatwear.app/auth/callback"
}

Response: 200 OK
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "is_new_user": false,
  "expires_in": 900
}
```

### 4. OAuth Login (Apple)
```
POST /auth/oauth/apple

Request:
{
  "identity_token": "eyJraWQiOiJlWHAu..."
}

Response: 200 OK (same structure as Google OAuth)
```

### 5. Refresh Token
```
POST /auth/refresh

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900
}

Error: 401 Unauthorized
{
  "error": "invalid_refresh_token",
  "message": "Refresh token has expired or is invalid"
}
```

### 6. Logout
```
POST /auth/logout
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## User Profile Endpoints

### 7. Get User Profile
```
GET /users/me
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "fashionista_jane",
  "first_name": "Jane",
  "last_name": "Doe",
  "avatar_url": "https://cdn.whatwear.app/avatars/user123.jpg",
  "bio": "Fashion enthusiast | Sustainable style advocate",
  "skin_tone": "medium",
  "preferred_sizes": {
    "tops": "M",
    "bottoms": "8",
    "shoes": "7.5"
  },
  "style_preferences": ["minimalist", "sustainable", "vintage"],
  "is_public": true,
  "followers_count": 145,
  "following_count": 89,
  "wardrobe_count": 127,
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 8. Update User Profile
```
PATCH /users/me
Headers: Authorization: Bearer {access_token}

Request:
{
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "Sustainable fashion lover",
  "skin_tone": "medium",
  "style_preferences": ["minimalist", "boho"],
  "is_public": true
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "fashionista_jane",
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "Sustainable fashion lover",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### 9. Get Public User Profile
```
GET /users/{username}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "fashionista_jane",
  "avatar_url": "https://cdn.whatwear.app/avatars/user123.jpg",
  "bio": "Fashion enthusiast | Sustainable style advocate",
  "followers_count": 145,
  "following_count": 89,
  "wardrobe_count": 127,
  "is_following": false,
  "created_at": "2023-06-15T10:30:00Z"
}
```

---

## Wardrobe Endpoints

### 10. Get Wardrobe Items
```
GET /wardrobe
Headers: Authorization: Bearer {access_token}
Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20, max: 100)
  - category: string (tops|bottoms|outerwear|shoes|accessories|dress)
  - color: string (blue|red|black|white|etc)
  - season: string[]
  - occasion: string[]
  - style_tag: string[]
  - sort_by: string (created_at|-created_at|last_worn_at|wear_count|favorite)
  - search: string (full-text search)

Response: 200 OK
{
  "items": [
    {
      "id": "item-uuid-123",
      "user_id": "user-uuid-456",
      "image_url": "https://cdn.whatwear.app/items/item-uuid-123.jpg",
      "thumbnail_url": "https://cdn.whatwear.app/items/item-uuid-123-thumb.jpg",
      "category": "tops",
      "subcategory": "shirt",
      "colors": ["navy", "white"],
      "pattern": "striped",
      "material": "cotton",
      "sleeve_length": "long",
      "fit": "slim",
      "season": ["spring", "fall"],
      "occasions": ["casual", "office"],
      "style_tags": ["minimalist", "vintage"],
      "brand": "Everlane",
      "purchase_date": "2023-06-15",
      "purchase_price": 45.00,
      "condition": "good",
      "is_favorite": true,
      "is_archived": false,
      "wear_count": 12,
      "last_worn_at": "2024-01-10T18:00:00Z",
      "created_at": "2023-06-15T10:30:00Z",
      "updated_at": "2024-01-10T18:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 127,
    "pages": 7,
    "has_next": true,
    "has_prev": false
  }
}
```

### 11. Upload Clothing Item
```
POST /wardrobe/items
Headers: Authorization: Bearer {access_token}
         Content-Type: multipart/form-data

Body:
  - image: File (JPEG, PNG, max 10MB)
  - manual_tags: JSON (optional)
    {
      "brand": "Everlane",
      "notes": "Favorite shirt for spring"
    }

Response: 201 Created
{
  "item_id": "item-uuid-123",
  "classification": {
    "category": "tops",
    "subcategory": "shirt",
    "colors": ["navy", "white"],
    "pattern": "striped",
    "material": "cotton",
    "sleeve_length": "long",
    "fit": "slim",
    "season": ["spring", "fall"],
    "occasions": ["casual", "office"],
    "style_tags": ["minimalist"]
  },
  "confidence_scores": {
    "category": 0.98,
    "color": 0.92,
    "pattern": 0.87,
    "material": 0.85
  },
  "image_url": "https://cdn.whatwear.app/items/item-uuid-123.jpg",
  "status": "classification_complete",
  "requires_review": false
}
```

### 12. Get Item Details
```
GET /wardrobe/items/{item_id}
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": "item-uuid-123",
  "image_url": "https://cdn.whatwear.app/items/item-uuid-123.jpg",
  "category": "tops",
  "subcategory": "shirt",
  "colors": ["navy", "white"],
  "pattern": "striped",
  "material": "cotton",
  "sleeve_length": "long",
  "fit": "slim",
  "season": ["spring", "fall"],
  "occasions": ["casual", "office"],
  "style_tags": ["minimalist", "vintage"],
  "brand": "Everlane",
  "purchase_date": "2023-06-15",
  "purchase_price": 45.00,
  "purchase_location": "Everlane.com",
  "condition": "good",
  "care_instructions": "Hand wash cold, lay flat to dry",
  "wear_count": 12,
  "last_worn_at": "2024-01-10T18:00:00Z",
  "is_favorite": true,
  "is_archived": false,
  "custom_notes": "My favorite spring shirt",
  "wear_history": [
    {
      "worn_date": "2024-01-10",
      "outfit_id": "outfit-uuid-456",
      "weather_temp": 18,
      "rating": 5
    }
  ],
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2024-01-10T18:00:00Z"
}
```

### 13. Update Item Details
```
PATCH /wardrobe/items/{item_id}
Headers: Authorization: Bearer {access_token}

Request:
{
  "category": "tops",
  "colors": ["navy", "white"],
  "pattern": "striped",
  "brand": "Everlane",
  "condition": "good",
  "custom_notes": "Updated notes",
  "is_favorite": true
}

Response: 200 OK
{
  "id": "item-uuid-123",
  "category": "tops",
  "colors": ["navy", "white"],
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### 14. Delete Item
```
DELETE /wardrobe/items/{item_id}
Headers: Authorization: Bearer {access_token}

Response: 204 No Content
```

### 15. Toggle Favorite
```
POST /wardrobe/items/{item_id}/toggle-favorite
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "item_id": "item-uuid-123",
  "is_favorite": true
}
```

---

## Outfit Endpoints

### 16. Create Outfit
```
POST /outfits
Headers: Authorization: Bearer {access_token}

Request:
{
  "name": "Spring Office Casual",
  "description": "Perfect for casual Fridays at the office",
  "item_ids": [
    "item-uuid-123",
    "item-uuid-456",
    "item-uuid-789"
  ],
  "occasions": ["office", "casual"],
  "season": ["spring"],
  "is_public": false
}

Response: 201 Created
{
  "id": "outfit-uuid-001",
  "name": "Spring Office Casual",
  "description": "Perfect for casual Fridays at the office",
  "item_ids": [...],
  "items": [
    { full item objects }
  ],
  "occasions": ["office", "casual"],
  "season": ["spring"],
  "is_public": false,
  "likes_count": 0,
  "is_favorite": false,
  "rating": null,
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### 17. Get Outfits
```
GET /outfits
Headers: Authorization: Bearer {access_token}
Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)
  - sort_by: string (created_at|-created_at|likes_count|wear_count)
  - occasion: string[]
  - season: string[]
  - is_favorite: boolean

Response: 200 OK
{
  "outfits": [ {...}, {...} ],
  "pagination": { page, limit, total, pages, has_next, has_prev }
}
```

### 18. Get Outfit Details
```
GET /outfits/{outfit_id}
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": "outfit-uuid-001",
  "name": "Spring Office Casual",
  "items": [ full item objects ],
  "composition": {
    "base": "item-uuid-456",
    "top": "item-uuid-123",
    "accessories": ["item-uuid-789"]
  },
  "occasions": ["office", "casual"],
  "season": ["spring"],
  "is_public": false,
  "likes_count": 5,
  "wear_count": 3,
  "wear_history": [ {...} ],
  "created_at": "2024-01-15T11:00:00Z"
}
```

### 19. Update Outfit
```
PATCH /outfits/{outfit_id}
Headers: Authorization: Bearer {access_token}

Request:
{
  "name": "Updated Outfit Name",
  "description": "Updated description",
  "item_ids": [...],
  "occasions": [...],
  "season": [...],
  "is_public": true,
  "is_favorite": true
}

Response: 200 OK
{ updated outfit object }
```

### 20. Log Outfit Wear
```
POST /outfits/{outfit_id}/wear
Headers: Authorization: Bearer {access_token}

Request:
{
  "worn_date": "2024-01-15",
  "weather_temp": 18,
  "weather_condition": "sunny",
  "location": "work",
  "user_rating": 5,
  "feedback_tags": ["felt_confident", "received_compliments"],
  "comments": "Great outfit for the team meeting!"
}

Response: 201 Created
{
  "history_id": "history-uuid-001",
  "outfit_id": "outfit-uuid-001",
  "worn_date": "2024-01-15",
  "rating": 5,
  "created_at": "2024-01-15T18:00:00Z"
}
```

### 21. Delete Outfit
```
DELETE /outfits/{outfit_id}
Headers: Authorization: Bearer {access_token}

Response: 204 No Content
```

---

## AI Styling Endpoints

### 22. Get Outfit Recommendations
```
POST /ai/recommend
Headers: Authorization: Bearer {access_token}

Request:
{
  "query": "What should I wear today?",
  "context": {
    "weather": "sunny",
    "temperature": 22,
    "occasion": "office",
    "date": "2024-01-15"
  },
  "count": 3
}

Response: 200 OK
{
  "recommendations": [
    {
      "rank": 1,
      "outfit_items": [
        { item object },
        { item object },
        { item object }
      ],
      "rationale": "This combination is perfect for a sunny spring day at the office. The lightweight materials and bright colors match the weather and occasion.",
      "confidence_score": 0.95,
      "color_harmony": "complementary",
      "occasion_match": 0.98,
      "season_match": 0.92,
      "estimated_comfort": "high"
    },
    { second recommendation },
    { third recommendation }
  ],
  "generated_at": "2024-01-15T11:00:00Z"
}
```

### 23. AI Chat (Styling Queries)
```
POST /ai/chat
Headers: Authorization: Bearer {access_token}

Request:
{
  "message": "Create a formal outfit for a job interview",
  "conversation_id": "conv-uuid-001" (optional)
}

Response: 200 OK
{
  "conversation_id": "conv-uuid-001",
  "response": "Here are three professional outfit combinations perfect for your interview:",
  "outfit_suggestions": [
    {
      "outfit_items": [...],
      "explanation": "This is a classic formal look that exudes confidence..."
    }
  ],
  "follow_up_suggestions": [
    "Would you like recommendations for shoes?",
    "Should I add accessories?"
  ]
}
```

### 24. Get Color Harmony Analysis
```
GET /ai/color-harmony
Headers: Authorization: Bearer {access_token}
Query Parameters:
  - item_id: string (required)

Response: 200 OK
{
  "item_id": "item-uuid-123",
  "primary_color": "navy",
  "complementary_colors": ["orange", "coral", "peach"],
  "analogous_colors": ["teal", "purple", "black"],
  "monochromatic_options": ["light_navy", "dark_navy", "navy_grey"],
  "suggested_items": [
    {
      "item_id": "item-uuid-456",
      "harmony_score": 0.92,
      "harmony_type": "complementary"
    }
  ]
}
```

---

## Social Endpoints

### 25. Get Public Feed
```
GET /social/feed
Headers: Authorization: Bearer {access_token}
Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)
  - category: string
  - occasion: string
  - season: string
  - sort_by: string (latest|trending|most_liked)

Response: 200 OK
{
  "posts": [
    {
      "id": "post-uuid-001",
      "user": {
        "id": "user-uuid-456",
        "username": "fashionista_jane",
        "avatar_url": "..."
      },
      "outfit": { outfit object },
      "caption": "Spring vibes! ☀️",
      "image_url": "...",
      "likes_count": 42,
      "comments_count": 8,
      "shares_count": 5,
      "is_liked": false,
      "is_saved": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 26. Share Outfit
```
POST /outfits/{outfit_id}/share
Headers: Authorization: Bearer {access_token}

Request:
{
  "caption": "My favorite spring outfit!",
  "visibility": "public"
}

Response: 201 Created
{
  "post_id": "post-uuid-001",
  "outfit_id": "outfit-uuid-001",
  "share_url": "https://whatwear.app/p/post-uuid-001",
  "visibility": "public",
  "created_at": "2024-01-15T11:00:00Z"
}
```

### 27. Like Post
```
POST /social/posts/{post_id}/like
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "post_id": "post-uuid-001",
  "is_liked": true,
  "likes_count": 43
}
```

### 28. Comment on Post
```
POST /social/posts/{post_id}/comments
Headers: Authorization: Bearer {access_token}

Request:
{
  "content": "Love this outfit! The colors are perfect!"
}

Response: 201 Created
{
  "comment_id": "comment-uuid-001",
  "post_id": "post-uuid-001",
  "user": { user object },
  "content": "Love this outfit! The colors are perfect!",
  "likes_count": 0,
  "created_at": "2024-01-15T11:15:00Z"
}
```

### 29. Follow User
```
POST /users/{user_id}/follow
Headers: Authorization: Bearer {access_token}

Response: 200 OK
{
  "user_id": "user-uuid-456",
  "is_following": true,
  "followers_count": 146
}
```

### 30. Save Post
```
POST /social/posts/{post_id}/save
Headers: Authorization: Bearer {access_token}

Request:
{
  "collection_name": "inspiration" (optional)
}

Response: 200 OK
{
  "post_id": "post-uuid-001",
  "is_saved": true,
  "saves_count": 12
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "status": 400,
  "timestamp": "2024-01-15T11:00:00Z",
  "request_id": "req-uuid-001",
  "details": {
    "field": "email",
    "issue": "already_exists"
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests (Rate Limit)
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## Rate Limiting

**Limits**: 100 requests per minute per user

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705319400
```

**When Exceeded (429)**:
```json
{
  "error": "rate_limit_exceeded",
  "message": "You have exceeded the rate limit. Please wait before retrying.",
  "retry_after": 60
}
```

