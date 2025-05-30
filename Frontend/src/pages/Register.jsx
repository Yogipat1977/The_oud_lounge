"use client"

import { useState } from "react"
import Header from "../components/header"
import Footer from "../components/Footer"
// If you are using Next.js and want to redirect programmatically after registration:
// import { useRouter } from 'next/navigation'; // For Next.js 13+ App Router
// import { useRouter } from 'next/router'; // For Next.js Pages Router

// Define your API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "", // Frontend uses 'phone'
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("") // To display errors from the server
  const [currentStep, setCurrentStep] = useState(1)

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

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
        newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Basic email format check
        newErrors.email = "Email is invalid"
    }
    if (!formData.password) {
        newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    return newErrors
  }

  const validateStep2 = () => {
    // Add validation for step 2 if any fields become mandatory
    // For now, they are optional as per your UI
    const newErrors = {};
    // Example: if phone became mandatory
    // if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    return newErrors;
  }

  const handleNext = () => {
    setServerError(""); // Clear server error when moving steps
    const step1Errors = validateStep1()
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors)
      return
    }
    setErrors({}); // Clear errors before going to next step
    setCurrentStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setServerError("")

    // Validate current step's fields before submitting
    let currentErrors = {};
    if (currentStep === 1) {
        currentErrors = validateStep1();
    } else { // currentStep === 2
        // First, ensure step 1 was valid
        currentErrors = validateStep1();
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            setCurrentStep(1); // Send user back to step 1
            setIsLoading(false);
            return;
        }
        // Then, validate step 2 (if any validations exist)
        const step2Errors = validateStep2();
        if (Object.keys(step2Errors).length > 0) {
            setErrors(step2Errors);
            setIsLoading(false);
            return;
        }
    }

    if (Object.keys(currentErrors).length > 0) {
        setErrors(currentErrors);
        setIsLoading(false);
        return;
    }

    // Prepare payload for the backend
    // Backend expects: name, email, password, phoneNumber, address object
    const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone, // Backend expects 'phoneNumber'
        address: { // Backend expects an 'address' object
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
        },
        // role is not sent from frontend, defaults to 'user' on backend
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle errors from the backend (e.g., user already exists, validation errors)
            setServerError(data.message || `Registration failed. Status: ${response.status}`);
            setIsLoading(false);
            return;
        }

        // Registration successful
        console.log("Registration successful:", data);
        localStorage.setItem('authToken', data.token); // Store the token
        localStorage.setItem('userInfo', JSON.stringify(data.user)); // Store user info

        alert("Registration successful! You are now logged in."); // Simple feedback

        // For Next.js App Router:
        // router.push('/The_oud_lounge/profile'); // Or '/The_oud_lounge/'
        // For Next.js Pages Router:
        // router.push('/The_oud_lounge/profile');
        // For plain React or other setups:
        window.location.href = '/'; // Or a profile page

    } catch (error) {
        console.error("Registration API call error:", error);
        setServerError("An unexpected error occurred. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          {/* ... (icon and title) ... */}
          <div className="text-center animate-fade-in">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce-slow">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us today and get started</p>
          </div>


          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm animate-slide-up">
            {/* ... (progress bar JSX) ... */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 2</span>
              <span className="text-sm text-gray-500">{currentStep === 1 ? "Basic Info" : "Additional Details"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <form onSubmit={handleSubmit}>
              {/* Display Server Error */}
              {serverError && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {serverError}
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  {/* ... (Step 1 form fields - make sure name attributes match formData keys) ... */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                        errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-yellow-400"
                      }`}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600 animate-shake">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
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
                        placeholder="Create password (min 6 chars)"
                        autoComplete="new-password"
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-600 animate-shake">{errors.password}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                          errors.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 hover:border-yellow-400"
                        }`}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 animate-shake">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Next Step
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  {/* ... (Step 2 form fields - make sure name attributes match formData keys) ... */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setServerError(""); // Clear server error when going back
                        setErrors({}); // Clear client errors
                        setCurrentStep(1);
                      }}
                      className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors duration-200"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone" // Matches formData key
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                        errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-yellow-400"
                      }`}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                     {errors.phone && <p className="mt-1 text-sm text-red-600 animate-shake">{errors.phone}</p>}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-800">Address (Optional)</h4>

                    <div className="form-group">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        id="street"
                        name="street" // Matches formData key
                        type="text"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-400 transition-all duration-300"
                        placeholder="Enter street address"
                        autoComplete="street-address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          id="city"
                          name="city" // Matches formData key
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-400 transition-all duration-300"
                          placeholder="Enter city"
                          autoComplete="address-level2"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State / Province
                        </label>
                        <input
                          id="state"
                          name="state" // Matches formData key
                          type="text"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-400 transition-all duration-300"
                          placeholder="Enter state or province"
                          autoComplete="address-level1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          id="postalCode"
                          name="postalCode" // Matches formData key
                          type="text"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-400 transition-all duration-300"
                          placeholder="Enter postal code"
                          autoComplete="postal-code"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          id="country"
                          name="country" // Matches formData key
                          type="text"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-400 transition-all duration-300"
                          placeholder="Enter country"
                          autoComplete="country-name"
                        />
                      </div>
                    </div>
                  </div>


                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
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
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              )}

              {/* ... (link to login page) ... */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login" // Corrected link
                    className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                  >
                    Sign in here
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