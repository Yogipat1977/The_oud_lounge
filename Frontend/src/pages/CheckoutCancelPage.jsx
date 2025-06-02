// src/pages/CheckoutCancelPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// VITE_APP_BASE_URL is not directly used here as links are relative
// and handled by react-router relative to the app's deployment.
// const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL; 

const CheckoutCancelPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-lg p-8 md:p-10 text-center">
        <div>
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Cancelled</h1>
          <p className="mt-3 text-md text-gray-600">
            Your payment process was cancelled. You have not been charged.
          </p>
          <p className="mt-2 text-md text-gray-600">
            Your items are still in your cart if you'd like to try again.
          </p>
        </div>
        
        <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:flex-row-reverse sm:gap-4">
          <Link
            to="/cart" // Relative link to your cart page
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Cart
          </Link>
          <Link
            to="/" // Relative link to your homepage
            className="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If you experienced any issues, please feel free to <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">contact support</Link>.
        </p>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
