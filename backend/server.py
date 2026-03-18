from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt
import base64
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'pattern-coach-secret-key-2025')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# LLM Config
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI(title="Pattern Coach API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    child_name: str
    child_age: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AvatarUpdate(BaseModel):
    skin_color: str = "#FFD4B8"
    hair_style: str = "curly"
    hair_color: str = "#4A2C2A"
    outfit: str = "explorer"
    accessory: str = "none"

class PatternAnalysis(BaseModel):
    image_base64: str

class MissionComplete(BaseModel):
    mission_id: str
    world_id: str
    score: int = 0
    patterns_found: List[str] = []

class UserResponse(BaseModel):
    id: str
    email: str
    child_name: str
    child_age: int
    avatar: Dict[str, str]
    subscription_status: str
    trial_end_date: Optional[str]
    stars: int
    level: int
    badges: List[str]
    completed_missions: List[str]
    discovered_patterns: List[str]
    created_at: str

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# ==================== WORLDS & MISSIONS DATA ====================

WORLDS = [
    {
        "id": "little-explorers",
        "name": "Little Explorers",
        "description": "Start your pattern adventure here!",
        "icon": "compass",
        "color": "#10B981",
        "unlocked": True,
        "missions": [
            {"id": "le-1", "name": "Stripe Safari", "description": "Find striped patterns around you", "pattern_type": "stripes", "stars_reward": 10},
            {"id": "le-2", "name": "Dot Detective", "description": "Discover polka dot patterns", "pattern_type": "dots", "stars_reward": 10},
            {"id": "le-3", "name": "Shape Hunter", "description": "Find repeating shapes", "pattern_type": "shapes", "stars_reward": 15},
        ]
    },
    {
        "id": "nature",
        "name": "Nature World",
        "description": "Discover patterns in nature!",
        "icon": "leaf",
        "color": "#22C55E",
        "unlocked": True,
        "missions": [
            {"id": "nw-1", "name": "Leaf Patterns", "description": "Find patterns on leaves and plants", "pattern_type": "leaves", "stars_reward": 15},
            {"id": "nw-2", "name": "Flower Power", "description": "Discover patterns in flowers", "pattern_type": "flowers", "stars_reward": 15},
            {"id": "nw-3", "name": "Animal Prints", "description": "Find animal pattern prints", "pattern_type": "animal", "stars_reward": 20},
        ]
    },
    {
        "id": "ocean",
        "name": "Ocean World",
        "description": "Dive into wavy patterns!",
        "icon": "water",
        "color": "#3B82F6",
        "unlocked": False,
        "unlock_requirement": 50,
        "missions": [
            {"id": "ow-1", "name": "Wave Rider", "description": "Find wavy and curved patterns", "pattern_type": "waves", "stars_reward": 20},
            {"id": "ow-2", "name": "Shell Seeker", "description": "Discover spiral patterns like shells", "pattern_type": "spirals", "stars_reward": 20},
            {"id": "ow-3", "name": "Fish Scales", "description": "Find scaly repeating patterns", "pattern_type": "scales", "stars_reward": 25},
        ]
    },
    {
        "id": "music",
        "name": "Music World",
        "description": "Find rhythm in patterns!",
        "icon": "music",
        "color": "#A855F7",
        "unlocked": False,
        "unlock_requirement": 100,
        "missions": [
            {"id": "mw-1", "name": "Rhythm Finder", "description": "Find repeating rhythm patterns", "pattern_type": "rhythm", "stars_reward": 25},
            {"id": "mw-2", "name": "Sound Waves", "description": "Discover sound wave patterns", "pattern_type": "soundwaves", "stars_reward": 25},
        ]
    },
    {
        "id": "city",
        "name": "City World",
        "description": "Urban pattern exploration!",
        "icon": "buildings",
        "color": "#F59E0B",
        "unlocked": False,
        "unlock_requirement": 150,
        "missions": [
            {"id": "cw-1", "name": "Building Blocks", "description": "Find patterns in buildings", "pattern_type": "buildings", "stars_reward": 30},
            {"id": "cw-2", "name": "Road Signs", "description": "Discover patterns on signs", "pattern_type": "signs", "stars_reward": 30},
            {"id": "cw-3", "name": "Tile Master", "description": "Find tile and brick patterns", "pattern_type": "tiles", "stars_reward": 35},
        ]
    }
]

BADGES = [
    {"id": "first-pattern", "name": "First Pattern!", "description": "Found your first pattern", "icon": "star", "requirement": "find_1_pattern"},
    {"id": "stripe-master", "name": "Stripe Master", "description": "Found 5 stripe patterns", "icon": "stripes", "requirement": "find_5_stripes"},
    {"id": "dot-detective", "name": "Dot Detective", "description": "Found 5 dot patterns", "icon": "dots", "requirement": "find_5_dots"},
    {"id": "nature-lover", "name": "Nature Lover", "description": "Completed all Nature missions", "icon": "leaf", "requirement": "complete_nature"},
    {"id": "explorer", "name": "Pattern Explorer", "description": "Reached 100 stars", "icon": "compass", "requirement": "100_stars"},
    {"id": "champion", "name": "Pattern Champion", "description": "Reached 500 stars", "icon": "trophy", "requirement": "500_stars"},
]

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/signup")
async def signup(data: UserSignup):
    # Check if user exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    trial_end = datetime.utcnow() + timedelta(days=7)
    
    user = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(data.password),
        "child_name": data.child_name,
        "child_age": data.child_age,
        "avatar": {
            "skin_color": "#FFD4B8",
            "hair_style": "curly",
            "hair_color": "#4A2C2A",
            "outfit": "explorer",
            "accessory": "none"
        },
        "subscription_status": "trial",
        "trial_end_date": trial_end.isoformat(),
        "stars": 0,
        "level": 1,
        "badges": [],
        "completed_missions": [],
        "discovered_patterns": [],
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db.users.insert_one(user)
    token = create_token(user_id)
    
    # Remove password from response
    user.pop('password', None)
    user.pop('_id', None)
    
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user['id'])
    
    # Remove sensitive data
    user.pop('password', None)
    user.pop('_id', None)
    
    return {"token": token, "user": user}

# ==================== USER ENDPOINTS ====================

@api_router.get("/user/status")
async def get_user_status(user = Depends(get_current_user)):
    user.pop('password', None)
    user.pop('_id', None)
    
    # Check trial status
    if user.get('subscription_status') == 'trial':
        trial_end = datetime.fromisoformat(user['trial_end_date'])
        if datetime.utcnow() > trial_end:
            user['subscription_status'] = 'expired'
            await db.users.update_one(
                {"id": user['id']},
                {"$set": {"subscription_status": "expired"}}
            )
    
    return user

@api_router.post("/user/avatar")
async def update_avatar(avatar: AvatarUpdate, user = Depends(get_current_user)):
    avatar_dict = avatar.dict()
    
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {"avatar": avatar_dict}}
    )
    
    return {"success": True, "avatar": avatar_dict}

# ==================== ADVENTURE ENDPOINTS ====================

@api_router.get("/adventure/worlds")
async def get_worlds(user = Depends(get_current_user)):
    user_stars = user.get('stars', 0)
    worlds_data = []
    
    for world in WORLDS:
        world_copy = world.copy()
        # Check if world should be unlocked based on stars
        if not world_copy['unlocked']:
            unlock_req = world_copy.get('unlock_requirement', 0)
            if user_stars >= unlock_req:
                world_copy['unlocked'] = True
        worlds_data.append(world_copy)
    
    return {"worlds": worlds_data}

@api_router.get("/adventure/missions/{world_id}")
async def get_world_missions(world_id: str, user = Depends(get_current_user)):
    world = next((w for w in WORLDS if w['id'] == world_id), None)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    
    completed = user.get('completed_missions', [])
    missions = []
    for m in world['missions']:
        mission = m.copy()
        mission['completed'] = m['id'] in completed
        missions.append(mission)
    
    return {"world": world, "missions": missions}

@api_router.post("/adventure/complete-mission")
async def complete_mission(data: MissionComplete, user = Depends(get_current_user)):
    # Find the mission
    mission = None
    for world in WORLDS:
        if world['id'] == data.world_id:
            mission = next((m for m in world['missions'] if m['id'] == data.mission_id), None)
            break
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # Check if already completed
    completed = user.get('completed_missions', [])
    new_stars = user.get('stars', 0)
    new_badges = user.get('badges', [])
    discovered = user.get('discovered_patterns', [])
    
    if data.mission_id not in completed:
        completed.append(data.mission_id)
        new_stars += mission.get('stars_reward', 10) + data.score
    
    # Add discovered patterns
    for pattern in data.patterns_found:
        if pattern not in discovered:
            discovered.append(pattern)
    
    # Check for badge unlocks
    if len(discovered) >= 1 and 'first-pattern' not in new_badges:
        new_badges.append('first-pattern')
    if new_stars >= 100 and 'explorer' not in new_badges:
        new_badges.append('explorer')
    if new_stars >= 500 and 'champion' not in new_badges:
        new_badges.append('champion')
    
    # Calculate level (every 50 stars = 1 level)
    new_level = (new_stars // 50) + 1
    
    # Update user
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {
            "completed_missions": completed,
            "stars": new_stars,
            "badges": new_badges,
            "discovered_patterns": discovered,
            "level": new_level
        }}
    )
    
    return {
        "success": True,
        "stars_earned": mission.get('stars_reward', 10) + data.score,
        "total_stars": new_stars,
        "new_badges": new_badges,
        "level": new_level
    }

@api_router.get("/adventure/badges")
async def get_badges(user = Depends(get_current_user)):
    user_badges = user.get('badges', [])
    badges_data = []
    
    for badge in BADGES:
        badge_copy = badge.copy()
        badge_copy['unlocked'] = badge['id'] in user_badges
        badges_data.append(badge_copy)
    
    return {"badges": badges_data}

# ==================== PATTERN ANALYSIS ENDPOINT ====================

@api_router.post("/analyze-pattern")
async def analyze_pattern(data: PatternAnalysis, user = Depends(get_current_user)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        import json
        from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
        
        system_message = """You are a friendly pattern recognition assistant for children aged 3-8. 
Analyze the image and identify ANY patterns you can see. 
Be encouraging and use simple, kid-friendly language!

Patterns to look for include:
- Stripes (lines going the same direction)
- Polka dots (circles repeated)
- Zigzags (up and down lines)
- Spirals (swirly circles)
- Waves (curvy lines)
- Checkers (squares alternating)
- Shapes that repeat (triangles, squares, hearts, stars)
- Nature patterns (leaf veins, flower petals, animal spots/stripes)
- Any repeating elements

Respond in JSON format with:
{
  "patterns_found": ["list of pattern types found"],
  "description": "A fun, encouraging description for kids about what patterns you found",
  "pattern_count": number of distinct patterns,
  "encouragement": "A cheerful message to encourage the child",
  "score": number from 1-10 based on how interesting the patterns are
}

If no clear patterns are found, still be encouraging and suggest what to look for next."""

        # Initialize chat with Emergent LLM key
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"pattern-{user['id']}-{uuid.uuid4()}",
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        # Create image content from base64
        image_content = ImageContent(image_base64=data.image_base64)
        
        # Create message with image
        user_message = UserMessage(
            text="What patterns can you see in this picture? Please analyze it for a child. Respond in JSON format.",
            file_contents=[image_content]
        )
        
        # Send and get response
        response_text = await chat.send_message(user_message)
        
        # Try to parse JSON response
        try:
            # Clean up response if needed
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            result = json.loads(response_text.strip())
        except:
            # If JSON parsing fails, create a structured response
            result = {
                "patterns_found": ["pattern"],
                "description": response_text[:200] if len(response_text) > 200 else response_text,
                "pattern_count": 1,
                "encouragement": "Great job taking that picture! Keep exploring!",
                "score": 5
            }
        
        return result
        
    except Exception as e:
        logger.error(f"Pattern analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pattern analysis failed: {str(e)}")
        
        return result
        
    except Exception as e:
        logger.error(f"Pattern analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pattern analysis failed: {str(e)}")

# ==================== ROOT DETECTIVE DATA ====================

# Color coding for word parts
PART_COLORS = {
    "root": "#10B981",      # Green
    "prefix": "#3B82F6",    # Blue  
    "suffix": "#F59E0B",    # Orange
}

# Import comprehensive root words database
from root_words_data import ROOT_WORDS_DATABASE, get_level_words, get_level_roots, get_level_stats

# Convert database to flat list for backward compatibility
ROOT_WORDS = []
for level_key, level_data in ROOT_WORDS_DATABASE.items():
    for root in level_data["roots"]:
        root_copy = root.copy()
        root_copy["age_group"] = level_data["age_group"]
        root_copy["level"] = level_key
        ROOT_WORDS.append(root_copy)

@api_router.get("/roots")
async def get_roots(user = Depends(get_current_user), level: str = None):
    """Get all root words grouped by root, optionally filtered by level"""
    child_age = user.get('child_age', 5)
    
    # Determine which level to show
    if level:
        # User requested specific level
        if level in ROOT_WORDS_DATABASE:
            filtered_roots = get_level_roots(level)
            level_info = ROOT_WORDS_DATABASE[level]
        else:
            raise HTTPException(status_code=404, detail="Level not found")
    else:
        # Auto-select based on age
        if child_age <= 5:
            level = "level_1"
        elif child_age <= 8:
            level = "level_2"
        else:
            level = "level_3"
        
        filtered_roots = get_level_roots(level)
        level_info = ROOT_WORDS_DATABASE[level]
    
    # Add progress info
    root_progress = user.get('root_progress', {})
    roots_with_progress = []
    for root in filtered_roots:
        root_copy = root.copy()
        root_copy['completed_words'] = root_progress.get(root['id'], {}).get('completed', [])
        root_copy['mastered'] = len(root_copy['completed_words']) >= len(root['words'])
        roots_with_progress.append(root_copy)
    
    return {
        "roots": roots_with_progress,
        "part_colors": PART_COLORS,
        "total_words": sum(len(r['words']) for r in filtered_roots),
        "completed_words": sum(len(r.get('completed_words', [])) for r in roots_with_progress),
        "level": level,
        "level_name": level_info["name"],
        "level_description": level_info["description"],
        "available_levels": get_level_stats()
    }

@api_router.get("/roots/levels")
async def get_root_levels(user = Depends(get_current_user)):
    """Get all available levels with stats"""
    child_age = user.get('child_age', 5)
    root_progress = user.get('root_progress', {})
    
    levels = []
    for level_key, level_data in ROOT_WORDS_DATABASE.items():
        # Count completed words for this level
        level_roots = level_data["roots"]
        total_words = sum(len(r['words']) for r in level_roots)
        completed = 0
        for root in level_roots:
            completed += len(root_progress.get(root['id'], {}).get('completed', []))
        
        # Determine if unlocked
        unlocked = True
        if level_key == "level_2":
            # Unlock level 2 after completing 20 words in level 1
            level1_completed = sum(len(root_progress.get(r['id'], {}).get('completed', [])) 
                                   for r in ROOT_WORDS_DATABASE["level_1"]["roots"])
            unlocked = level1_completed >= 20
        elif level_key == "level_3":
            # Unlock level 3 after completing 25 words in level 2
            level2_completed = sum(len(root_progress.get(r['id'], {}).get('completed', [])) 
                                   for r in ROOT_WORDS_DATABASE["level_2"]["roots"])
            unlocked = level2_completed >= 25
        
        levels.append({
            "id": level_key,
            "name": level_data["name"],
            "age_group": level_data["age_group"],
            "description": level_data["description"],
            "total_roots": len(level_roots),
            "total_words": total_words,
            "completed_words": completed,
            "progress_percent": int((completed / total_words) * 100) if total_words > 0 else 0,
            "unlocked": unlocked
        })
    
    return {"levels": levels}

@api_router.get("/roots/{root_id}")
async def get_root_detail(root_id: str, user = Depends(get_current_user)):
    """Get detailed info for a specific root"""
    root = next((r for r in ROOT_WORDS if r['id'] == root_id), None)
    if not root:
        raise HTTPException(status_code=404, detail="Root not found")
    
    root_progress = user.get('root_progress', {})
    root_data = root.copy()
    root_data['completed_words'] = root_progress.get(root_id, {}).get('completed', [])
    
    return {"root": root_data, "part_colors": PART_COLORS}

class RootProgressUpdate(BaseModel):
    root_id: str
    word: str
    game_type: str  # 'explorer', 'match', 'sort'
    score: int = 0

@api_router.post("/roots/progress")
async def update_root_progress(data: RootProgressUpdate, user = Depends(get_current_user)):
    """Update progress for root detective games"""
    root_progress = user.get('root_progress', {})
    
    if data.root_id not in root_progress:
        root_progress[data.root_id] = {'completed': [], 'scores': {}}
    
    if data.word not in root_progress[data.root_id]['completed']:
        root_progress[data.root_id]['completed'].append(data.word)
    
    # Track best score per game type
    game_key = f"{data.word}_{data.game_type}"
    if data.score > root_progress[data.root_id]['scores'].get(game_key, 0):
        root_progress[data.root_id]['scores'][game_key] = data.score
    
    # Award stars for progress
    new_stars = user.get('stars', 0) + 5
    
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {
            "root_progress": root_progress,
            "stars": new_stars
        }}
    )
    
    return {
        "success": True,
        "stars_earned": 5,
        "total_stars": new_stars,
        "progress": root_progress[data.root_id]
    }

# ==================== GAME BOARD DATA ====================

BOARD_TILES = [
    {"id": "start", "type": "corner", "position": 0, "name": "Start", "emoji": "🚀", "color": "#10B981"},
    {"id": "rainbow-colors", "type": "mission", "position": 1, "name": "Rainbow Colors", "emoji": "🌈", "color": "#F87171", "world": "little-explorers", "difficulty": "easy", "stars_reward": 10},
    {"id": "shape-sorting", "type": "mission", "position": 2, "name": "Shape Sorting", "emoji": "🔷", "color": "#60A5FA", "world": "little-explorers", "difficulty": "easy", "stars_reward": 10},
    {"id": "camera", "type": "corner", "position": 3, "name": "Camera", "emoji": "📸", "color": "#A855F7"},
    {"id": "nature-easy", "type": "mission", "position": 4, "name": "Forest Patterns", "emoji": "🍃", "color": "#4ADE80", "world": "nature", "difficulty": "easy", "stars_reward": 15},
    {"id": "nature-medium", "type": "mission", "position": 5, "name": "Seasonal Cycles", "emoji": "🦓", "color": "#22C55E", "world": "nature", "difficulty": "medium", "stars_reward": 20},
    {"id": "music-easy", "type": "mission", "position": 6, "name": "Broken Rhythm", "emoji": "🥁", "color": "#818CF8", "world": "music", "difficulty": "easy", "stars_reward": 15},
    {"id": "journal", "type": "corner", "position": 7, "name": "Journal", "emoji": "📔", "color": "#F59E0B"},
    {"id": "music-medium", "type": "mission", "position": 8, "name": "Symphony Scale", "emoji": "🎵", "color": "#6366F1", "world": "music", "difficulty": "medium", "stars_reward": 20},
    {"id": "city-easy", "type": "mission", "position": 9, "name": "Traffic Lights", "emoji": "🚦", "color": "#FB923C", "world": "city", "difficulty": "easy", "stars_reward": 15},
    {"id": "city-medium", "type": "mission", "position": 10, "name": "Skyline Code", "emoji": "🏢", "color": "#F97316", "world": "city", "difficulty": "medium", "stars_reward": 20},
    {"id": "avatar", "type": "corner", "position": 11, "name": "Avatar", "emoji": "🐝", "color": "#FBBF24"},
    {"id": "numbers-easy", "type": "mission", "position": 12, "name": "Counting Code", "emoji": "🔢", "color": "#2DD4BF", "world": "numbers", "difficulty": "easy", "stars_reward": 15},
    {"id": "story-easy", "type": "mission", "position": 13, "name": "Tale Beginning", "emoji": "📖", "color": "#FB7185", "world": "story", "difficulty": "easy", "stars_reward": 15},
    {"id": "big-and-small", "type": "mission", "position": 14, "name": "Big & Small", "emoji": "🐘", "color": "#F87171", "world": "little-explorers", "difficulty": "medium", "stars_reward": 15},
    {"id": "challenge", "type": "corner", "position": 15, "name": "Challenge!", "emoji": "⭐", "color": "#EAB308"},
]

@api_router.get("/adventure/board")
async def get_board_data(user = Depends(get_current_user)):
    """Get game board tiles with user progress"""
    completed = user.get('completed_missions', [])
    progress = user.get('mission_progress', {})
    subscription = user.get('subscription_status', 'trial')
    trial_end = user.get('trial_end_date')
    
    # Check if trial is active
    is_trial_active = subscription == 'trial'
    if is_trial_active and trial_end:
        trial_end_date = datetime.fromisoformat(trial_end)
        is_trial_active = datetime.utcnow() < trial_end_date
    
    is_premium = subscription == 'active' or is_trial_active
    
    tiles_with_progress = []
    for tile in BOARD_TILES:
        tile_data = tile.copy()
        
        # Add completion status
        if tile['type'] == 'mission':
            tile_data['completed'] = tile['id'] in completed
            tile_data['stars_earned'] = progress.get(tile['id'], {}).get('stars', 0)
            
            # Determine if unlocked
            if tile.get('world') == 'little-explorers':
                tile_data['unlocked'] = True  # Little Explorers is always free
            elif not is_premium:
                tile_data['unlocked'] = False
                tile_data['lock_reason'] = 'premium'
            elif tile.get('difficulty') == 'easy':
                tile_data['unlocked'] = True
            elif tile.get('difficulty') == 'medium':
                # Check if easy missions in same world are complete
                world = tile.get('world')
                easy_missions = [t['id'] for t in BOARD_TILES if t.get('world') == world and t.get('difficulty') == 'easy']
                tile_data['unlocked'] = all(m in completed for m in easy_missions)
                if not tile_data['unlocked']:
                    tile_data['lock_reason'] = 'progression'
            else:
                tile_data['unlocked'] = True
        else:
            # Corner tiles are always accessible
            tile_data['unlocked'] = True
        
        tiles_with_progress.append(tile_data)
    
    # Calculate total progress
    mission_tiles = [t for t in BOARD_TILES if t['type'] == 'mission']
    completed_count = len([t for t in mission_tiles if t['id'] in completed])
    
    return {
        "tiles": tiles_with_progress,
        "progress": {
            "completed": completed_count,
            "total": len(mission_tiles),
        },
        "is_premium": is_premium,
        "child_name": user.get('child_name', 'Explorer')
    }

class BoardMissionComplete(BaseModel):
    mission_id: str
    score: int = 0
    stars: int = 1  # 1-3 stars based on performance

@api_router.post("/adventure/board/complete")
async def complete_board_mission(data: BoardMissionComplete, user = Depends(get_current_user)):
    """Complete a board mission and award stars"""
    # Find the tile
    tile = next((t for t in BOARD_TILES if t['id'] == data.mission_id), None)
    if not tile or tile['type'] != 'mission':
        raise HTTPException(status_code=404, detail="Mission not found")
    
    completed = user.get('completed_missions', [])
    progress = user.get('mission_progress', {})
    new_stars = user.get('stars', 0)
    new_badges = user.get('badges', [])
    
    # Initialize mission progress if not exists
    if data.mission_id not in progress:
        progress[data.mission_id] = {'stars': 0, 'best_score': 0}
    
    # Update if better performance
    if data.stars > progress[data.mission_id]['stars']:
        stars_diff = data.stars - progress[data.mission_id]['stars']
        new_stars += stars_diff * 5  # Each star worth 5 points
        progress[data.mission_id]['stars'] = data.stars
    
    if data.score > progress[data.mission_id].get('best_score', 0):
        progress[data.mission_id]['best_score'] = data.score
    
    # Mark as completed if first time
    first_completion = data.mission_id not in completed
    if first_completion:
        completed.append(data.mission_id)
        new_stars += tile.get('stars_reward', 10)
    
    # Check for badge unlocks
    if len(completed) >= 1 and 'first-pattern' not in new_badges:
        new_badges.append('first-pattern')
    if new_stars >= 100 and 'explorer' not in new_badges:
        new_badges.append('explorer')
    if new_stars >= 500 and 'champion' not in new_badges:
        new_badges.append('champion')
    
    # Calculate level
    new_level = (new_stars // 50) + 1
    
    # Update user
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {
            "completed_missions": completed,
            "mission_progress": progress,
            "stars": new_stars,
            "badges": new_badges,
            "level": new_level
        }}
    )
    
    return {
        "success": True,
        "first_completion": first_completion,
        "stars_earned": data.stars,
        "total_stars": new_stars,
        "new_badges": new_badges,
        "level": new_level
    }

# ==================== SUBSCRIPTION ENDPOINTS ====================

@api_router.post("/subscription/checkout")
async def create_checkout(user = Depends(get_current_user)):
    # For MVP, we'll simulate subscription activation
    # In production, integrate with Stripe
    return {
        "message": "Subscription checkout - integrate with Stripe for production",
        "mock_checkout_url": "https://checkout.stripe.com/mock"
    }

@api_router.post("/subscription/activate")
async def activate_subscription(user = Depends(get_current_user)):
    # Activate subscription (for demo/testing)
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {
            "subscription_status": "active",
            "subscription_start": datetime.utcnow().isoformat()
        }}
    )
    return {"success": True, "status": "active"}

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "Pattern Coach API", "version": "1.0.0", "status": "running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
