// CartContext.js
"use client";

import React, { createContext, useContext, useState } from 'react'; // Removed useEffect

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cartItems as an empty array.
  // It will not load from localStorage anymore.
  const [cartItems, setCartItems] = useState([]);

  // The useEffect hook for saving to localStorage has been removed.

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
        // Ensure all necessary product details are included
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
    return cartItems.reduce((total, item) => {
        // Ensure item.price and item.quantity are valid numbers
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => {
        const quantity = Number(item.quantity) || 0;
        return count + quantity;
    }, 0);
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