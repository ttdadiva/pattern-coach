#!/usr/bin/env python3
"""
Pattern Coach Backend API Testing Suite
Tests all backend endpoints including new Stripe subscription and push notification features
"""

import requests
import json
import sys
from datetime import datetime

# API Configuration
API_BASE = "https://pattern-preview-2.preview.emergentagent.com/api"
TEST_CREDENTIALS = {
    "email": "testparent@example.com",
    "password": "test123456"
}

# Test Results Tracking
test_results = []
auth_token = None

def log_test(endpoint, method, status_code, expected_status, response_data=None, error=None):
    """Log test results"""
    success = status_code == expected_status
    result = {
        "endpoint": endpoint,
        "method": method,
        "status_code": status_code,
        "expected": expected_status,
        "success": success,
        "timestamp": datetime.now().isoformat(),
        "response_data": response_data,
        "error": error
    }
    test_results.append(result)
    
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {method} {endpoint} - {status_code} (expected {expected_status})")
    if error:
        print(f"     Error: {error}")
    if not success and response_data:
        print(f"     Response: {response_data}")
    return success

def test_auth_login():
    """Test user login to get auth token"""
    global auth_token
    
    print("\n=== AUTHENTICATION TESTS ===")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=TEST_CREDENTIALS,
            timeout=30
        )
        
        success = log_test("/auth/login", "POST", response.status_code, 200, response.json())
        
        if response.status_code == 200:
            data = response.json()
            auth_token = data.get('token')
            if auth_token:
                print(f"     Auth token obtained: {auth_token[:20]}...")
                return True
        
        return False
        
    except Exception as e:
        log_test("/auth/login", "POST", 0, 200, None, str(e))
        return False

def test_user_status():
    """Test user status endpoint"""
    if not auth_token:
        print("Skipping user status test - no auth token")
        return False
        
    try:
        response = requests.get(
            f"{API_BASE}/user/status",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        return log_test("/user/status", "GET", response.status_code, 200, response.json() if response.status_code == 200 else None)
        
    except Exception as e:
        log_test("/user/status", "GET", 0, 200, None, str(e))
        return False

def test_stripe_subscription_plans():
    """Test GET /api/subscription/plans"""
    print("\n=== STRIPE SUBSCRIPTION TESTS ===")
    
    try:
        response = requests.get(f"{API_BASE}/subscription/plans", timeout=30)
        
        success = log_test("/subscription/plans", "GET", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            plans = data.get('plans', [])
            print(f"     Found {len(plans)} subscription plans")
            
            # Verify expected plans exist
            monthly_plan = next((p for p in plans if p['id'] == 'monthly'), None)
            yearly_plan = next((p for p in plans if p['id'] == 'yearly'), None)
            
            if monthly_plan and monthly_plan['price'] == 4.99:
                print("     ✅ Monthly plan ($4.99) found")
            else:
                print("     ❌ Monthly plan not found or incorrect price")
                success = False
                
            if yearly_plan and yearly_plan['price'] == 39.99:
                print("     ✅ Yearly plan ($39.99) found")
            else:
                print("     ❌ Yearly plan not found or incorrect price")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/subscription/plans", "GET", 0, 200, None, str(e))
        return False

def test_stripe_checkout():
    """Test POST /api/subscription/checkout"""
    if not auth_token:
        print("Skipping checkout test - no auth token")
        return False
        
    try:
        checkout_data = {
            "plan": "monthly",
            "origin_url": "https://pattern-preview-2.preview.emergentagent.com"
        }
        
        response = requests.post(
            f"{API_BASE}/subscription/checkout",
            json=checkout_data,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        success = log_test("/subscription/checkout", "POST", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            checkout_url = data.get('checkout_url')
            session_id = data.get('session_id')
            
            if checkout_url and 'stripe' in checkout_url.lower():
                print("     ✅ Valid Stripe checkout URL received")
            else:
                print(f"     ❌ Invalid checkout URL: {checkout_url}")
                success = False
                
            if session_id:
                print(f"     ✅ Session ID received: {session_id[:20]}...")
            else:
                print("     ❌ No session ID received")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/subscription/checkout", "POST", 0, 200, None, str(e))
        return False

def test_subscription_activate():
    """Test POST /api/subscription/activate (demo endpoint)"""
    if not auth_token:
        print("Skipping subscription activate test - no auth token")
        return False
        
    try:
        response = requests.post(
            f"{API_BASE}/subscription/activate",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        success = log_test("/subscription/activate", "POST", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('status') == 'active':
                print("     ✅ Subscription activated successfully")
            else:
                print(f"     ❌ Unexpected response: {data}")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/subscription/activate", "POST", 0, 200, None, str(e))
        return False

def test_push_register():
    """Test POST /api/push/register"""
    print("\n=== PUSH NOTIFICATION TESTS ===")
    
    if not auth_token:
        print("Skipping push register test - no auth token")
        return False
        
    try:
        push_data = {
            "token": "ExponentPushToken[test-token-abc]",
            "device_type": "iOS",
            "device_model": "iPhone 15"
        }
        
        response = requests.post(
            f"{API_BASE}/push/register",
            json=push_data,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        success = log_test("/push/register", "POST", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("     ✅ Push token registered successfully")
            else:
                print(f"     ❌ Registration failed: {data}")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/push/register", "POST", 0, 200, None, str(e))
        return False

def test_push_settings_get():
    """Test GET /api/push/settings"""
    if not auth_token:
        print("Skipping push settings get test - no auth token")
        return False
        
    try:
        response = requests.get(
            f"{API_BASE}/push/settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        success = log_test("/push/settings", "GET", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            expected_settings = ['daily_reminder', 'daily_reminder_time', 'achievement_alerts', 'streak_reminders']
            
            has_all_settings = all(setting in data for setting in expected_settings)
            if has_all_settings:
                print("     ✅ All notification settings returned")
                print(f"     Settings: {data}")
            else:
                print(f"     ❌ Missing settings. Expected: {expected_settings}, Got: {list(data.keys())}")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/push/settings", "GET", 0, 200, None, str(e))
        return False

def test_push_settings_update():
    """Test POST /api/push/settings"""
    if not auth_token:
        print("Skipping push settings update test - no auth token")
        return False
        
    try:
        # Using query params as per API design
        params = {
            "daily_reminder": "true",
            "daily_reminder_time": "16:00",
            "achievement_alerts": "true",
            "streak_reminders": "true"
        }
        
        response = requests.post(
            f"{API_BASE}/push/settings",
            params=params,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=30
        )
        
        success = log_test("/push/settings", "POST", response.status_code, 200)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'settings' in data:
                print("     ✅ Notification settings updated successfully")
                settings = data['settings']
                print(f"     Updated settings: daily_reminder={settings.get('daily_reminder')}, time={settings.get('daily_reminder_time')}")
            else:
                print(f"     ❌ Update failed: {data}")
                success = False
        
        return success
        
    except Exception as e:
        log_test("/push/settings", "POST", 0, 200, None, str(e))
        return False

def test_existing_features():
    """Test existing features to ensure no regression"""
    print("\n=== REGRESSION TESTS (Existing Features) ===")
    
    success_count = 0
    total_tests = 0
    
    # Test adventure worlds
    if auth_token:
        total_tests += 1
        try:
            response = requests.get(
                f"{API_BASE}/adventure/worlds",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=30
            )
            if log_test("/adventure/worlds", "GET", response.status_code, 200):
                success_count += 1
        except Exception as e:
            log_test("/adventure/worlds", "GET", 0, 200, None, str(e))
    
    # Test roots endpoint
    if auth_token:
        total_tests += 1
        try:
            response = requests.get(
                f"{API_BASE}/roots",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=30
            )
            if log_test("/roots", "GET", response.status_code, 200):
                success_count += 1
        except Exception as e:
            log_test("/roots", "GET", 0, 200, None, str(e))
    
    return success_count, total_tests

def run_all_tests():
    """Run all backend tests"""
    print("Pattern Coach Backend API Test Suite")
    print("=" * 50)
    print(f"Testing API: {API_BASE}")
    print(f"Test credentials: {TEST_CREDENTIALS['email']}")
    print()
    
    # Authentication first
    auth_success = test_auth_login()
    if not auth_success:
        print("\n❌ CRITICAL: Authentication failed. Cannot proceed with authenticated tests.")
        return False
    
    # User status
    test_user_status()
    
    # Stripe subscription tests
    test_stripe_subscription_plans()
    test_stripe_checkout()
    test_subscription_activate()
    
    # Push notification tests
    test_push_register()
    test_push_settings_get()
    test_push_settings_update()
    
    # Regression tests
    regression_success, regression_total = test_existing_features()
    
    # Final summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for t in test_results if t['success'])
    total = len(test_results)
    
    print(f"Total tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success rate: {(passed/total)*100:.1f}%")
    
    # Detailed results by category
    print("\nDetailed Results:")
    categories = {}
    for test in test_results:
        endpoint = test['endpoint']
        if '/subscription/' in endpoint:
            category = 'Stripe Subscription'
        elif '/push/' in endpoint:
            category = 'Push Notifications'
        elif '/auth/' in endpoint:
            category = 'Authentication'
        else:
            category = 'Core Features'
        
        if category not in categories:
            categories[category] = {'passed': 0, 'total': 0}
        
        categories[category]['total'] += 1
        if test['success']:
            categories[category]['passed'] += 1
    
    for category, stats in categories.items():
        rate = (stats['passed'] / stats['total']) * 100 if stats['total'] > 0 else 0
        print(f"  {category}: {stats['passed']}/{stats['total']} ({rate:.1f}%)")
    
    # Critical issues
    critical_failures = []
    for test in test_results:
        if not test['success'] and any(endpoint in test['endpoint'] for endpoint in ['/subscription/plans', '/subscription/checkout', '/push/register', '/push/settings']):
            critical_failures.append(test)
    
    if critical_failures:
        print(f"\n❌ CRITICAL FAILURES ({len(critical_failures)}):")
        for failure in critical_failures:
            print(f"  - {failure['method']} {failure['endpoint']}: {failure['error'] or 'HTTP ' + str(failure['status_code'])}")
    else:
        print(f"\n✅ All critical endpoints working correctly!")
    
    return len(critical_failures) == 0

if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        sys.exit(1)