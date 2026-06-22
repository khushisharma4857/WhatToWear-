# WhatToWear - Database Schema

## PostgreSQL Schema Design

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  
  -- OAuth Integration
  google_id VARCHAR(255) UNIQUE,
  apple_id VARCHAR(255) UNIQUE,
  
  -- Profile Data
  skin_tone VARCHAR(50),
  preferred_sizes JSONB, -- {"tops": "M", "bottoms": "32", "shoes": "10"}
  style_preferences TEXT[],
  
  -- Settings
  is_public BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  -- Indexing
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_apple_id ON users(apple_id);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### Wardrobe Items Table
```sql
CREATE TABLE wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Image Information
  image_url TEXT NOT NULL,
  image_key VARCHAR(255) NOT NULL, -- S3 key for retrieval
  thumbnail_url TEXT,
  original_filename VARCHAR(255),
  image_width INT,
  image_height INT,
  
  -- AI Classification
  category VARCHAR(50) NOT NULL, -- "tops", "bottoms", "outerwear", "shoes", "accessories", "dress"
  subcategory VARCHAR(100),
  ai_confidence FLOAT, -- 0.0 to 1.0
  colors VARCHAR(50)[], -- ["navy", "white", "red"]
  dominant_color VARCHAR(50),
  pattern VARCHAR(100), -- "solid", "striped", "floral", etc.
  material VARCHAR(100), -- "cotton", "polyester", "wool", etc.
  
  -- Attributes
  sleeve_length VARCHAR(50), -- "sleeveless", "short", "long", "3/4"
  fit VARCHAR(50), -- "slim", "regular", "loose", "oversized"
  length VARCHAR(50), -- "short", "midi", "maxi"
  neckline VARCHAR(100), -- "crew", "v-neck", "scoop", etc.
  
  -- Context
  season VARCHAR(50)[], -- ["spring", "summer", "fall", "winter"]
  occasions VARCHAR(100)[], -- ["casual", "formal", "office", "party", "athletic"]
  style_tags VARCHAR(100)[], -- ["minimalist", "vintage", "bohemian", "preppy"]
  
  -- Purchase & Condition
  brand VARCHAR(255),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  purchase_location VARCHAR(255),
  condition VARCHAR(50) DEFAULT 'good', -- "excellent", "good", "worn", "needs_repair"
  care_instructions TEXT,
  
  -- User Actions
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  wear_count INT DEFAULT 0,
  last_worn_at TIMESTAMP,
  custom_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexing
  CONSTRAINT valid_category CHECK (category IN ('tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'dress'))
);

CREATE INDEX idx_wardrobe_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_category ON wardrobe_items(user_id, category);
CREATE INDEX idx_wardrobe_colors ON wardrobe_items USING GIN(colors);
CREATE INDEX idx_wardrobe_occasions ON wardrobe_items USING GIN(occasions);
CREATE INDEX idx_wardrobe_created_at ON wardrobe_items(user_id, created_at DESC);
CREATE INDEX idx_wardrobe_last_worn ON wardrobe_items(user_id, last_worn_at DESC);
CREATE INDEX idx_wardrobe_favorite ON wardrobe_items(user_id, is_favorite) WHERE is_favorite = TRUE;
```

### Outfits Table
```sql
CREATE TABLE outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Composition
  item_ids UUID[] NOT NULL, -- Array of wardrobe_item IDs
  composition JSONB NOT NULL, -- Detailed layer info
  -- Example: {"base": "item-1", "top": "item-2", "outerwear": "item-3", "accessories": ["item-4", "item-5"]}
  
  -- Context
  season VARCHAR(50)[], -- ["spring", "summer"]
  occasions VARCHAR(100)[],
  weather_conditions VARCHAR(100)[], -- ["warm", "cold", "rainy"]
  time_of_day VARCHAR(50)[], -- ["daytime", "evening", "night"]
  
  -- Social
  is_public BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  
  -- User Actions
  is_favorite BOOLEAN DEFAULT FALSE,
  rating INT, -- 1-5 scale
  difficulty VARCHAR(50), -- "easy", "moderate", "challenging"
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_outfits_user_id ON outfits(user_id);
CREATE INDEX idx_outfits_created_at ON outfits(user_id, created_at DESC);
CREATE INDEX idx_outfits_public ON outfits(is_public, created_at DESC) WHERE is_public = TRUE;
CREATE INDEX idx_outfits_favorite ON outfits(user_id, is_favorite) WHERE is_favorite = TRUE;
```

### Outfit History (Wear Log) Table
```sql
CREATE TABLE outfit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  
  -- When Worn
  worn_date DATE NOT NULL,
  time_of_day VARCHAR(50), -- "morning", "afternoon", "evening"
  
  -- Context
  weather_temp INT, -- Celsius
  weather_condition VARCHAR(100), -- "sunny", "rainy", "cloudy"
  location VARCHAR(255), -- "work", "date", "home", etc.
  
  -- Feedback
  user_rating INT, -- 1-5
  feedback_tags VARCHAR(100)[],
  comments TEXT,
  
  -- Derived Data
  days_since_last_wear INT,
  outfit_repetition_count INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_outfit_history_user_date ON outfit_history(user_id, worn_date DESC);
CREATE INDEX idx_outfit_history_outfit_id ON outfit_history(outfit_id);
```

### User Relationships Table
```sql
CREATE TABLE user_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Relationship Type
  relationship_type VARCHAR(50) DEFAULT 'follow', -- "follow", "friend", "blocked"
  
  -- Status
  is_blocked BOOLEAN DEFAULT FALSE,
  is_muted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT self_follow_check CHECK (follower_id != following_id),
  CONSTRAINT unique_relationship UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_user_relationships_follower ON user_relationships(follower_id);
CREATE INDEX idx_user_relationships_following ON user_relationships(following_id);
```

### Social Posts (Shared Outfits) Table
```sql
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  
  -- Content
  caption TEXT,
  image_url TEXT, -- Outfit preview image
  image_key VARCHAR(255),
  
  -- Visibility
  visibility VARCHAR(50) DEFAULT 'friends', -- "public", "friends", "private"
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  reposts_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT visibility_check CHECK (visibility IN ('public', 'friends', 'private'))
);

CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX idx_social_posts_public ON social_posts(created_at DESC) WHERE visibility = 'public';
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(post_id, created_at DESC);
```

### Likes Table
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_post_like UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

### Saved Posts Table
```sql
CREATE TABLE saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  
  collection_name VARCHAR(255) DEFAULT 'saved',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_save UNIQUE(user_id, post_id)
);

CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
```

### AI Classification Feedback Table
```sql
CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  
  field_name VARCHAR(100) NOT NULL, -- "category", "color", "pattern", etc.
  ai_prediction VARCHAR(255),
  user_correction VARCHAR(255),
  confidence_before FLOAT,
  confidence_after FLOAT,
  
  is_correct BOOLEAN,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_feedback_item_id ON ai_feedback(item_id);
CREATE INDEX idx_ai_feedback_field ON ai_feedback(field_name, is_correct);
```

### Image Processing Queue Table
```sql
CREATE TABLE image_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  s3_key VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "processing", "completed", "failed"
  
  processing_result JSONB,
  error_message TEXT,
  
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_image_jobs_status ON image_processing_jobs(status);
CREATE INDEX idx_image_jobs_user_id ON image_processing_jobs(user_id);
```

### API Rate Limiting Table (Redis backing)
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  request_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  window_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'
);

CREATE UNIQUE INDEX idx_rate_limit_user_endpoint ON rate_limits(user_id, endpoint);
```

## MongoDB Collections Design

```javascript
// User Preferences
db.user_preferences.insertOne({
  _id: ObjectId("..."),
  user_id: UUID("..."),
  style_quiz_results: {
    style_types: ["minimalist", "vintage"],
    color_preferences: ["earth tones", "jewel tones"],
    fit_preferences: ["fitted", "relaxed"],
    brands: ["Everlane", "Uniqlo"],
  },
  completed_at: ISODate("2024-01-15"),
  updated_at: ISODate("2024-01-15")
});

// Analytics Events
db.analytics_events.insertOne({
  _id: ObjectId("..."),
  user_id: UUID("..."),
  event_type: "outfit_recommendation_viewed",
  event_data: {
    outfit_id: UUID("..."),
    recommendation_source: "ai_assistant",
    displayed_count: 5,
    selected_outfit_index: 1
  },
  timestamp: ISODate("2024-01-15T10:30:00Z")
});

// User Feedback
db.user_feedback.insertOne({
  _id: ObjectId("..."),
  user_id: UUID("..."),
  feedback_type: "feature_request",
  content: "Would love AR try-on feature",
  rating: 4,
  created_at: ISODate("2024-01-15")
});

// AI Model Logs
db.ai_model_logs.insertOne({
  _id: ObjectId("..."),
  item_id: UUID("..."),
  model_version: "v2.1",
  input: { image_key: "...", image_size: 1024 },
  output: {
    category: "tops",
    confidence: 0.98,
    attributes: {...}
  },
  processing_time_ms: 2340,
  timestamp: ISODate("2024-01-15T10:30:00Z")
});

// Recommendations Cache
db.recommendations_cache.insertOne({
  _id: ObjectId("..."),
  user_id: UUID("..."),
  cache_key: "recommendations:user123:2024-01-15",
  recommendations: [
    { outfit_id: UUID("..."), score: 0.95 },
    { outfit_id: UUID("..."), score: 0.88 }
  ],
  expires_at: ISODate("2024-01-16"),
  created_at: ISODate("2024-01-15")
});
```

## Data Validation Rules

```
WARDROBE_ITEMS:
- colors: Required, minimum 1, maximum 5
- category: Required, must be in predefined list
- confidence: 0.0-1.0 range
- condition: Must be in ["excellent", "good", "worn", "needs_repair"]

OUTFITS:
- item_ids: Required, minimum 2 items
- name: Required, max 255 chars
- composition: Valid JSON structure

OUTFIT_HISTORY:
- worn_date: Must be ≤ today
- user_rating: 1-5 range, optional
- weather_temp: -50 to 60 Celsius range

COMMENTS:
- content: Required, max 1000 chars
```

## Performance Optimization

### Indexes Strategy
- **Hot queries**: (user_id, created_at DESC)
- **Search**: GIN indexes on array columns (colors, occasions, style_tags)
- **Filtering**: Composite indexes for common filter combinations
- **Social**: Partial indexes on public/viral content

### Partitioning Strategy (Future)
- Partition wardrobe_items by user_id (sharding ready)
- Partition outfit_history by worn_date (monthly)
- Partition social_posts by created_at (daily or weekly)

