// Mock data for Chickza Restaurant

export const menuItems = {
  pizza: [
    {
      id: 1,
      name: "Margherita Classic",
      description: "Fresh mozzarella, tomato sauce, basil, olive oil",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1604382354936-07c5b6b2faaa?w=400",
      category: "pizza",
      popular: true
    },
    {
      id: 2,
      name: "Pepperoni Supreme",
      description: "Double pepperoni, mozzarella, tomato sauce",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
      category: "pizza",
      popular: true
    },
    {
      id: 3,
      name: "BBQ Chicken Pizza",
      description: "Grilled chicken, BBQ sauce, red onions, cilantro",
      price: 21.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      category: "pizza",
      popular: false
    },
    {
      id: 4,
      name: "Meat Lovers",
      description: "Pepperoni, sausage, ham, bacon, ground beef",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400",
      category: "pizza",
      popular: false
    },
    {
      id: 5,
      name: "Veggie Delight",
      description: "Bell peppers, mushrooms, onions, olives, tomatoes",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      category: "pizza",
      popular: false
    }
  ],
  chicken: [
    {
      id: 6,
      name: "Original Crispy Chicken",
      description: "8 pieces of our signature crispy fried chicken",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400",
      category: "chicken",
      popular: true
    },
    {
      id: 7,
      name: "Spicy Hot Wings",
      description: "12 pieces of spicy buffalo wings with ranch dip",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400",
      category: "chicken",
      popular: true
    },
    {
      id: 8,
      name: "Honey BBQ Tenders",
      description: "6 crispy chicken tenders with honey BBQ sauce",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
      category: "chicken",
      popular: false
    },
    {
      id: 9,
      name: "Family Bucket",
      description: "16 pieces mixed chicken with 2 large sides",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
      category: "chicken",
      popular: false
    },
    {
      id: 10,
      name: "Nashville Hot Sandwich",
      description: "Crispy chicken breast with Nashville hot sauce on brioche",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400",
      category: "chicken",
      popular: false
    }
  ]
};

export const restaurantInfo = {
  name: "Chickza",
  tagline: "Where Crispy Meets Cheesy",
  address: "1234 Harbor Blvd, Anaheim, CA 92805",
  phone: "(714) 555-CHICKZA",
  email: "hello@chickza.com",
  hours: {
    weekdays: "11:00 AM - 10:00 PM",
    weekends: "11:00 AM - 11:00 PM"
  },
  about: "Born from a passion for perfect pizza and crispy chicken, Chickza has been serving Anaheim's finest comfort food since 2020. Our secret-recipe pizza dough and hand-breaded chicken have made us a local favorite. Every bite tells a story of quality ingredients, family recipes, and the love we put into our craft."
};

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Best pizza and chicken combo in Anaheim! The BBQ Chicken Pizza is absolutely divine.",
    location: "Anaheim, CA"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    rating: 5,
    text: "Been coming here for 2 years. The original crispy chicken never disappoints!",
    location: "Orange County, CA"
  },
  {
    id: 3,
    name: "Emily Chen",
    rating: 5,
    text: "Perfect for family nights. Kids love the pizza, adults love the wings!",
    location: "Anaheim, CA"
  }
];

// Mock cart functionality
export class MockCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('chickza-cart') || '[]');
  }

  addItem(item, quantity = 1) {
    const existingItem = this.items.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
    this.saveCart();
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('chickza-cart', JSON.stringify(this.items));
  }
}