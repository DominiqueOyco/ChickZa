# 🍕🍗 Chickza Restaurant Website

**Where Crispy Meets Cheesy** - A modern restaurant website for pizza and fried chicken lovers!

## 🌐 **Live Demo**

The application is currently running and accessible at:
**Frontend URL:** [Open Chickza Website](https://62121090-d16c-4c59-a22a-da639dc13978.preview.emergentagent.com)

## 📋 **What is Chickza?**

Chickza is a full-stack restaurant website featuring:
- **Modern Design** with red, yellow, and white color scheme
- **Interactive Menu** with pizza and fried chicken specialties
- **Working Cart System** with real-time updates
- **Order Management** with pickup and delivery options
- **Contact System** for customer inquiries
- **File-based Database** using .txt files for demo purposes

## 🚀 **How to Use the Website**

### **1. Browse the Menu**
- Click **"View Our Menu"** from the home page
- Use tabs to filter between **All Items**, **Pizza**, or **Fried Chicken**
- View detailed descriptions and prices for each item

### **2. Add Items to Cart**
- Select quantity using **+/-** buttons
- Click **"Add to Cart"** on any menu item
- See cart badge update in the top navigation

### **3. Place an Order**
- Click the **shopping cart icon** in the navigation
- Review your items and adjust quantities if needed
- Choose **Pickup** or **Delivery**
- Fill in your contact information
- Click **"Place Order"** to complete

### **4. Explore Other Pages**
- **About**: Learn about Chickza's story and values
- **Contact**: Send messages or view location/hours
- **Home**: See popular items and customer testimonials

## 🛠 **Technical Information**

### **Tech Stack**
- **Frontend**: React.js with modern UI components
- **Backend**: FastAPI (Python)
- **Database**: File-based storage (.txt files)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

### **Architecture**
```
/app/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # Main pages (Home, Menu, Cart, etc.)
│   │   ├── components/# Reusable UI components
│   │   ├── services/  # API communication
│   │   └── contexts/  # React contexts (Cart management)
├── backend/           # FastAPI server
│   ├── data/          # .txt file database
│   ├── server.py      # Main API server
│   └── file_storage.py# File storage utilities
```

## 🔧 **For Developers: Local Setup**

If you want to run this locally, you'll need:

### **Prerequisites**
- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **Python** (v3.8+): [Download here](https://python.org/)
- **Yarn**: [Installation guide](https://yarnpkg.com/getting-started/install)

### **Installation Steps**

1. **Clone or Download the Project**
   ```bash
   # If you have the project files
   cd /path/to/chickza-project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   ```

4. **Environment Variables**
   - Create `.env` files in both frontend and backend directories
   - Frontend `.env`:
     ```
     REACT_APP_BACKEND_URL=http://localhost:8001
     ```

5. **Start the Applications**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload

   # Terminal 2 - Frontend  
   cd frontend
   yarn start
   ```

6. **Open in Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001

## 📊 **Features Overview**

### **🏠 Home Page**
- Hero section with restaurant branding
- Customer favorite items showcase
- Service highlights and testimonials
- Call-to-action buttons

### **🍽 Menu Page**
- Tabbed interface (All Items, Pizza, Chicken)
- Item cards with images and descriptions
- Quantity selectors and add-to-cart functionality
- Popular item badges

### **🛒 Cart & Ordering**
- Real-time cart updates
- Quantity management
- Order summary with tax calculation
- Customer information form
- Pickup/Delivery options

### **📍 About & Contact**
- Restaurant story and values
- Location and hours information
- Contact form with backend integration
- Business statistics and highlights

## 🗃 **Database Structure**

The application uses simple .txt files as database:

- **`menu_items.txt`** - Pizza and chicken menu items
- **`restaurant_info.txt`** - Restaurant details and testimonials
- **`orders.txt`** - Customer orders
- **`contact_messages.txt`** - Contact form submissions

## 🔗 **API Endpoints**

The backend exposes these REST API endpoints:

- `GET /api/menu` - All menu items
- `GET /api/menu/{category}` - Items by category
- `POST /api/orders` - Create new order
- `GET /api/restaurant-info` - Restaurant information
- `POST /api/contact` - Submit contact message

## 📱 **Mobile Responsive**

The website is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

## 🎨 **Design Features**

- **Modern Color Scheme**: Red, yellow, and white
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Clean, readable fonts
- **Intuitive Navigation**: Easy-to-use menu structure
- **Visual Hierarchy**: Clear content organization

## 🚧 **Demo Limitations**

This is a demonstration application with:
- **File-based storage** (not production database)
- **No real payment processing**
- **Mock order fulfillment**
- **Local development environment**

## 📞 **Support**

For questions about this demo application:
- Check the contact form on the website
- Review the source code in the project files
- Visit the live demo link above

---

**Made with ❤️ for restaurant owners who want a modern web presence!**

## 📄 **License**

This project is created as a demonstration and is available for educational purposes.
