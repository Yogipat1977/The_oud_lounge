// CartContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage if available (optional, but good for persistence)
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('perfumeCartItems');
      try {
        return localData ? JSON.parse(localData) : [];
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('perfumeCartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item already exists, update its quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item is new, add it to the cart
        // Ensure all necessary product details are included for the cart page
        return [...prevItems, { ...product, quantity }];
      }
    });
    console.log(`Product added/updated in cart (Context): ${product.name}, Quantity: ${quantity}`);
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    console.log(`Product removed from cart (Context): ID ${productId}`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeItem(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log(`Product quantity updated (Context): ID ${productId}, New Quantity: ${newQuantity}`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    console.log("Cart cleared (Context)");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};