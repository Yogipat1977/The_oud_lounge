"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, ArrowLeft, Trash2, Star, Gift, Sparkles, Heart } from "lucide-react"
import { useCart } from "./CartContext"
import { Link } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { motion } from "framer-motion"
import Header from "../components/header"
import Footer from "../components/Footer"

// Load Stripe key from environment variable
const VITE_STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!VITE_STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "Stripe publishable key is not defined. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file for local development, or in Render environment variables for deployment.",
  )
}
const stripePromise = VITE_STRIPE_PUBLISHABLE_KEY ? loadStripe(VITE_STRIPE_PUBLISHABLE_KEY) : null

// Sample recommended products
const recommendedProducts = [
  {
    id: 7,
    name: "COOL WATER",
    description: "Crisp and clean aquatic fragrance with invigorating freshness",
    price: 39.99,
    image: "/Images/Cool-Water.jpg",
    rating: 4.7,
    reviews: 203,
    category: "Fresh",
  },
  {
    id: 4,
    name: "NIGHT IN PARIS",
    description: "Romantic and elegant fragrance inspired by Parisian nights",
    price: 39.99,
    image: "/Images/Night-in-Paris.jpg",
    rating: 4.8,
    reviews: 134,
    category: "Woody",
  },
  {
    id: 8,
    name: "WARDIA",
    description: "Rich, floral and opulent with precious rose and jasmine",
    price: 39.99,
    image: "/Images/Wardia.jpg",
    rating: 4.9,
    reviews: 98,
    category: "Floral",
  },
]

// Enhanced Promotional Offer Component for Cart Page
const EnhancedCartPromotionalOffer = ({ cartItems, isCartPage = false }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Check if eligible for the 3-perfume deal
  const isEligibleForDeal = totalItems >= 3
  const dealPrice = 100
  const savings = subtotal - dealPrice

  if (!isCartPage && totalItems === 0) {
    // Enhanced promotional banner for product page
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-6 mb-8 mx-4 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
        }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(0,0,0,0.1) 8px,
                rgba(0,0,0,0.1) 16px
              )`,
            }}
          />
        </motion.div>

        {/* Floating animated elements */}
        {[
          { Icon: Star, className: "top-3 left-6 w-5 h-5", delay: 0 },
          { Icon: Sparkles, className: "top-6 right-8 w-4 h-4", delay: 0.5 },
          { Icon: Gift, className: "bottom-4 left-12 w-4 h-4", delay: 1 },
          { Icon: Heart, className: "bottom-3 right-6 w-5 h-5", delay: 1.5 },
        ].map(({ Icon, className, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${className} fill-yellow-300 text-yellow-300`}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon />
          </motion.div>
        ))}

        <div className="relative z-10 text-center">
          <motion.div
            className="bg-red-600 p-4 mb-4 transform -rotate-1 shadow-xl"
            style={{
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            }}
            animate={{
              rotate: [-1, 0, -1],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <motion.h3
              className="text-2xl font-black tracking-wide"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 15px rgba(255,255,255,0.8)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🎉 SPECIAL OFFER 🎉
            </motion.h3>
          </motion.div>

          <motion.div
            className="bg-black/20 p-4"
            style={{
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="text-lg font-bold mb-2">Buy Any 3 Perfumes for £100</p>
            <motion.p
              className="text-sm font-semibold"
              animate={{
                color: ["#ffffff", "#ffff99", "#ffffff"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              + Get 2 FREE Roll-ins Worth £20!
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (isCartPage && totalItems >= 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white p-6 mb-6 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Animated success background */}
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(0,0,0,0.1) 10px,
                rgba(0,0,0,0.1) 20px
              )`,
            }}
          />
        </motion.div>

        {/* Celebration particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${10 + (i % 2) * 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Gift className="w-8 h-8" />
            </motion.div>
            <div>
              <motion.div
                className="bg-red-600 px-4 py-2 transform -rotate-1"
                style={{
                  clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                }}
                animate={{
                  rotate: [-1, 0, -1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-xl font-black">🎉 DEAL AVAILABLE!</h3>
              </motion.div>
              <motion.p
                className="text-sm opacity-90 mt-2"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                You qualify for our special offer
              </motion.p>
            </div>
          </div>

          <motion.div
            className="bg-white/20 p-4"
            style={{
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
            }}
            animate={{
              scale: [1, 1.01, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">3 Perfumes Deal Price:</span>
              <motion.span
                className="text-2xl font-bold"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                £100.00
              </motion.span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>+ 2 FREE Roll-ins</span>
              <span className="text-green-200">FREE (Worth £20)</span>
            </div>
            {savings > 0 && (
              <motion.div
                className="flex justify-between items-center text-green-200"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <span>Your Savings:</span>
                <span className="font-bold">£{savings.toFixed(2)}</span>
              </motion.div>
            )}
          </motion.div>

          <motion.button
            className="w-full mt-4 bg-white text-green-600 font-bold py-3 hover:bg-gray-100 transition-colors"
            style={{
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 20px rgba(255,255,255,0.3)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Apply Deal - Save £{savings > 0 ? savings.toFixed(2) : "0.00"}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  if (isCartPage && totalItems > 0 && totalItems < 3) {
    const itemsNeeded = 3 - totalItems
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 mb-6 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Animated urgency background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(0,0,0,0.1) 10px,
                rgba(0,0,0,0.1) 20px
              )`,
            }}
          />
        </motion.div>

        {/* Progress indicators */}
        <div className="absolute top-2 left-4 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${i < totalItems ? "bg-green-400" : "bg-white/30"}`}
              animate={
                i < totalItems
                  ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0px rgba(34, 197, 94, 0)",
                        "0 0 10px rgba(34, 197, 94, 0.8)",
                        "0 0 0px rgba(34, 197, 94, 0)",
                      ],
                    }
                  : {
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
            </motion.div>
            <div>
              <motion.div
                className="bg-red-600 px-4 py-2 transform rotate-1"
                style={{
                  clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                }}
                animate={{
                  rotate: [1, -0.5, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-lg font-black">Almost There! 🎯</h3>
              </motion.div>
              <motion.p
                className="text-sm opacity-90 mt-2"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Add {itemsNeeded} more perfume{itemsNeeded > 1 ? "s" : ""} to unlock the deal
              </motion.p>
            </div>
          </div>

          <motion.div
            className="bg-white/20 p-4 mb-4"
            style={{
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
            }}
            animate={{
              scale: [1, 1.01, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="font-semibold mb-2">🎁 3 Perfumes for £100 + 2 FREE Roll-ins</p>
            <motion.p
              className="text-sm"
              animate={{
                color: ["#ffffff", "#ffff99", "#ffffff"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Save up to £39.97 on your order!
            </motion.p>
          </motion.div>

          <Link to="/product">
            <motion.button
              className="w-full bg-white text-orange-600 font-bold py-3 hover:bg-gray-100 transition-colors"
              style={{
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 15px rgba(255,255,255,0.5)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Add More Perfumes
            </motion.button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return null
}

export default function CartPage() {
  const [checkoutError, setCheckoutError] = useState("")
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [applyDeal, setApplyDeal] = useState(false)
  const { cartItems, addToCart, removeItem, updateQuantity, clearCart, getCartTotal } = useCart()

  const subtotal = getCartTotal()
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate delivery charge (£4.99 for orders under £100)
  const deliveryCharge = subtotal < 100 ? 4.99 : 0

  // Calculate final total based on whether deal is applied
  let finalTotal = subtotal + deliveryCharge
  if (applyDeal && totalItems >= 3) {
    finalTotal = 100 + deliveryCharge // Deal price + delivery if applicable
  }

  const handleApplyDeal = () => {
    if (totalItems >= 3) {
      setApplyDeal(true)
    }
  }

  const handleProceedToCheckout = async () => {
    const VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

    if (!stripePromise) {
      setCheckoutError("Stripe is not configured correctly. Cannot proceed to checkout.")
      setIsProcessingCheckout(false)
      return
    }
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.")
      return
    }
    setCheckoutError("")
    setIsProcessingCheckout(true)

    const API_BASE_URL_CLIENT = import.meta.env.VITE_API_BASE_URL

    if (!API_BASE_URL_CLIENT) {
      console.error("VITE_API_BASE_URL is not defined in the frontend environment for CartPage.")
      setCheckoutError("Client configuration error: API endpoint is missing. Cannot proceed.")
      setIsProcessingCheckout(false)
      return
    }

    try {
      const itemsToCheckout = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image ? `${VITE_APP_BASE_URL}${item.image.startsWith("/") ? item.image : "/" + item.image}` : null,
      }))

      // Add deal information if applied
      const checkoutData = {
        cartItems: itemsToCheckout,
        dealApplied: applyDeal && totalItems >= 3,
        dealPrice: applyDeal && totalItems >= 3 ? 100 : null,
        deliveryCharge: deliveryCharge,
      }

      console.log("Items being sent to backend for checkout:", checkoutData)

      const response = await fetch(`${API_BASE_URL_CLIENT}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      })

      const responseBodyText = await response.text()
      console.log("Raw server response text from /create-checkout-session:", responseBodyText)

      if (!response.ok) {
        let errorMsg = `Server error (status ${response.status}).`
        try {
          const errorData = JSON.parse(responseBodyText)
          errorMsg = errorData.error || JSON.stringify(errorData)
        } catch (e) {
          errorMsg = `Server error (status ${response.status}): ${responseBodyText.substring(0, 200)}...`
        }
        throw new Error(errorMsg)
      }

      let sessionData
      try {
        sessionData = JSON.parse(responseBodyText)
      } catch (e) {
        console.error("Error parsing successful server response as JSON:", e, "Response text:", responseBodyText)
        throw new Error(
          `Failed to parse server response: ${e.message}. Original response: ${responseBodyText.substring(0, 100)}...`,
        )
      }

      if (sessionData.sessionId) {
        const stripe = await stripePromise
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionData.sessionId,
        })
        if (error) {
          console.error("Stripe redirectToCheckout error:", error)
          setCheckoutError(error.message)
        }
      } else {
        console.error("Checkout session ID not found in server response. Response data:", sessionData)
        throw new Error("Checkout session ID not found in server response.")
      }
    } catch (error) {
      console.error("Error proceeding to checkout (outer catch):", error)
      setCheckoutError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  const EmptyCartView = () => (
    <div className="min-h-screen bg-white py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <EnhancedCartPromotionalOffer cartItems={[]} isCartPage={false} />
        <div className="text-center py-16">
          <div className="mb-8">
            <motion.div
              className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ShoppingCart className="w-16 h-16 text-amber-400" />
            </motion.div>
          </div>
          <motion.h1
            className="text-3xl font-bold text-amber-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your cart is currently empty
          </motion.h1>
          <motion.p
            className="text-amber-700 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our exquisite collection of luxury fragrances and find your perfect scent.
          </motion.p>
          <Link to="/product">
            <motion.button
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold mb-12 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Continue Shopping
            </motion.button>
          </Link>
          <div className="mt-16">
            <motion.h2
              className="text-2xl font-bold text-amber-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              You might like these
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={`${product.id}-${product.name}`}
                  className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg p-4 hover:shadow-amber-200/50 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-amber-900 mb-2 text-lg">{product.name}</h3>
                  <p className="text-sm text-amber-600 mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-amber-900 mb-4">£{product.price.toFixed(2)}</p>
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ItemsCartView = () => (
    <div className="min-h-screen bg-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-amber-900">Shopping Cart</h1>
          <motion.button
            onClick={clearCart}
            className="text-amber-700 hover:text-red-600 transition-colors duration-300 px-4 py-2 border border-amber-300 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Cart
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnhancedCartPromotionalOffer cartItems={cartItems} isCartPage={true} />

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg p-6 hover:shadow-amber-200/50 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <motion.img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-amber-600 mb-2">{item.description}</p>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-2">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(item.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">({item.reviews || 0})</span>
                      </div>
                      <p className="text-xl font-bold text-amber-900">£{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={() => removeItem(item.id)}
                      className="text-amber-400 hover:text-red-600 transition-colors duration-300 p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link
              to="/product"
              className="mt-6 flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-amber-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-amber-700">Subtotal</span>
                  <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                </div>

                {applyDeal && totalItems >= 3 ? (
                  <motion.div
                    className="bg-green-100 p-3 rounded-lg"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between text-green-700">
                      <span className="font-semibold">Deal Applied: 3 Perfumes</span>
                      <span className="font-bold">£100.00</span>
                    </div>
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>+ 2 FREE Roll-ins</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-green-700 text-sm">
                      <span>You Save:</span>
                      <span className="font-semibold">£{(subtotal - 100).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-amber-700">
                      Delivery {subtotal >= 100 ? "(Free over £100)" : "(Under £100)"}
                    </span>
                    <span className="font-semibold">
                      {deliveryCharge > 0 ? `£${deliveryCharge.toFixed(2)}` : "FREE"}
                    </span>
                  </div>
                )}

                <hr className="border-amber-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">£{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {!applyDeal && totalItems >= 3 && (
                <motion.button
                  onClick={handleApplyDeal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 mb-4 rounded-lg font-semibold transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(34, 197, 94, 0)",
                      "0 0 20px rgba(34, 197, 94, 0.3)",
                      "0 0 0px rgba(34, 197, 94, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  Apply 3-Perfume Deal (Save £{(subtotal - 100).toFixed(2)})
                </motion.button>
              )}

              <motion.button
                onClick={handleProceedToCheckout}
                disabled={isProcessingCheckout || !stripePromise}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mb-4 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                whileHover={{ scale: isProcessingCheckout ? 1 : 1.02 }}
                whileTap={{ scale: isProcessingCheckout ? 1 : 0.98 }}
              >
                {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
              </motion.button>
              {checkoutError && <p className="text-red-500 text-sm mb-2">{checkoutError}</p>}
              <div className="text-center">
                <p className="text-xs text-amber-600">🔒 Secure checkout guaranteed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Header />
      {cartItems.length === 0 ? <EmptyCartView /> : <ItemsCartView />}
      <Footer />
    </>
  )
}
