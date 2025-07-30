import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

class FileStorage:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(__file__).parent / data_dir
        self.data_dir.mkdir(exist_ok=True)
        
    def _get_file_path(self, filename: str) -> Path:
        return self.data_dir / filename
    
    def read_json_file(self, filename: str) -> Any:
        """Read and parse JSON from a file"""
        file_path = self._get_file_path(filename)
        try:
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def write_json_file(self, filename: str, data: Any) -> bool:
        """Write data as JSON to a file"""
        file_path = self._get_file_path(filename)
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error writing to {filename}: {e}")
            return False
    
    def append_to_json_array(self, filename: str, new_item: Dict) -> bool:
        """Append a new item to a JSON array file"""
        current_data = self.read_json_file(filename)
        if not isinstance(current_data, list):
            current_data = []
        current_data.append(new_item)
        return self.write_json_file(filename, current_data)

# Storage instance
storage = FileStorage()

class MenuService:
    @staticmethod
    def get_all_menu_items() -> Dict[str, List[Dict]]:
        """Get all menu items"""
        return storage.read_json_file("menu_items.txt")
    
    @staticmethod
    def get_menu_by_category(category: str) -> List[Dict]:
        """Get menu items by category"""
        menu_data = storage.read_json_file("menu_items.txt")
        if isinstance(menu_data, dict) and category in menu_data:
            return menu_data[category]
        return []
    
    @staticmethod
    def get_item_by_id(item_id: int) -> Optional[Dict]:
        """Get a specific menu item by ID"""
        menu_data = storage.read_json_file("menu_items.txt")
        if isinstance(menu_data, dict):
            for category_items in menu_data.values():
                for item in category_items:
                    if item.get('id') == item_id:
                        return item
        return None

class OrderService:
    @staticmethod
    def create_order(order_data: Dict) -> Dict:
        """Create a new order"""
        order_id = f"order_{uuid.uuid4().hex[:8]}"
        new_order = {
            "id": order_id,
            "items": order_data.get("items", []),
            "customer_info": order_data.get("customer_info", {}),
            "order_type": order_data.get("order_type", "pickup"),
            "status": "pending",
            "subtotal": order_data.get("subtotal", 0),
            "tax": order_data.get("tax", 0),
            "delivery_fee": order_data.get("delivery_fee", 0),
            "total": order_data.get("total", 0),
            "created_at": datetime.utcnow().isoformat()
        }
        
        if storage.append_to_json_array("orders.txt", new_order):
            return new_order
        return {}
    
    @staticmethod
    def get_order_by_id(order_id: str) -> Optional[Dict]:
        """Get order by ID"""
        orders = storage.read_json_file("orders.txt")
        for order in orders:
            if order.get("id") == order_id:
                return order
        return None
    
    @staticmethod
    def get_all_orders() -> List[Dict]:
        """Get all orders"""
        return storage.read_json_file("orders.txt")

class RestaurantService:
    @staticmethod
    def get_restaurant_info() -> Dict:
        """Get restaurant information"""
        return storage.read_json_file("restaurant_info.txt")

class ContactService:
    @staticmethod
    def submit_contact_message(message_data: Dict) -> Dict:
        """Submit a contact message"""
        message_id = f"msg_{uuid.uuid4().hex[:8]}"
        new_message = {
            "id": message_id,
            "name": message_data.get("name", ""),
            "email": message_data.get("email", ""),
            "phone": message_data.get("phone", ""),
            "subject": message_data.get("subject", ""),
            "message": message_data.get("message", ""),
            "created_at": datetime.utcnow().isoformat()
        }
        
        if storage.append_to_json_array("contact_messages.txt", new_message):
            return {
                "success": True,
                "message": "Thank you for contacting us! We'll get back to you within 24 hours.",
                "message_id": message_id
            }
        return {
            "success": False,
            "message": "Failed to submit message. Please try again."
        }
    
    @staticmethod
    def get_all_messages() -> List[Dict]:
        """Get all contact messages (for admin purposes)"""
        return storage.read_json_file("contact_messages.txt")