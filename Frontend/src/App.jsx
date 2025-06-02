// App.jsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Product from "./pages/Products"; // This is your PerfumeProducts page
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart"; // This is your CartPage
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile"; // lowercase 'p' to match 'profile.jsx'

// Import the new pages
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'; // Adjust path if needed
import CheckoutCancelPage from './pages/CheckoutCancelPage';   // Adjust path if needed

function App() {
  return (
 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/product" element={<Product />} /> 
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/cart" element={<Cart />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
      <Route path="/checkout-cancel" element={<CheckoutCancelPage />} />
    </Routes>
  );
}

export default App;