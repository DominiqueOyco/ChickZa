import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockCart } from '../mock';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(new MockCart());
  const [cartItems, setCartItems] = useState([]);

  const refreshCart = () => {
    setCartItems([...cart.items]);
  };

  useEffect(() => {
    refreshCart();
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    cart.addItem(item, quantity);
    refreshCart();
  };

  const removeFromCart = (itemId) => {
    cart.removeItem(itemId);
    refreshCart();
  };

  const updateQuantity = (itemId, quantity) => {
    cart.updateQuantity(itemId, quantity);
    refreshCart();
  };

  const clearCart = () => {
    cart.clear();
    refreshCart();
  };

  const getTotal = () => cart.getTotal();
  const getItemCount = () => cart.getItemCount();

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};