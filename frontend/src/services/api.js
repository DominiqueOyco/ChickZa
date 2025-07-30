import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const menuAPI = {
  // Get all menu items
  getAllMenu: async () => {
    const response = await api.get('/menu');
    return response.data;
  },

  // Get menu items by category
  getMenuByCategory: async (category) => {
    const response = await api.get(`/menu/${category}`);
    return response.data;
  },

  // Get single menu item
  getMenuItem: async (itemId) => {
    const response = await api.get(`/menu/item/${itemId}`);
    return response.data;
  },
};

export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
};

export const restaurantAPI = {
  // Get restaurant info
  getRestaurantInfo: async () => {
    const response = await api.get('/restaurant-info');
    return response.data;
  },
};

export const contactAPI = {
  // Submit contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact messages (admin)
  getAllMessages: async () => {
    const response = await api.get('/contact/messages');
    return response.data;
  },
};

export default api;