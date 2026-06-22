# WhatToWear - Technical Architecture

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   iOS App    │  │ Android App  │  │  Web App     │      │
│  │  (React Native)  │  (Flutter)   │  │  (React)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   API GW    │  (CloudFlare, Kong)
                    │   (TLS 1.3) │
                    └──────┬──────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                 SERVICES LAYER (Kubernetes)                  │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │  Auth Service  │  │ User Service   │                    │
│  │  (Go, JWT)     │  │  (Node.js)     │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │ Wardrobe API   │  │  AI Service    │                    │
│  │  (Node.js)     │  │  (Python, ML)  │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │ Image Service  │  │ Outfit Service │                    │
│  │  (Node.js)     │  │  (Node.js)     │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │  Social API    │  │ Search Service │                    │
│  │  (Node.js)     │  │  (ElasticSearch)│                   │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                    DATA LAYER                                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  PostgreSQL      │  │    MongoDB       │               │
│  │  (Primary DB)    │  │  (User metadata) │               │
│  │                  │  │                  │               │
│  │ - Users          │  │ - Profile data   │               │
│  │ - Wardrobes      │  │ - Preferences    │               │
│  │ - Clothing items │  │ - Analytics      │               │
│  │ - Outfits        │  │                  │               │
│  │ - Relationships  │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │    Redis         │  │  ElasticSearch   │               │
│  │  (Cache/Queue)   │  │  (Full-text)     │               │
│  │                  │  │                  │               │
│  │ - Sessions       │  │ - Wardrobe search│               │
│  │ - Rate limits    │  │ - Feed indexing  │               │
│  │ - Jobs           │  │ - Analytics      │               │
│  │ - Hot data       │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│              EXTERNAL SERVICES & STORAGE                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ AWS S3 +     │  │  Google/Apple│  │ Stripe/Paddle│     │
│  │ CloudFront   │  │  OAuth       │  │ (Payments)   │     │
│  │ (Image CDN)  │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Claude/GPT4  │  │  Computer    │  │ SendGrid     │     │
│  │ (AI Styling) │  │  Vision API  │  │ (Email)      │     │
│  │              │  │  (Image Proc)│  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend

**Mobile (Primary)**
- **Framework**: React Native with Expo (iOS & Android simultaneously)
- **Alternative**: Flutter for Android-specific optimizations
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: React Native Paper + Custom components
- **Image Processing**: react-native-vision-camera, expo-image
- **Camera**: expo-camera with custom filters
- **Storage**: SQLite (local DB) + AsyncStorage (preferences)

**Web**
- **Framework**: React 18 + Next.js
- **Styling**: Tailwind CSS + Framer Motion (animations)
- **State**: Redux Toolkit + RTK Query
- **Drag & Drop**: React Beautiful DND (outfit builder)
- **Charts**: Recharts (analytics)

### Backend

**API Gateway**
- **Kong** (open-source) or **AWS API Gateway**
- **Protections**: Rate limiting, JWT validation, CORS
- **Cache Layer**: Redis for frequent queries

**Microservices** (Node.js 18+ / TypeScript)

1. **Auth Service** (Go)
   - User registration, login, OAuth integration
   - JWT token generation and validation
   - 2FA/MFA support
   - Password reset, email verification

2. **User Service** (Node.js)
   - Profile management
   - Preference storage
   - Account settings
   - Privacy controls

3. **Wardrobe Service** (Node.js)
   - CRUD operations for clothing items
   - Tagging and categorization
   - Search and filtering
   - Inventory management

4. **Image Processing Service** (Python + Node.js)
   - Uploads handling
   - Image optimization
   - Background removal (rembg library)
   - Quality enhancement
   - Storage orchestration

5. **AI Styling Service** (Python + Node.js)
   - Computer Vision API integration
   - Clothing classification
   - Attribute extraction
   - Color harmony calculations
   - Outfit recommendation engine
   - Natural language processing (Claude/GPT-4)

6. **Outfit Service** (Node.js)
   - Outfit creation and management
   - Save/load outfit compositions
   - Outfit recommendations
   - Wear history tracking

7. **Social Service** (Node.js)
   - User relationships (followers, friends)
   - Outfit sharing and visibility
   - Comments and engagement
   - Feed ranking algorithm
   - Moderation

8. **Search Service** (Node.js + ElasticSearch)
   - Full-text wardrobe search
   - Advanced filtering
   - Outfit discovery
   - Recommendation indexing

### Database

**PostgreSQL 15+** (Primary)
- **Schema**: Relational tables (see database schema)
- **Replication**: Master-Slave with automatic failover
- **Backup**: Daily snapshots to S3
- **Connection pooling**: PgBouncer

```sql
-- Core Tables
users (
  id (PK), email (UNIQUE), username (UNIQUE), password_hash,
  oauth_providers (JSONB), created_at, updated_at
)

wardrobe_items (
  id (PK), user_id (FK), image_url, image_key (S3),
  category, subcategory, colors, pattern, material,
  sleeve_length, fit, seasons, occasions, style_tags,
  brand, purchase_date, purchase_price, condition,
  wear_count, last_worn_at, is_favorite, created_at, updated_at
  -- Indexes: (user_id, created_at), (user_id, category), (user_id, colors)
)

outfits (
  id (PK), user_id (FK), name, description,
  item_ids (UUID[]), composition (JSONB),
  occasions, season, is_public, likes_count,
  created_at, updated_at
  -- Indexes: (user_id, created_at), (is_public)
)

outfit_history (
  id (PK), user_id (FK), outfit_id (FK), worn_date,
  weather_temp, weather_condition, user_rating,
  feedback_tags (TEXT[]), created_at
  -- Indexes: (user_id, worn_date)
)

user_relationships (
  id (PK), follower_id (FK), following_id (FK),
  created_at, is_blocked
  -- Indexes: (follower_id), (following_id)
)

social_posts (
  id (PK), user_id (FK), outfit_id (FK), caption,
  image_url, is_public, likes_count, comments_count,
  created_at, updated_at
  -- Indexes: (user_id), (created_at), (is_public)
)

comments (
  id (PK), post_id (FK), user_id (FK), content,
  created_at, updated_at, likes_count
  -- Indexes: (post_id), (user_id)
)
```

**MongoDB** (User metadata, analytics)
```
db.users_preferences
db.analytics_events
db.user_feedback
db.ai_model_logs
db.recommendations_cache
```

**Redis** (Cache & Queue)
- Session store (JWT)
- Rate limiting buckets
- Hot wardrobe data
- Queue jobs (image processing, emails)
- Leaderboards (popular outfits)

**ElasticSearch** (Full-text search)
- Wardrobe items index
- Outfit index
- Social posts index
- User profiles index

### Storage

**AWS S3** (Primary)
- Bucket: `whatwear-user-images`
- Structure: `s3://bucket/users/{user_id}/items/{item_id}/{filename}`
- Image sizes:
  - Original (preserved)
  - Optimized (1080x1080px)
  - Thumbnail (300x300px)
  - Square (1x1, for feed)

**CloudFront CDN**
- Global distribution
- Cache TTL: 30 days for images
- Compression: gzip, brotli
- OAI (Origin Access Identity) for S3 security

### AI/ML

**Computer Vision**
- **Provider**: Google Vision API or Azure Computer Vision
- **Alternative**: Custom TensorFlow models (on-device or server)
- **Tasks**:
  - Object detection (clothing items)
  - Color extraction (dominant colors)
  - Pattern recognition
  - Background removal (rembg library)

**Styling AI**
- **Model**: Claude 3 Opus or GPT-4 Vision
- **Fine-tuning**: Fashion-specific prompt engineering
- **Tasks**:
  - Outfit recommendations
  - Natural language queries
  - Style advice
  - Color harmony analysis

**Recommendation Engine**
- **Algorithm**: Collaborative filtering + Content-based
- **Libraries**: scikit-learn, pandas
- **Features**: Item attributes, user preferences, wear history
- **Ranking**: Learning-to-rank (LambdaMART)

---

## 3. API Specifications

### Authentication Endpoints

```
POST /api/v1/auth/register
Body: { email, password, username }
Response: { user_id, access_token, refresh_token }

POST /api/v1/auth/login
Body: { email, password }
Response: { user_id, access_token, refresh_token }

POST /api/v1/auth/oauth/google
Body: { code }
Response: { user_id, access_token, refresh_token }

POST /api/v1/auth/refresh
Body: { refresh_token }
Response: { access_token }

POST /api/v1/auth/logout
Headers: Authorization: Bearer {token}
Response: { success: true }
```

### Wardrobe Endpoints

```
GET /api/v1/wardrobe
Query: ?page=1&limit=20&category=tops&color=blue&sort=created_at
Headers: Authorization: Bearer {token}
Response: { items: [...], total, page, has_next }

POST /api/v1/wardrobe/items
Body: FormData { image, manual_tags }
Headers: Authorization: Bearer {token}
Response: { item_id, classification, confidence_scores }

GET /api/v1/wardrobe/items/:id
Headers: Authorization: Bearer {token}
Response: { item: {...} }

PATCH /api/v1/wardrobe/items/:id
Body: { category, colors, pattern, tags, notes }
Headers: Authorization: Bearer {token}
Response: { item: {...} }

DELETE /api/v1/wardrobe/items/:id
Headers: Authorization: Bearer {token}
Response: { success: true }

POST /api/v1/wardrobe/items/:id/toggle-favorite
Headers: Authorization: Bearer {token}
Response: { is_favorite: true/false }
```

### Outfit Endpoints

```
POST /api/v1/outfits
Body: { name, item_ids: [id1, id2...], occasion, season }
Headers: Authorization: Bearer {token}
Response: { outfit_id, outfit: {...} }

GET /api/v1/outfits
Query: ?page=1&limit=20&sort=-created_at
Headers: Authorization: Bearer {token}
Response: { outfits: [...], total }

GET /api/v1/outfits/:id
Headers: Authorization: Bearer {token}
Response: { outfit: {...} }

PATCH /api/v1/outfits/:id
Body: { name, item_ids, occasion, is_public }
Headers: Authorization: Bearer {token}
Response: { outfit: {...} }

DELETE /api/v1/outfits/:id
Headers: Authorization: Bearer {token}
Response: { success: true }

POST /api/v1/outfits/:id/wear
Body: { worn_date, weather, rating }
Headers: Authorization: Bearer {token}
Response: { history_id }
```

### AI Styling Endpoints

```
POST /api/v1/ai/recommend
Body: { query, context: { weather, occasion, date } }
Headers: Authorization: Bearer {token}
Response: {
  recommendations: [
    { outfit_id, items, rationale, confidence }
  ]
}

POST /api/v1/ai/chat
Body: { message, conversation_id }
Headers: Authorization: Bearer {token}
Response: { response, outfit_suggestions }

GET /api/v1/ai/color-harmony
Query: ?item_id=xxx
Headers: Authorization: Bearer {token}
Response: { complementary: [...], analogous: [...], scores: {} }
```

### Social Endpoints

```
GET /api/v1/social/feed
Query: ?page=1&limit=20&category=casual
Headers: Authorization: Bearer {token}
Response: { posts: [...], total }

GET /api/v1/users/:username
Response: { user: {...}, wardrobe_preview: [...] }

POST /api/v1/users/:id/follow
Headers: Authorization: Bearer {token}
Response: { is_following: true }

POST /api/v1/outfits/:id/share
Body: { is_public, caption }
Headers: Authorization: Bearer {token}
Response: { post_id, share_url }

POST /api/v1/posts/:id/like
Headers: Authorization: Bearer {token}
Response: { likes_count }

POST /api/v1/posts/:id/comments
Body: { content }
Headers: Authorization: Bearer {token}
Response: { comment_id, comment: {...} }
```

---

## 4. Security & Privacy

### Authentication
- **Method**: OAuth 2.0 + JWT
- **Token**: HS256 signed, 15-minute expiry
- **Refresh**: 30-day refresh tokens, stored in secure HTTP-only cookies
- **MFA**: TOTP or SMS-based optional

### Encryption
- **In Transit**: TLS 1.3 (mandatory)
- **At Rest**: AES-256-GCM for sensitive fields
- **Database**: Column-level encryption for passwords (bcrypt + salting)

### Privacy Controls
- **Data Ownership**: Users own all wardrobe and outfit data
- **Deletion**: Soft delete (30-day retention), hard delete on request
- **Export**: GDPR-compliant data export (JSON format)
- **Access**: Audit logs for all data access

### Compliance
- **GDPR**: Privacy by design, consent management, DPIA
- **CCPA**: Right to delete, opt-out mechanisms
- **HIPAA**: N/A
- **SOC 2 Type II**: Annual audit

---

## 5. Deployment & DevOps

### Infrastructure
- **Cloud**: AWS (primary) with GCP/Azure fallback
- **Orchestration**: Kubernetes (EKS)
- **Regions**: us-east-1 (primary), eu-west-1, ap-northeast-1
- **Database**: Amazon RDS (PostgreSQL), DocumentDB (MongoDB)
- **Cache**: Amazon ElastiCache (Redis)
- **Search**: Amazon OpenSearch (ElasticSearch alternative)

### CI/CD
- **VCS**: GitHub
- **CI**: GitHub Actions
- **Deployment**: ArgoCD (GitOps)
- **Monitoring**: Datadog, CloudWatch
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Scaling
- **Horizontal**: Auto-scaling groups (Kubernetes HPA)
- **Database**: Read replicas, sharding by user_id for future
- **Cache**: Multi-tier caching strategy
- **Queue**: Bull queues in Redis for background jobs

