from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
from file_storage import MenuService, OrderService, RestaurantService, ContactService


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Chickza Restaurant API", description="API for Chickza Restaurant")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class MenuItem(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str
    category: str
    popular: bool

class MenuResponse(BaseModel):
    pizza: List[MenuItem]
    chicken: List[MenuItem]

class OrderItem(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str
    category: str
    quantity: int

class CustomerInfo(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    address: Optional[str] = ""

class OrderRequest(BaseModel):
    items: List[OrderItem]
    customer_info: CustomerInfo
    order_type: str = "pickup"
    subtotal: float
    tax: float
    delivery_fee: float = 0
    total: float

class OrderResponse(BaseModel):
    id: str
    items: List[OrderItem]
    customer_info: CustomerInfo
    order_type: str
    status: str
    subtotal: float
    tax: float
    delivery_fee: float
    total: float
    created_at: str

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str
    message_id: Optional[str] = None

# Menu Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Chickza Restaurant API"}

@api_router.get("/menu", response_model=MenuResponse)
async def get_menu():
    """Get all menu items"""
    try:
        menu_data = MenuService.get_all_menu_items()
        return MenuResponse(**menu_data)
    except Exception as e:
        logger.error(f"Error getting menu: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve menu")

@api_router.get("/menu/{category}")
async def get_menu_by_category(category: str):
    """Get menu items by category (pizza or chicken)"""
    try:
        if category not in ["pizza", "chicken"]:
            raise HTTPException(status_code=400, detail="Category must be 'pizza' or 'chicken'")
        
        items = MenuService.get_menu_by_category(category)
        return {"category": category, "items": items}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting menu by category {category}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve menu items")

@api_router.get("/menu/item/{item_id}")
async def get_menu_item(item_id: int):
    """Get a specific menu item by ID"""
    try:
        item = MenuService.get_item_by_id(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Menu item not found")
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting menu item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve menu item")

# Order Routes
@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order_request: OrderRequest):
    """Create a new order"""
    try:
        order_data = order_request.dict()
        new_order = OrderService.create_order(order_data)
        
        if not new_order:
            raise HTTPException(status_code=500, detail="Failed to create order")
        
        return OrderResponse(**new_order)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create order")

@api_router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get order by ID"""
    try:
        order = OrderService.get_order_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return OrderResponse(**order)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve order")

@api_router.get("/orders")
async def get_all_orders():
    """Get all orders (for admin purposes)"""
    try:
        orders = OrderService.get_all_orders()
        return {"orders": orders}
    except Exception as e:
        logger.error(f"Error getting all orders: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve orders")

# Restaurant Info Routes
@api_router.get("/restaurant-info")
async def get_restaurant_info():
    """Get restaurant information"""
    try:
        info = RestaurantService.get_restaurant_info()
        return info
    except Exception as e:
        logger.error(f"Error getting restaurant info: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve restaurant information")

# Contact Routes
@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(contact_request: ContactRequest):
    """Submit contact form"""
    try:
        result = ContactService.submit_contact_message(contact_request.dict())
        return ContactResponse(**result)
    except Exception as e:
        logger.error(f"Error submitting contact message: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact message")

@api_router.get("/contact/messages")
async def get_contact_messages():
    """Get all contact messages (for admin purposes)"""
    try:
        messages = ContactService.get_all_messages()
        return {"messages": messages}
    except Exception as e:
        logger.error(f"Error getting contact messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve contact messages")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Chickza Restaurant API started with file-based storage")
