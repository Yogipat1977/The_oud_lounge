"use client"

import { useState } from "react"
import Header from "../components/header"
import Footer from "../components/Footer"
// If you are using Next.js and want to redirect programmatically after login:
// import { useRouter } from 'next/navigation'; // For Next.js 13+ App Router
// import { useRouter } from 'next/router'; // For Next.js Pages Router

// Define your API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("") // To display errors from the server

  // For Next.js router:
  // const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (serverError) {
        setServerError("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({}) // Clear previous client-side errors
    setServerError("") // Clear previous server-side errors

    // Basic client-side validation
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend (e.g., invalid credentials, user not found)
        setServerError(data.message || `Login failed. Status: ${response.status}`);
        setIsLoading(false);
        return;
      }

      // Login successful
      console.log("Login successful:", data);
      localStorage.setItem('authToken', data.token); // Store the token
      localStorage.setItem('userInfo', JSON.stringify(data.user)); // Store user info

      // Redirect to dashboard or home page
      alert("Login successful!"); // Simple feedback

      // For Next.js App Router:
      // router.push('/The_oud_lounge/profile'); // Or '/The_oud_lounge/'
      // For Next.js Pages Router:
      // router.push('/The_oud_lounge/profile');
      // For plain React or other setups:
      window.location.href = '/profile'; // Or a profile page

    } catch (error) {
      console.error("Login API call error:", error);
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center animate-fade-in">
            {/* ... (icon and title) ... */}
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce-slow">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Display Server Error */}
              {serverError && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {serverError}
                </div>
              )}
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-yellow-400"
                    }`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600 animate-shake">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                      errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-yellow-400"
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600 animate-shake">{errors.password}</p>}
                </div>
              </div>

              {/* ... (remember me and forgot password) ... */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#" // Replace with your forgot password link
                    className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>


              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* ... (link to register page) ... */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                  >
                    Create one now
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* ... (styles) ... */}
      <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes bounce-slow {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out 0.2s both;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                .form-group input:focus {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            `}</style>
    </>
  )
}