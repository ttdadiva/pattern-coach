#!/usr/bin/env python3
"""
Pattern Coach API Backend Test Suite
Tests all backend endpoints with proper authentication and error handling
"""

import requests
import json
import base64
import time
import sys
from typing import Dict, Optional

# Use production backend URL from frontend environment
API_BASE_URL = "https://pattern-preview-2.preview.emergentagent.com/api"

# Test data
import random
import string

def generate_unique_email():
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test{random_suffix}@example.com"

TEST_USER = {
    "email": generate_unique_email(),
    "password": "testpass123",
    "child_name": "Tommy",
    "child_age": 6
}

EXISTING_USER = {
    "email": "testparent@example.com", 
    "password": "test123456"
}

MISSION_DATA = {
    "mission_id": "le-2",
    "world_id": "little-explorers",
    "score": 5,
    "patterns_found": ["dots"]
}

AVATAR_DATA = {
    "skin_color": "#FFD4B8",
    "hair_style": "spiky", 
    "hair_color": "#1A1A1A",
    "outfit": "scientist",
    "accessory": "glasses"
}

class PatternCoachAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token: Optional[str] = None
        self.test_results = {
            "passed": [],
            "failed": [],
            "errors": []
        }
        
    def log_test(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        result = f"{'✅' if success else '❌'} {test_name}"
        if message:
            result += f": {message}"
        print(result)
        
        if success:
            self.test_results["passed"].append(test_name)
        else:
            self.test_results["failed"].append((test_name, message))
    
    def make_request(self, method: str, endpoint: str, data=None, headers=None, auth_required=False) -> Dict:
        """Make HTTP request with error handling"""
        url = f"{API_BASE_URL}{endpoint}"
        
        request_headers = {"Content-Type": "application/json"}
        if headers:
            request_headers.update(headers)
            
        if auth_required and self.auth_token:
            request_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=request_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=request_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return {
                "status_code": response.status_code,
                "data": response.json() if response.content else {},
                "success": 200 <= response.status_code < 300
            }
        except requests.exceptions.RequestException as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False,
                "connection_error": True
            }
        except json.JSONDecodeError as e:
            return {
                "status_code": response.status_code,
                "data": {"error": f"Invalid JSON response: {str(e)}"},
                "success": False
            }

    def test_health_check(self):
        """Test API health check endpoint"""
        print("\n=== Testing Health Check ===")
        
        result = self.make_request("GET", "/health")
        if result["success"]:
            self.log_test("Health Check", True, "API is running")
        else:
            self.log_test("Health Check", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_signup(self) -> bool:
        """Test user signup endpoint"""
        print("\n=== Testing Signup Endpoint ===")
        
        result = self.make_request("POST", "/auth/signup", TEST_USER)
        
        if result["success"]:
            data = result["data"]
            if "token" in data and "user" in data:
                # Check trial subscription setup
                user = data["user"]
                if (user.get("subscription_status") == "trial" and 
                    user.get("trial_end_date") and
                    user.get("child_name") == TEST_USER["child_name"]):
                    self.log_test("Signup", True, "User created with trial subscription")
                    return True
                else:
                    self.log_test("Signup", False, "Trial subscription not set up correctly")
            else:
                self.log_test("Signup", False, "Missing token or user data in response")
        else:
            if result.get("connection_error"):
                self.log_test("Signup", False, f"Connection error: {result['data']['error']}")
            else:
                self.log_test("Signup", False, f"Status: {result['status_code']}, Error: {result['data']}")
        
        return False

    def test_login(self) -> bool:
        """Test user login endpoint"""
        print("\n=== Testing Login Endpoint ===")
        
        result = self.make_request("POST", "/auth/login", EXISTING_USER)
        
        if result["success"]:
            data = result["data"]
            if "token" in data and "user" in data:
                self.auth_token = data["token"]
                user = data["user"]
                self.log_test("Login", True, f"Logged in as {user.get('child_name', 'Unknown')}")
                return True
            else:
                self.log_test("Login", False, "Missing token or user data")
        else:
            if result.get("connection_error"):
                self.log_test("Login", False, f"Connection error: {result['data']['error']}")
            else:
                self.log_test("Login", False, f"Status: {result['status_code']}, Error: {result['data']}")
        
        return False

    def test_user_status(self):
        """Test user status endpoint"""
        print("\n=== Testing User Status Endpoint ===")
        
        if not self.auth_token:
            self.log_test("User Status", False, "No auth token available")
            return
            
        result = self.make_request("GET", "/user/status", auth_required=True)
        
        if result["success"]:
            user = result["data"]
            required_fields = ["email", "stars", "badges", "completed_missions", "subscription_status"]
            missing_fields = [field for field in required_fields if field not in user]
            
            if not missing_fields:
                self.log_test("User Status", True, f"User has {user.get('stars', 0)} stars, {len(user.get('badges', []))} badges")
            else:
                self.log_test("User Status", False, f"Missing fields: {missing_fields}")
        else:
            self.log_test("User Status", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_adventure_worlds(self):
        """Test adventure worlds endpoint"""
        print("\n=== Testing Adventure Worlds Endpoint ===")
        
        if not self.auth_token:
            self.log_test("Adventure Worlds", False, "No auth token available")
            return
            
        result = self.make_request("GET", "/adventure/worlds", auth_required=True)
        
        if result["success"]:
            data = result["data"]
            worlds = data.get("worlds", [])
            
            if len(worlds) == 5:
                # Check unlock logic based on stars
                unlocked_worlds = [w for w in worlds if w.get("unlocked")]
                locked_worlds = [w for w in worlds if not w.get("unlocked")]
                
                self.log_test("Adventure Worlds", True, 
                             f"5 worlds returned, {len(unlocked_worlds)} unlocked, {len(locked_worlds)} locked")
            else:
                self.log_test("Adventure Worlds", False, f"Expected 5 worlds, got {len(worlds)}")
        else:
            self.log_test("Adventure Worlds", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_world_missions(self):
        """Test world missions endpoint"""
        print("\n=== Testing World Missions Endpoint ===")
        
        if not self.auth_token:
            self.log_test("World Missions", False, "No auth token available")
            return
            
        result = self.make_request("GET", "/adventure/missions/little-explorers", auth_required=True)
        
        if result["success"]:
            data = result["data"]
            if "world" in data and "missions" in data:
                world = data["world"]
                missions = data["missions"]
                
                if world.get("name") == "Little Explorers" and len(missions) > 0:
                    completed_missions = [m for m in missions if m.get("completed")]
                    self.log_test("World Missions", True, 
                                 f"World: {world['name']}, {len(missions)} missions, {len(completed_missions)} completed")
                else:
                    self.log_test("World Missions", False, "Invalid world or missions data")
            else:
                self.log_test("World Missions", False, "Missing world or missions in response")
        else:
            self.log_test("World Missions", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_complete_mission(self):
        """Test mission completion endpoint"""
        print("\n=== Testing Complete Mission Endpoint ===")
        
        if not self.auth_token:
            self.log_test("Complete Mission", False, "No auth token available")
            return
            
        result = self.make_request("POST", "/adventure/complete-mission", MISSION_DATA, auth_required=True)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and "stars_earned" in data and "total_stars" in data:
                stars_earned = data.get("stars_earned", 0)
                total_stars = data.get("total_stars", 0)
                new_badges = data.get("new_badges", [])
                
                self.log_test("Complete Mission", True, 
                             f"Mission completed, earned {stars_earned} stars, total: {total_stars}, badges: {len(new_badges)}")
            else:
                self.log_test("Complete Mission", False, "Invalid mission completion response")
        else:
            self.log_test("Complete Mission", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_badges(self):
        """Test badges endpoint"""
        print("\n=== Testing Badges Endpoint ===")
        
        if not self.auth_token:
            self.log_test("Badges", False, "No auth token available")
            return
            
        result = self.make_request("GET", "/adventure/badges", auth_required=True)
        
        if result["success"]:
            data = result["data"]
            badges = data.get("badges", [])
            
            if badges:
                unlocked_badges = [b for b in badges if b.get("unlocked")]
                locked_badges = [b for b in badges if not b.get("unlocked")]
                
                self.log_test("Badges", True, 
                             f"{len(badges)} badges total, {len(unlocked_badges)} unlocked, {len(locked_badges)} locked")
            else:
                self.log_test("Badges", False, "No badges returned")
        else:
            self.log_test("Badges", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_update_avatar(self):
        """Test avatar update endpoint"""
        print("\n=== Testing Update Avatar Endpoint ===")
        
        if not self.auth_token:
            self.log_test("Update Avatar", False, "No auth token available")
            return
            
        result = self.make_request("POST", "/user/avatar", AVATAR_DATA, auth_required=True)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and "avatar" in data:
                avatar = data["avatar"]
                self.log_test("Update Avatar", True, f"Avatar updated: {avatar.get('outfit', 'unknown')} outfit")
            else:
                self.log_test("Update Avatar", False, "Avatar update response invalid")
        else:
            self.log_test("Update Avatar", False, f"Status: {result['status_code']}, Error: {result['data']}")

    def test_pattern_analysis(self):
        """Test pattern analysis AI endpoint"""
        print("\n=== Testing Pattern Analysis AI Endpoint ===")
        
        if not self.auth_token:
            self.log_test("Pattern Analysis", False, "No auth token available")
            return
        
        # Create a simple test image (small PNG in base64)
        # This is a minimal 1x1 pixel PNG for testing
        test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        pattern_data = {"image_base64": test_image_b64}
        
        result = self.make_request("POST", "/analyze-pattern", pattern_data, auth_required=True)
        
        if result["success"]:
            data = result["data"]
            required_fields = ["patterns_found", "description", "encouragement"]
            
            if all(field in data for field in required_fields):
                patterns = data.get("patterns_found", [])
                score = data.get("score", 0)
                self.log_test("Pattern Analysis", True, 
                             f"AI analysis working, found {len(patterns)} patterns, score: {score}")
            else:
                missing = [f for f in required_fields if f not in data]
                self.log_test("Pattern Analysis", False, f"Missing fields in AI response: {missing}")
        else:
            error_msg = result['data'].get('detail', 'Unknown error')
            if "AI service not configured" in error_msg:
                self.log_test("Pattern Analysis", False, "AI service not configured - EMERGENT_LLM_KEY missing")
            else:
                self.log_test("Pattern Analysis", False, f"Status: {result['status_code']}, Error: {error_msg}")

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting Pattern Coach API Tests")
        print(f"Testing against: {API_BASE_URL}")
        print("=" * 50)
        
        # Health check first
        self.test_health_check()
        
        # Auth tests
        signup_success = self.test_signup()
        login_success = self.test_login()
        
        # Only run authenticated tests if login succeeded
        if login_success:
            self.test_user_status()
            self.test_adventure_worlds()
            self.test_world_missions()
            self.test_complete_mission()
            self.test_badges()
            self.test_update_avatar()
            self.test_pattern_analysis()  # This is the priority test
        else:
            print("\n⚠️  Skipping authenticated tests - login failed")
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 50)
        print("🎯 TEST SUMMARY")
        print("=" * 50)
        
        total_tests = len(self.test_results["passed"]) + len(self.test_results["failed"])
        passed = len(self.test_results["passed"])
        failed = len(self.test_results["failed"])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
        
        if self.test_results["failed"]:
            print("\n🚨 FAILED TESTS:")
            for test_name, error in self.test_results["failed"]:
                print(f"  - {test_name}: {error}")
        
        if passed == total_tests:
            print("\n🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"\n⚠️  {failed} test(s) failed. Check the details above.")

if __name__ == "__main__":
    tester = PatternCoachAPITester()
    tester.run_all_tests()