#!/usr/bin/env python3
"""
FOMO Connections Module Backend Testing
Tests all required endpoints for the multi-service architecture
"""

import requests
import sys
import json
from datetime import datetime

class FOMOConnectionsTester:
    def __init__(self):
        # Use the public backend URL from frontend .env
        self.backend_url = "https://twscrape-tool.preview.emergentagent.com"
        self.node_backend_url = "http://localhost:8003"  # Direct Node.js backend
        self.twitter_parser_url = "http://localhost:5001"  # Twitter Parser V2
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, success, details="", expected="", actual=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            print(f"❌ {test_name}")
            if details:
                print(f"   Details: {details}")
            if expected and actual:
                print(f"   Expected: {expected}")
                print(f"   Actual: {actual}")
        
        self.results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "expected": expected,
            "actual": actual
        })

    def test_backend_health(self):
        """Test Python FastAPI proxy health check"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # Check for required fields
                if data.get("service") == "python-gateway" and data.get("status") == "ok":
                    if data.get("node_backend") == "connected":
                        self.log_result("Backend Health Check", True, f"Status: {data}")
                        return True
                    else:
                        self.log_result("Backend Health Check", False, 
                                      f"Node backend not connected: {data.get('node_backend')}", 
                                      "connected", data.get('node_backend'))
                        return False
                else:
                    self.log_result("Backend Health Check", False, 
                                  f"Invalid response structure: {data}")
                    return False
            else:
                self.log_result("Backend Health Check", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Backend Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_node_backend_health(self):
        """Test Node.js Fastify backend health"""
        try:
            response = requests.get(f"{self.node_backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    self.log_result("Node.js Backend Health", True, f"Response: {data}")
                    return True
                else:
                    self.log_result("Node.js Backend Health", False, 
                                  f"ok != true: {data}")
                    return False
            else:
                self.log_result("Node.js Backend Health", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Node.js Backend Health", False, f"Connection error: {str(e)}")
            return False

    def test_twitter_parser_health(self):
        """Test Twitter Parser V2 health"""
        try:
            response = requests.get(f"{self.twitter_parser_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if (data.get("ok") == True and 
                    data.get("status") == "running" and 
                    data.get("version") == "2.0-MULTI"):
                    self.log_result("Twitter Parser Health", True, f"Response: {data}")
                    return True
                else:
                    self.log_result("Twitter Parser Health", False, 
                                  f"Invalid response: {data}", 
                                  "ok=true, status=running, version=2.0-MULTI", str(data))
                    return False
            else:
                self.log_result("Twitter Parser Health", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Twitter Parser Health", False, f"Connection error: {str(e)}")
            return False

    def test_connections_unified_api(self):
        """Test Connections Unified API - should return 10 accounts with REAL_TWITTER facet"""
        try:
            response = requests.get(
                f"{self.backend_url}/api/connections/unified?facet=REAL_TWITTER&limit=10", 
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    accounts = data.get("data", [])
                    count = len(accounts)
                    
                    if count >= 10:
                        self.log_result("Connections Unified API", True, 
                                      f"Retrieved {count} accounts")
                        return True
                    else:
                        self.log_result("Connections Unified API", False, 
                                      f"Expected at least 10 accounts, got {count}")
                        return False
                else:
                    self.log_result("Connections Unified API", False, 
                                  f"API returned ok=false: {data}")
                    return False
            else:
                self.log_result("Connections Unified API", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Connections Unified API", False, f"Request error: {str(e)}")
            return False

    def test_connections_health_api(self):
        """Test Connections module health endpoint"""
        try:
            response = requests.get(f"{self.backend_url}/api/connections/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True and data.get("module") == "connections":
                    self.log_result("Connections Module Health", True, f"Response: {data}")
                    return True
                else:
                    self.log_result("Connections Module Health", False, 
                                  f"Invalid response: {data}")
                    return False
            else:
                self.log_result("Connections Module Health", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Connections Module Health", False, f"Request error: {str(e)}")
            return False

    def test_mongodb_connection(self):
        """Test MongoDB connection via connections stats"""
        try:
            response = requests.get(f"{self.backend_url}/api/connections/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok") == True:
                    stats = data.get("data", {})
                    total_profiles = stats.get("total_profiles", 0)
                    storage = stats.get("storage")
                    
                    if storage == "mongodb" and total_profiles >= 0:
                        self.log_result("MongoDB Connection", True, 
                                      f"Connected, {total_profiles} profiles in DB")
                        return True
                    else:
                        self.log_result("MongoDB Connection", False, 
                                      f"Invalid stats: {stats}")
                        return False
                else:
                    self.log_result("MongoDB Connection", False, 
                                  f"Stats API failed: {data}")
                    return False
            else:
                self.log_result("MongoDB Connection", False, 
                              f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("MongoDB Connection", False, f"Request error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🔍 FOMO Connections Module Backend Testing")
        print("=" * 50)
        
        # Test in order of dependency
        print("\n1. Testing Python FastAPI Proxy...")
        backend_ok = self.test_backend_health()
        
        print("\n2. Testing Node.js Fastify Backend...")
        node_ok = self.test_node_backend_health()
        
        print("\n3. Testing Twitter Parser V2...")
        parser_ok = self.test_twitter_parser_health()
        
        print("\n4. Testing MongoDB Connection...")
        mongo_ok = self.test_mongodb_connection()
        
        print("\n5. Testing Connections Module...")
        connections_ok = self.test_connections_health_api()
        
        print("\n6. Testing Connections Unified API...")
        unified_ok = self.test_connections_unified_api()
        
        # Summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            
            # Show critical failures
            critical_services = [
                ("Backend Health Check", backend_ok),
                ("Node.js Backend Health", node_ok), 
                ("Twitter Parser Health", parser_ok),
                ("MongoDB Connection", mongo_ok)
            ]
            
            failed_critical = [name for name, ok in critical_services if not ok]
            if failed_critical:
                print(f"\n🚨 Critical service failures: {', '.join(failed_critical)}")
                return 2  # Critical failure
            else:
                return 1  # Non-critical failure

def main():
    tester = FOMOConnectionsTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())