#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CMSAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) > 0:
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}")

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_admin_login(self):
        """Test admin login"""
        return self.run_test(
            "Admin Login",
            "POST", 
            "api/auth/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )

    def test_get_pages(self):
        """Test getting all pages"""
        return self.run_test("Get Pages", "GET", "api/pages", 200)

    def test_get_page_by_slug(self, slug="home"):
        """Test getting page by slug"""
        return self.run_test(f"Get Page by Slug ({slug})", "GET", f"api/pages/slug/{slug}", 200)

    def test_create_page(self):
        """Test creating a new page"""
        page_data = {
            "slug": f"test-page-{datetime.now().strftime('%H%M%S')}",
            "title": {"en": "Test Page", "hr": "Test Stranica", "de": "Test Seite"},
            "meta_description": {"en": "Test page description"},
            "sections": [],
            "published": True
        }
        return self.run_test("Create Page", "POST", "api/pages", 201, data=page_data)

    def test_update_page(self, page_id):
        """Test updating a page"""
        update_data = {
            "title": {"en": "Updated Test Page"},
            "sections": [
                {
                    "section_type": "hero",
                    "order": 0,
                    "visible": True,
                    "content": {
                        "headline": {"en": "Test Hero Section"},
                        "body": {"en": "This is a test hero section"}
                    }
                }
            ]
        }
        return self.run_test(f"Update Page ({page_id})", "PUT", f"api/pages/{page_id}", 200, data=update_data)

    def test_seed_data(self):
        """Test seeding initial data"""
        return self.run_test("Seed Pages and Menus", "POST", "api/seed/pages-menus", 200)

def main():
    print("🚀 Starting CMS API Tests...")
    print("=" * 50)
    
    tester = CMSAPITester()
    
    # Test health check first
    success, _ = tester.test_health_check()
    if not success:
        print("❌ Health check failed - backend may not be running")
        return 1

    # Test admin login
    success, _ = tester.test_admin_login()
    if not success:
        print("❌ Admin login failed")
        return 1

    # Test seed data (this will create initial pages if they don't exist)
    tester.test_seed_data()

    # Test getting pages
    success, pages_response = tester.test_get_pages()
    if success and isinstance(pages_response, list) and len(pages_response) > 0:
        print(f"   Found {len(pages_response)} pages")
        
        # Test getting a specific page by slug
        tester.test_get_page_by_slug("home")
    
    # Test creating a new page
    success, create_response = tester.test_create_page()
    if success and 'id' in create_response:
        page_id = create_response['id']
        print(f"   Created page with ID: {page_id}")
        
        # Test updating the created page
        tester.test_update_page(page_id)

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Tests completed: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())