# Pattern Coach - Product Requirements Document

## Overview
**Pattern Coach** is an educational mobile app for children ages 3-8 that teaches pattern recognition and vocabulary through gamified learning experiences. The app uses AI-powered image analysis to help kids discover patterns in the real world.

**Tagline:** Building Critical Thinkers

---

## Target Audience
- **Primary Users:** Children ages 3-8
- **Secondary Users:** Parents/guardians managing subscriptions and monitoring progress
- **Mascot:** Friendly honeybee character

---

## Core Features (MVP - COMPLETE ✅)

### 1. Authentication System ✅
- **Signup:** Email, password, child name, child age (3-8)
- **Login:** JWT-based authentication
- **Session:** 7-day token expiration
- **Files:** `/app/backend/server.py`, `/app/frontend/app/(auth)/`

### 2. Subscription Model ✅
- **7-day Free Trial:** Automatic on signup
- **Trial Status Tracking:** Checks expiration on each request
- **Premium Features:** Access to all worlds beyond "Little Explorers"
- **Stripe Integration:** Placeholder ready (not connected)

### 3. Adventure Worlds ✅
Five themed worlds with progressive unlocking:

| World | Stars Required | Status |
|-------|---------------|--------|
| Little Explorers | 0 (Free) | Always unlocked |
| Nature World | 0 | Free during trial |
| Ocean World | 50 | Premium |
| Music World | 100 | Premium |
| City World | 150 | Premium |

Each world contains 2-3 missions with star rewards (10-35 stars each).

### 4. Pattern Camera with AI ✅
- **Camera Integration:** Expo Camera for capturing images
- **Gallery Support:** Pick images from device
- **AI Analysis:** GPT-4o Vision via Emergent LLM integration
- **Kid-Friendly Results:** Patterns found, encouragement, score (1-10)
- **Pattern Types:** Stripes, dots, zigzags, spirals, waves, shapes, nature patterns

### 5. Root Detective (Vocabulary Learning) ✅
Three progressive levels with 175+ words:

| Level | Age Group | Root Families | Total Words |
|-------|-----------|---------------|-------------|
| Little Explorers | 3-5 | 19 | 83 |
| Word Builders | 6-8 | 12 | 60 |
| Word Masters | 8+ | 8 | 32 |

**Features:**
- Word parts visualization (root, prefix, suffix)
- Color-coded components
- Example sentences with emoji
- Progress tracking per root family
- Stacked learning (cumulative across levels)

**Unlock Requirements:**
- Level 2: Complete 20 words in Level 1
- Level 3: Complete 25 words in Level 2

### 6. Game Board ✅
Monopoly-style board with 16 tiles:
- 4 corner tiles (Start, Camera, Journal, Avatar)
- 12 mission tiles from various worlds
- Star rewards and difficulty progression
- Premium content gating

### 7. Avatar Creator ✅
Customization options:
- Skin color
- Hair style
- Hair color
- Outfit
- Accessories

### 8. Badges & Achievements ✅
6 badges with unlock conditions:
- First Pattern! - Find first pattern
- Stripe Master - Find 5 stripe patterns
- Dot Detective - Find 5 dot patterns
- Nature Lover - Complete all Nature missions
- Pattern Explorer - Reach 100 stars
- Pattern Champion - Reach 500 stars

### 9. Progress Tracking ✅
- **Stars:** Earned from missions and activities
- **Level:** Calculated from stars (every 50 stars = 1 level)
- **Completed Missions:** Tracked per user
- **Discovered Patterns:** Logged from camera analysis

---

## Technical Architecture

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Motor async driver)
- **Authentication:** JWT with bcrypt password hashing
- **AI Integration:** Emergent LLM (OpenAI GPT-4o Vision)

### Frontend
- **Framework:** React Native with Expo (SDK 54)
- **Navigation:** Expo Router (file-based)
- **State Management:** Zustand + React Context
- **UI Components:** Custom components + Ionicons

### API Endpoints
```
POST /api/auth/signup        - Create account
POST /api/auth/login         - Authenticate user
GET  /api/user/status        - Get user profile
POST /api/user/avatar        - Update avatar

GET  /api/adventure/worlds   - List all worlds
GET  /api/adventure/missions/{world_id} - Get world missions
POST /api/adventure/complete-mission - Complete a mission
GET  /api/adventure/badges   - List badges
GET  /api/adventure/board    - Get game board data
POST /api/adventure/board/complete - Complete board mission

GET  /api/roots              - Get root words (with level filter)
GET  /api/roots/levels       - Get all levels with stats
GET  /api/roots/stacked      - Get all unlocked words
GET  /api/roots/{root_id}    - Get specific root detail
POST /api/roots/progress     - Update word progress

POST /api/analyze-pattern    - AI pattern analysis

POST /api/subscription/checkout  - Start checkout (placeholder)
POST /api/subscription/activate  - Activate subscription

GET  /api/health             - Health check
```

---

## File Structure
```
/app
├── backend/
│   ├── server.py              # Main API server
│   ├── root_words_expanded.py # 175+ vocabulary words
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Render start command
│   ├── render.yaml           # Render deployment config
│   └── runtime.txt           # Python version
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/           # Login/Signup screens
│   │   ├── (tabs)/           # Main app tabs
│   │   ├── rootdetective/    # Word learning games
│   │   ├── world/[id].tsx    # World detail screen
│   │   ├── avatar.tsx        # Avatar creator
│   │   ├── gameboard.tsx     # Game board
│   │   └── subscription.tsx  # Subscription screen
│   │
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth context
│       ├── store/            # Zustand game store
│       └── theme/            # Colors, fonts, spacing
│
└── memory/
    └── PRD.md               # This document
```

---

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://...       # MongoDB connection string
DB_NAME=pattern_coach         # Database name
JWT_SECRET=...                # JWT signing secret
EMERGENT_LLM_KEY=sk-...       # AI integration key
```

### Frontend (.env)
```
EXPO_PUBLIC_BACKEND_URL=https://your-api.com
```

---

## Deployment

### Render (Backend)
1. Connect GitHub repository
2. Set environment variables:
   - `MONGO_URL` - MongoDB Atlas connection string
   - `DB_NAME` - pattern_coach
   - `JWT_SECRET` - Generate secure random string
   - `EMERGENT_LLM_KEY` - From Emergent dashboard
3. Deploy from `render.yaml` blueprint

### Expo (Frontend)
1. Run `eas build` for iOS/Android
2. Or `expo publish` for OTA updates
3. Configure `EXPO_PUBLIC_BACKEND_URL` to production API

---

## Test Credentials
```
Email: testparent@example.com
Password: test123456
```

---

## Future Roadmap

### Phase 2 - Engagement
- [ ] Daily streak tracking
- [ ] Push notifications
- [ ] Sound effects & animations
- [ ] Interactive mini-games

### Phase 3 - Growth
- [ ] Parent dashboard
- [ ] Activity reports
- [ ] Time limits / parental controls
- [ ] Family accounts

### Phase 4 - Expansion
- [ ] More vocabulary words (500+ target)
- [ ] Additional adventure worlds
- [ ] Story mode with narrative
- [ ] Multiplayer challenges

### Phase 5 - Monetization
- [ ] Stripe payment integration
- [ ] Monthly/yearly subscription plans
- [ ] In-app purchases for cosmetics

---

## Changelog

### v1.0.0 (March 2025) - MVP Release
- Initial release with all core features
- 5 adventure worlds
- 175+ vocabulary words across 3 levels
- AI-powered pattern recognition
- Avatar customization
- Badge system
- 7-day free trial

---

*Last Updated: March 19, 2025*
