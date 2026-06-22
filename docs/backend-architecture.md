# WhatToWear - Backend Architecture

## Microservices Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Kong)                        │
│         Rate Limiting, Auth Validation, Routing              │
└──────────────┬──────────────────────────────────────────────┘
               │
        ┌──────┴──────────────────────────────┐
        │                                     │
   ┌────▼─────────┐              ┌──────────▼──────┐
   │ Auth Service │              │ User Service     │
   │ (Go, Port 3001)            │ (Node.js, 3002)  │
   └──────────────┘              └──────────────────┘
        │
   ┌────▼──────────────────────────┬───────────────────────┐
   │                               │                       │
┌──▼──────────┐    ┌──────────────▼──┐   ┌──────────────▼──┐
│Wardrobe API │    │ Image Service    │   │  AI Service      │
│(Node.js 3003)    │ (Node.js, 3004)  │   │(Python, 3005)    │
└──────────────┘    └──────────────────┘   └──────────────────┘
        │
   ┌────▼─────────────────────────┬──────────────┬────────────┐
   │                              │              │            │
┌──▼──────────┐  ┌───────────────▼──┐ ┌────────▼─────┐  ┌──▼─────┐
│Outfit API   │  │ Social Service   │ │Search Service │  │Search  │
│(Node.js3006)  │ (Node.js, 3007)   │ │(Node.js, 3008)│  │Index   │
└──────────────┘  └──────────────────┘ └───────────────┘  └────────┘

                      ┌──────────────────────────────┐
                      │   Queue Service (Redis)      │
                      │  - Image Processing Jobs     │
                      │  - Email Jobs                │
                      │  - Notification Queue        │
                      └──────────────────────────────┘
```

## Service Specifications

### 1. Auth Service (Go)
**Port**: 3001
**Primary DB**: PostgreSQL (users table)
**Cache**: Redis (sessions, tokens)

**Key Endpoints**:
- POST `/register` - User registration
- POST `/login` - Email/password login
- POST `/oauth/google` - Google OAuth
- POST `/oauth/apple` - Apple Sign-In
- POST `/refresh` - Token refresh
- POST `/validate` - JWT validation (used by other services)
- POST `/logout` - Logout & token revocation

**Dependencies**: PostgreSQL, Redis
**Deployable Units**: Single service, horizontally scalable

### 2. User Service (Node.js)
**Port**: 3002
**Primary DB**: PostgreSQL (users, profiles)
**Cache**: Redis (hot user data)

**Key Endpoints**:
- GET `/users/me` - Current user profile
- PATCH `/users/me` - Update profile
- GET `/users/:username` - Public profile
- POST `/users/me/settings` - Save preferences
- POST `/users/me/avatar` - Upload avatar
- DELETE `/users/me` - Account deletion (GDPR)

**Async Tasks**: Profile image optimization, email verification

### 3. Wardrobe Service (Node.js)
**Port**: 3003
**Primary DB**: PostgreSQL (wardrobe_items, collections)
**Cache**: Redis (favorite items, seasonal filters)
**Search**: ElasticSearch (full-text indexing)

**Key Endpoints**:
- GET `/wardrobe` - List items (paginated, filtered)
- POST `/wardrobe/items` - Create item (triggers AI)
- GET `/wardrobe/items/:id` - Item details
- PATCH `/wardrobe/items/:id` - Update attributes
- DELETE `/wardrobe/items/:id` - Delete item
- POST `/wardrobe/items/:id/toggle-favorite`
- POST `/wardrobe/collections` - Create collections

**Background Jobs**:
- Index items in ElasticSearch
- Trigger AI classification
- Archive seasonal items

### 4. Image Processing Service (Node.js)
**Port**: 3004
**Storage**: AWS S3
**Cache**: Redis (processing status)
**Queue**: Redis Queue (Bull) for job management

**Processes**:
1. Image upload handling (multipart/form-data)
2. S3 upload with progress tracking
3. Image optimization (resize, compress)
4. Background removal (rembg or API call)
5. Thumbnail generation
6. CloudFront cache invalidation

**Key Endpoints**:
- POST `/upload` - Receive image, queue processing
- GET `/status/:job_id` - Check processing status
- DELETE `/images/:image_id` - Delete from S3

**External APIs**: Google Vision API (color extraction), remove.bg (background removal)

### 5. AI Service (Python)
**Port**: 3005
**ML Framework**: TensorFlow/PyTorch (local models)
**LLM Access**: Claude 3 Opus / GPT-4 Vision API
**Cache**: Redis (recommendation cache)

**Key Endpoints**:
- POST `/classify` - Clothing item classification
- POST `/recommend` - Generate outfit recommendations
- POST `/chat` - Chat-based styling queries
- GET `/color-harmony/:item_id` - Color analysis
- POST `/feedback` - Collect training feedback

**Local ML Models**:
- YOLOv8 for item detection
- ResNet50 for feature extraction
- Custom CNN for attribute classification

**LLM Models**:
- Claude 3 Opus (primary)
- GPT-4 Vision (fallback)

**Background Tasks**:
- Model retraining (weekly)
- Feedback aggregation
- Performance metrics tracking

### 6. Outfit Service (Node.js)
**Port**: 3006
**Primary DB**: PostgreSQL (outfits, outfit_history)
**Cache**: Redis (popular outfits)

**Key Endpoints**:
- POST `/outfits` - Create outfit
- GET `/outfits` - List outfits
- GET `/outfits/:id` - Outfit details
- PATCH `/outfits/:id` - Update outfit
- DELETE `/outfits/:id` - Delete outfit
- POST `/outfits/:id/wear` - Log wear event
- GET `/outfits/:id/wear-history` - Historical data

**Analytics**:
- Track outfit usage patterns
- Calculate color harmony scores
- Rank outfits by user ratings

### 7. Social Service (Node.js)
**Port**: 3007
**Primary DB**: PostgreSQL (posts, comments, likes)
**Cache**: Redis (feed rankings, hot posts)
**Search**: ElasticSearch (post discovery)

**Key Endpoints**:
- GET `/feed` - Personalized feed
- POST `/posts` - Create post (share outfit)
- GET `/posts/:id` - Post details
- POST `/posts/:id/like` - Like post
- POST `/posts/:id/comments` - Add comment
- GET `/users/:id/followers` - Follower list
- POST `/users/:id/follow` - Follow user
- POST `/posts/:id/save` - Save post

**Background Jobs**:
- Feed ranking (collaborative filtering)
- Notification generation
- Spam detection

### 8. Search Service (Node.js + ElasticSearch)
**Port**: 3008
**Index**: wardrobe_items, outfit_posts, user_profiles

**Key Endpoints**:
- GET `/search/wardrobe` - Search items with advanced filters
- GET `/search/outfits` - Discover outfits
- GET `/search/users` - Find users by style

**Features**:
- Full-text search
- Faceted search (colors, categories)
- Autocomplete suggestions
- Typo tolerance

---

## Database Schema

### PostgreSQL Primary Tables
```
users
  ├─ id (UUID, PK)
  ├─ email, username, password_hash
  ├─ oauth_providers (JSONB)
  ├─ created_at, updated_at

wardrobe_items
  ├─ id (UUID, PK)
  ├─ user_id (FK)
  ├─ image_url, image_key (S3)
  ├─ category, colors, pattern, material
  ├─ season, occasions, style_tags
  ├─ wear_count, last_worn_at
  ├─ created_at, updated_at

outfits
  ├─ id (UUID, PK)
  ├─ user_id (FK)
  ├─ item_ids (UUID[])
  ├─ composition (JSONB)
  ├─ occasions, season
  ├─ is_public, likes_count
  ├─ created_at, updated_at

outfit_history
  ├─ id (UUID, PK)
  ├─ outfit_id (FK)
  ├─ user_id (FK)
  ├─ worn_date, weather_temp
  ├─ user_rating
  ├─ created_at

social_posts
  ├─ id (UUID, PK)
  ├─ user_id (FK)
  ├─ outfit_id (FK)
  ├─ caption, image_url
  ├─ visibility (public|friends|private)
  ├─ likes_count, comments_count
  ├─ created_at, updated_at

user_relationships
  ├─ id (UUID, PK)
  ├─ follower_id (FK)
  ├─ following_id (FK)
  ├─ relationship_type
  ├─ is_blocked
  ├─ created_at
```

### Redis Data Structures
```
Session Store:
  "session:{session_id}" → User session data + token
  
Rate Limits:
  "ratelimit:{user_id}:{endpoint}" → Request count
  
Cache:
  "user:{user_id}:wardrobe" → Hot wardrobe items
  "outfit:{outfit_id}:recommendations" → Recommendations
  "feed:user:{user_id}" → Personalized feed
  
Queues:
  "queue:image_processing" → Job queue
  "queue:emails" → Email sending queue
  "queue:notifications" → Push notifications
  
Leaderboards:
  "trending_posts" → Sorted set by engagement
  "popular_outfits" → Sorted set by likes
```

### ElasticSearch Indexes
```
wardrobe_items_index
  - fields: category, colors, pattern, material, occasions
  - analyzers: standard, lowercase, stop words
  - tokenizer: whitespace
  
social_posts_index
  - fields: caption, hashtags, user_username
  - analyzers: standard
  - synonyms: fashion terms
```

---

## Deployment & Infrastructure

### Kubernetes Manifest Structure
```
k8s/
├── namespace.yaml (whatwear namespace)
├── services/
│   ├── auth-service.yaml
│   ├── user-service.yaml
│   ├── wardrobe-service.yaml
│   ├── image-service.yaml
│   ├── ai-service.yaml
│   ├── outfit-service.yaml
│   ├── social-service.yaml
│   └── search-service.yaml
├── deployments/
│   └── [Service deployments with replicas]
├── configmaps/
│   ├── api-config.yaml (API routes)
│   └── ml-config.yaml (Model paths)
├── secrets/
│   ├── db-credentials.yaml (encrypted)
│   ├── api-keys.yaml (encrypted)
│   └── oauth-secrets.yaml (encrypted)
├── statefulsets/
│   ├── postgres.yaml
│   ├── redis.yaml
│   └── elasticsearch.yaml
├── pvc.yaml (Persistent volumes)
└── ingress.yaml (API Gateway routing)
```

### Service Replication Strategy
```
Production (us-east-1):
  - Auth Service: 3 replicas
  - User Service: 2 replicas
  - Wardrobe Service: 3 replicas
  - Image Service: 5 replicas (high demand)
  - AI Service: 4 replicas (GPU enabled)
  - Outfit Service: 2 replicas
  - Social Service: 3 replicas
  - Search Service: 2 replicas (backed by ES cluster)

EU Region (eu-west-1):
  - Read replicas of all services
  - Database replication lag: < 100ms
```

---

## Monitoring & Observability

### Key Metrics
```
API Performance:
  - Response time (p50, p95, p99)
  - Error rate (5xx, 4xx)
  - Request volume
  - Concurrent users
  
Database:
  - Query latency
  - Connection pool usage
  - Replication lag
  - Cache hit rate
  
AI/ML:
  - Model inference time
  - Classification accuracy
  - Recommendation engagement rate
  
Queue Processing:
  - Job processing time
  - Queue depth
  - Failure rate
```

### Logging Strategy
```
Service Logs → ELK Stack
  - Centralized logging
  - Structured logging (JSON)
  - Log retention: 30 days
  
Application Insights:
  - User journeys
  - Feature usage
  - Error tracking (Sentry)
  - Performance RUM (Real User Monitoring)
```

