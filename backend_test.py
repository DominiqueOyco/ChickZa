#!/usr/bin/env python3
"""
Chickza Restaurant Backend API Test Suite
Tests all backend APIs with file-based storage (.txt files)
"""

import requests
import json
import os
import sys
from pathlib import Path
from datetime import datetime
import uuid

# Configuration
BACKEND_URL = "https://62121090-d16c-4c59-a22a-da639dc13978.preview.emergentagent.com/api"
DATA_DIR = Path("/app/backend/data")

class ChickzaAPITester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_data"] = response_data
            
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        
        if not success:
            self.failed_tests.append(test_name)
    
    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.backend_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("API Root", True, "API root endpoint working", data)
                else:
                    self.log_test("API Root", False, "API root missing message field")
            else:
                self.log_test("API Root", False, f"API root returned status {response.status_code}")
        except Exception as e:
            self.log_test("API Root", False, f"API root connection failed: {str(e)}")
    
    def test_menu_all(self):
        """Test GET /api/menu - Should return all menu items"""
        try:
            response = requests.get(f"{self.backend_url}/menu")
            if response.status_code == 200:
                data = response.json()
                if "pizza" in data and "chicken" in data:
                    pizza_count = len(data["pizza"])
                    chicken_count = len(data["chicken"])
                    self.log_test("Menu - All Items", True, 
                                f"Retrieved {pizza_count} pizza items and {chicken_count} chicken items", 
                                {"pizza_count": pizza_count, "chicken_count": chicken_count})
                else:
                    self.log_test("Menu - All Items", False, "Menu response missing pizza or chicken categories")
            else:
                self.log_test("Menu - All Items", False, f"Menu API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Menu - All Items", False, f"Menu API failed: {str(e)}")
    
    def test_menu_pizza(self):
        """Test GET /api/menu/pizza - Should return only pizza items"""
        try:
            response = requests.get(f"{self.backend_url}/menu/pizza")
            if response.status_code == 200:
                data = response.json()
                if "items" in data and data.get("category") == "pizza":
                    pizza_items = data["items"]
                    # Verify all items are pizza category
                    all_pizza = all(item.get("category") == "pizza" for item in pizza_items)
                    if all_pizza:
                        self.log_test("Menu - Pizza Category", True, 
                                    f"Retrieved {len(pizza_items)} pizza items correctly", 
                                    {"item_count": len(pizza_items)})
                    else:
                        self.log_test("Menu - Pizza Category", False, "Some items are not pizza category")
                else:
                    self.log_test("Menu - Pizza Category", False, "Pizza menu response format incorrect")
            else:
                self.log_test("Menu - Pizza Category", False, f"Pizza menu API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Menu - Pizza Category", False, f"Pizza menu API failed: {str(e)}")
    
    def test_menu_chicken(self):
        """Test GET /api/menu/chicken - Should return only chicken items"""
        try:
            response = requests.get(f"{self.backend_url}/menu/chicken")
            if response.status_code == 200:
                data = response.json()
                if "items" in data and data.get("category") == "chicken":
                    chicken_items = data["items"]
                    # Verify all items are chicken category
                    all_chicken = all(item.get("category") == "chicken" for item in chicken_items)
                    if all_chicken:
                        self.log_test("Menu - Chicken Category", True, 
                                    f"Retrieved {len(chicken_items)} chicken items correctly", 
                                    {"item_count": len(chicken_items)})
                    else:
                        self.log_test("Menu - Chicken Category", False, "Some items are not chicken category")
                else:
                    self.log_test("Menu - Chicken Category", False, "Chicken menu response format incorrect")
            else:
                self.log_test("Menu - Chicken Category", False, f"Chicken menu API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Menu - Chicken Category", False, f"Chicken menu API failed: {str(e)}")
    
    def test_menu_item_by_id(self):
        """Test GET /api/menu/item/{item_id} - Should return specific menu item"""
        test_item_ids = [1, 6, 999]  # Valid pizza, valid chicken, invalid
        
        for item_id in test_item_ids:
            try:
                response = requests.get(f"{self.backend_url}/menu/item/{item_id}")
                
                if item_id == 999:  # Invalid ID test
                    if response.status_code == 404:
                        self.log_test(f"Menu - Item ID {item_id} (Invalid)", True, 
                                    "Correctly returned 404 for invalid item ID")
                    else:
                        self.log_test(f"Menu - Item ID {item_id} (Invalid)", False, 
                                    f"Should return 404 for invalid ID, got {response.status_code}")
                else:  # Valid ID test
                    if response.status_code == 200:
                        data = response.json()
                        if data.get("id") == item_id:
                            self.log_test(f"Menu - Item ID {item_id}", True, 
                                        f"Retrieved item: {data.get('name')}", 
                                        {"item_name": data.get("name"), "category": data.get("category")})
                        else:
                            self.log_test(f"Menu - Item ID {item_id}", False, 
                                        f"Item ID mismatch: expected {item_id}, got {data.get('id')}")
                    else:
                        self.log_test(f"Menu - Item ID {item_id}", False, 
                                    f"Menu item API returned status {response.status_code}")
            except Exception as e:
                self.log_test(f"Menu - Item ID {item_id}", False, f"Menu item API failed: {str(e)}")
    
    def test_restaurant_info(self):
        """Test GET /api/restaurant-info - Should return restaurant details"""
        try:
            response = requests.get(f"{self.backend_url}/restaurant-info")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["name", "address", "phone", "email", "hours"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.log_test("Restaurant Info", True, 
                                f"Retrieved restaurant info: {data.get('name')}", 
                                {"name": data.get("name"), "phone": data.get("phone")})
                else:
                    self.log_test("Restaurant Info", False, 
                                f"Missing required fields: {missing_fields}")
            else:
                self.log_test("Restaurant Info", False, 
                            f"Restaurant info API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Restaurant Info", False, f"Restaurant info API failed: {str(e)}")
    
    def test_create_order(self):
        """Test POST /api/orders - Should create a new order"""
        # Sample order data with realistic information
        order_data = {
            "items": [
                {
                    "id": 1,
                    "name": "Margherita Classic",
                    "description": "Fresh mozzarella, tomato sauce, basil, olive oil",
                    "price": 16.99,
                    "image": "https://images.unsplash.com/photo-1604382354936-07c5b6b2faaa?w=400",
                    "category": "pizza",
                    "quantity": 2
                },
                {
                    "id": 6,
                    "name": "Original Crispy Chicken",
                    "description": "8 pieces of our signature crispy fried chicken",
                    "price": 18.99,
                    "image": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400",
                    "category": "chicken",
                    "quantity": 1
                }
            ],
            "customer_info": {
                "name": "John Smith",
                "phone": "(555) 123-4567",
                "email": "john.smith@email.com",
                "address": "123 Main St, Anaheim, CA 92805"
            },
            "order_type": "delivery",
            "subtotal": 52.97,
            "tax": 4.24,
            "delivery_fee": 3.99,
            "total": 61.20
        }
        
        try:
            response = requests.post(f"{self.backend_url}/orders", json=order_data)
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data.get("status") == "pending":
                    order_id = data["id"]
                    self.log_test("Orders - Create Order", True, 
                                f"Created order with ID: {order_id}", 
                                {"order_id": order_id, "total": data.get("total")})
                    
                    # Store order ID for retrieval test
                    self.created_order_id = order_id
                    return order_id
                else:
                    self.log_test("Orders - Create Order", False, 
                                "Order response missing ID or incorrect status")
            else:
                self.log_test("Orders - Create Order", False, 
                            f"Create order API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Orders - Create Order", False, f"Create order API failed: {str(e)}")
        
        return None
    
    def test_get_order(self, order_id=None):
        """Test GET /api/orders/{order_id} - Should retrieve specific order"""
        if not order_id:
            order_id = getattr(self, 'created_order_id', None)
        
        if not order_id:
            self.log_test("Orders - Get Order", False, "No order ID available for testing")
            return
        
        try:
            response = requests.get(f"{self.backend_url}/orders/{order_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("id") == order_id:
                    self.log_test("Orders - Get Order", True, 
                                f"Retrieved order: {order_id} with total ${data.get('total')}", 
                                {"order_id": order_id, "status": data.get("status")})
                else:
                    self.log_test("Orders - Get Order", False, 
                                f"Order ID mismatch: expected {order_id}, got {data.get('id')}")
            elif response.status_code == 404:
                self.log_test("Orders - Get Order", False, 
                            f"Order {order_id} not found (404)")
            else:
                self.log_test("Orders - Get Order", False, 
                            f"Get order API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Orders - Get Order", False, f"Get order API failed: {str(e)}")
    
    def test_contact_form(self):
        """Test POST /api/contact - Should save contact message"""
        contact_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@email.com",
            "phone": "(555) 987-6543",
            "subject": "Great Experience!",
            "message": "I had an amazing experience at Chickza! The BBQ Chicken Pizza was absolutely delicious and the service was excellent. Will definitely be back!"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/contact", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "message_id" in data:
                    message_id = data["message_id"]
                    self.log_test("Contact Form", True, 
                                f"Contact message submitted with ID: {message_id}", 
                                {"message_id": message_id, "success": data.get("success")})
                else:
                    self.log_test("Contact Form", False, 
                                "Contact response missing success status or message_id")
            else:
                self.log_test("Contact Form", False, 
                            f"Contact form API returned status {response.status_code}")
        except Exception as e:
            self.log_test("Contact Form", False, f"Contact form API failed: {str(e)}")
    
    def test_file_storage_verification(self):
        """Verify that data is being written to .txt files"""
        files_to_check = [
            ("menu_items.txt", "Menu items"),
            ("restaurant_info.txt", "Restaurant info"),
            ("orders.txt", "Orders"),
            ("contact_messages.txt", "Contact messages")
        ]
        
        for filename, description in files_to_check:
            file_path = DATA_DIR / filename
            try:
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        if content:
                            try:
                                data = json.loads(content)
                                if filename == "orders.txt" and isinstance(data, list):
                                    self.log_test(f"File Storage - {description}", True, 
                                                f"File exists and contains {len(data)} records")
                                elif filename == "contact_messages.txt" and isinstance(data, list):
                                    self.log_test(f"File Storage - {description}", True, 
                                                f"File exists and contains {len(data)} messages")
                                elif filename in ["menu_items.txt", "restaurant_info.txt"]:
                                    self.log_test(f"File Storage - {description}", True, 
                                                "File exists and contains valid JSON data")
                                else:
                                    self.log_test(f"File Storage - {description}", True, 
                                                "File exists and contains data")
                            except json.JSONDecodeError:
                                self.log_test(f"File Storage - {description}", False, 
                                            "File exists but contains invalid JSON")
                        else:
                            self.log_test(f"File Storage - {description}", False, 
                                        "File exists but is empty")
                else:
                    self.log_test(f"File Storage - {description}", False, 
                                "File does not exist")
            except Exception as e:
                self.log_test(f"File Storage - {description}", False, 
                            f"Error checking file: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid endpoints and data"""
        
        # Test invalid endpoint
        try:
            response = requests.get(f"{self.backend_url}/invalid-endpoint")
            if response.status_code == 404:
                self.log_test("Error Handling - Invalid Endpoint", True, 
                            "Correctly returned 404 for invalid endpoint")
            else:
                self.log_test("Error Handling - Invalid Endpoint", False, 
                            f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Endpoint", False, 
                        f"Invalid endpoint test failed: {str(e)}")
        
        # Test invalid menu category
        try:
            response = requests.get(f"{self.backend_url}/menu/invalid-category")
            if response.status_code == 400:
                self.log_test("Error Handling - Invalid Category", True, 
                            "Correctly returned 400 for invalid menu category")
            else:
                self.log_test("Error Handling - Invalid Category", False, 
                            f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Category", False, 
                        f"Invalid category test failed: {str(e)}")
        
        # Test malformed order data
        try:
            malformed_order = {"invalid": "data"}
            response = requests.post(f"{self.backend_url}/orders", json=malformed_order)
            if response.status_code in [400, 422]:  # 422 is FastAPI validation error
                self.log_test("Error Handling - Malformed Order", True, 
                            f"Correctly returned {response.status_code} for malformed order data")
            else:
                self.log_test("Error Handling - Malformed Order", False, 
                            f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Malformed Order", False, 
                        f"Malformed order test failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 80)
        print("CHICKZA RESTAURANT BACKEND API TEST SUITE")
        print("=" * 80)
        print(f"Backend URL: {self.backend_url}")
        print(f"Data Directory: {DATA_DIR}")
        print("=" * 80)
        
        # Test sequence
        self.test_api_root()
        print()
        
        print("MENU API TESTS:")
        print("-" * 40)
        self.test_menu_all()
        self.test_menu_pizza()
        self.test_menu_chicken()
        self.test_menu_item_by_id()
        print()
        
        print("RESTAURANT INFO API TESTS:")
        print("-" * 40)
        self.test_restaurant_info()
        print()
        
        print("ORDERS API TESTS:")
        print("-" * 40)
        order_id = self.test_create_order()
        self.test_get_order(order_id)
        print()
        
        print("CONTACT API TESTS:")
        print("-" * 40)
        self.test_contact_form()
        print()
        
        print("FILE STORAGE VERIFICATION:")
        print("-" * 40)
        self.test_file_storage_verification()
        print()
        
        print("ERROR HANDLING TESTS:")
        print("-" * 40)
        self.test_error_handling()
        print()
        
        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t["success"]])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\nFAILED TESTS:")
            for test_name in self.failed_tests:
                print(f"  ❌ {test_name}")
        
        print("\nDETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"  {status} {result['test']}: {result['message']}")
        
        return passed_tests, failed_tests, total_tests

if __name__ == "__main__":
    tester = ChickzaAPITester()
    passed, failed, total = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)