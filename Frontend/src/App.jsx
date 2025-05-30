// App.jsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
// No need to import CartProvider here anymore, it's provided by main.jsx
// No need to import BrowserRouter here anymore
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Product from "./pages/Products"; // This is your PerfumeProducts page
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart"; // This is your CartPage
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile"; // lowercase 'p' to match 'profile.jsx'

function App() {
  return (
    // No BrowserRouter here
    // No CartProvider here
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/product" element={<Product />} /> {/* This renders your PerfumeProducts component */}
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/cart" element={<Cart />} /> {/* This renders your CartPage component */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      
    </Routes>
  );
}

export default App;