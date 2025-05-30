// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Your main App component
import { BrowserRouter } from 'react-router-dom';
// Assuming CartContext.js is in src/pages/CartContext.js
// The path '/src/pages/CartContext' might need adjustment based on your exact structure.
// If main.jsx is in 'src', then it should be './pages/CartContext'
import { CartProvider } from './pages/CartContext'; // Corrected to a relative path assuming main.jsx is in src/
import './index.css'; // Your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Moved basename here */}
      <CartProvider> {/* CartProvider wraps your App, providing one context */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);