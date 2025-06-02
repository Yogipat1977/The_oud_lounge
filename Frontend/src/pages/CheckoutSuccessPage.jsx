// src/pages/CheckoutSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios

// Use Vite's import.meta.env for environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || ''; // Fallback to empty string if not set, though it should be.

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("VITE_API_BASE_URL is not defined. Please check your .env file.");
      setError("Configuration error: API endpoint not set.");
      setLoading(false);
      return;
    }

    if (sessionId) {
      const fetchOrderDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/orders/by-session/${sessionId}`);
          setOrder(response.data);
          setError('');
        } catch (err) {
          console.error("Error fetching order details:", err);
          if (err.response && err.response.status === 404) {
            setError(err.response.data.message || 'Order details are being processed. You will receive a confirmation email shortly.');
          } else {
            setError('Failed to load order details. Please check your email for confirmation.');
          }
          setOrder(null);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    } else {
      setError('No session ID found. Payment status unclear.');
      setLoading(false);
    }
  }, [sessionId]);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return `${APP_BASE_URL}/Images/placeholder.png`; // A default placeholder, ensure it exists in your public/Images
    if (imagePath.startsWith('http')) return imagePath; // Already an absolute URL
    // Construct full URL using APP_BASE_URL for relative paths
    return `${APP_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        <p className="mt-4 text-lg text-gray-700">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {order ? (
          <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Thank You For Your Order!</h1>
              <p className="mt-2 text-md text-gray-600">
                Your payment was successful and your order is confirmed.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Order ID: <span className="font-semibold">{order._id}</span>
              </p>
              {order.guestEmail && (
                 <p className="mt-1 text-sm text-gray-500">
                   A confirmation email has been sent to <span className="font-semibold">{order.guestEmail}</span>.
                 </p>
              )}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {order.orderItems && order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <img 
                        src={getFullImageUrl(item.image)} 
                        alt={item.name} 
                        className="h-16 w-16 object-cover rounded mr-4 border"
                        onError={(e) => { e.target.onerror = null; e.target.src=`${APP_BASE_URL}/Images/placeholder_error.png`}} // Fallback for broken images
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-md font-semibold text-gray-800">
                      {item.price === 0 ? 'Free' : `£${(item.price * item.quantity).toFixed(2)}`}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6 space-y-2">
                {order.subtotalBeforeDiscount > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>£{Number(order.subtotalBeforeDiscount).toFixed(2)}</span>
                    </div>
                )}
                {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                    <span>Discount Applied:</span>
                    <span>- £{Number(order.discountAmount).toFixed(2)}</span>
                    </div>
                )}
                {order.shippingPrice > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery:</span>
                    <span>£{Number(order.shippingPrice).toFixed(2)}</span>
                    </div>
                )}
                 {order.taxPrice > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax:</span>
                    <span>£{Number(order.taxPrice).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Paid:</span>
                  <span>£{Number(order.totalPrice).toFixed(2)}</span>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/" // Link to homepage (relative to APP_BASE_URL)
                className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 text-center">
             <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Payment Successful!</h1>
            <p className="mt-2 text-md text-gray-600">
              {error || "We've received your payment. Your order details are being finalized and you will receive a confirmation email shortly."}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              If you have any questions, please contact our support team.
            </p>
            <div className="mt-8">
              <Link
                to="/" // Link to homepage (relative to APP_BASE_URL)
                className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;