# Chickza Restaurant API Contracts

## Overview
Backend implementation using .txt files as database storage for a mock restaurant website. This will replace the current mock.js functionality with actual API endpoints.

## API Contracts

### 1. Menu Items API
**GET /api/menu**
- Returns all menu items (pizza + chicken)
- Response: `{ "pizza": [...], "chicken": [...] }`

**GET /api/menu/{category}**
- Returns items by category (pizza or chicken)
- Response: `[{menu_item_object}]`

### 2. Cart/Orders API
**POST /api/orders**
- Creates a new order
- Request: `{ "items": [...], "customer_info": {...}, "order_type": "pickup|delivery" }`
- Response: `{ "order_id": "...", "status": "...", "total": ... }`

**GET /api/orders/{order_id}**
- Get order details by ID
- Response: `{order_object}`

### 3. Restaurant Info API
**GET /api/restaurant-info**
- Returns restaurant details, hours, contact info
- Response: `{restaurant_info_object}`

**POST /api/contact**
- Submit contact form
- Request: `{ "name": "...", "email": "...", "message": "..." }`
- Response: `{ "success": true, "message": "..." }`

## Data Storage Structure (.txt files)

### menu_items.txt
```json
{
  "pizza": [
    {
      "id": 1,
      "name": "Margherita Classic",
      "description": "Fresh mozzarella, tomato sauce, basil, olive oil",
      "price": 16.99,
      "image": "url",
      "category": "pizza",
      "popular": true
    }
  ],
  "chicken": [...]
}
```

### orders.txt
```json
[
  {
    "id": "order_123",
    "items": [...],
    "customer_info": {...},
    "order_type": "pickup",
    "status": "pending",
    "total": 25.99,
    "created_at": "2025-01-30T10:30:00Z"
  }
]
```

### restaurant_info.txt
```json
{
  "name": "Chickza",
  "tagline": "Where Crispy Meets Cheesy",
  "address": "1234 Harbor Blvd, Anaheim, CA 92805",
  "phone": "(714) 555-CHICKZA",
  "email": "hello@chickza.com",
  "hours": {...}
}
```

### contact_messages.txt
```json
[
  {
    "id": "msg_123",
    "name": "...",
    "email": "...",
    "message": "...",
    "created_at": "..."
  }
]
```

## Frontend Integration Plan

### Files to Update:
1. **Remove mock.js** - Replace with actual API calls
2. **Update CartContext.js** - Remove MockCart class, use API endpoints
3. **Update all pages** - Replace mock data imports with API calls
4. **Add API service** - Create `/src/services/api.js` for centralized API calls

### Mock Data Migration:
- Current mock data from `mock.js` will be moved to backend .txt files
- Frontend will fetch data from API endpoints instead of importing mock data
- Cart functionality will use backend orders API instead of localStorage
- Contact form will submit to backend instead of showing mock success

### Error Handling:
- Add loading states for API calls
- Add error handling for failed requests
- Add fallback UI for network issues

## Implementation Approach:
1. Create backend file storage system
2. Build FastAPI endpoints for all contracts
3. Populate .txt files with existing mock data
4. Update frontend to use API endpoints
5. Test full integration

This approach maintains all existing functionality while making it backend-driven using file-based storage.