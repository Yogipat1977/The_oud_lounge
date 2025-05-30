"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, ArrowLeft, Trash2, Star } from "lucide-react"
import { useCart } from "./CartContext"
import { Link } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import Header from "../components/header"
import Footer from "../components/Footer"

const stripePromise = loadStripe(
  "pk_live_51RSlVpGLNE9rb5dh0JFN3uHOgUQ2hlUD3HW7rRyBPKYYgigmAGCAKRFzaP2KusIFrgFYwDt3LlggatotuodbhJ6B005sNV2xpN",
)

// Sample recommended products with actual image paths
const recommendedProducts = [
  {
  
    id: 7,
    name: "COOL WATER",
    description: "Crisp and clean aquatic fragrance with invigorating freshness",
    price: 49.99,
    image: "/Images/Cool-Water.jpg",
    rating: 4.7,
    reviews: 203,
    category: "Fresh",
  },
    {
    id: 4,
    name: "NIGHT IN PARIS",
    description: "Romantic and elegant fragrance inspired by Parisian nights",
    price: 49.99,
    image: "/Images/Night-in-Paris.jpg",
    rating: 4.8,
    reviews: 134,
    category: "Woody",
  },
  {
    id: 7,
    name: "COOL WATER",
    description: "Crisp and clean aquatic fragrance with invigorating freshness",
    price: 49.99,
    image: "/Images/Cool-Water.jpg",
    rating: 4.7,
    reviews: 203,
    category: "Fresh",
  },
]

export default function CartPage() {
  const [checkoutError, setCheckoutError] = useState("")
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const { cartItems, addToCart, removeItem, updateQuantity, clearCart, getCartTotal } = useCart()

  // Calculate totals
  const subtotal = getCartTotal()
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.")
      return
    }
    setCheckoutError("")
    setIsProcessingCheckout(true)

    try {
      const itemsToCheckout = cartItems.map((item) => ({ id: item.id, quantity: item.quantity }))

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: itemsToCheckout }),
      })

      const sessionData = await response.json()

      if (!response.ok) {
        throw new Error(sessionData.error || "Failed to create checkout session")
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
        throw new Error("Checkout session ID not found.")
      }
    } catch (error) {
      console.error("Error proceeding to checkout:", error)
      setCheckoutError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  // Empty Cart View
  const EmptyCartView = () => (
    <div className="min-h-screen bg-white py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          {/* Empty Cart Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-amber-400" />
            </div>
          </div>

          {/* Empty Cart Message */}
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Your cart is currently empty</h1>
          <p className="text-amber-700 mb-8 max-w-md mx-auto">
            Discover our exquisite collection of luxury fragrances and find your perfect scent.
          </p>

          {/* Continue Shopping Button */}
          <Link to="/product">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold mb-12 transition-colors duration-300">
              Continue Shopping
            </button>
          </Link>

          {/* Recommended Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-amber-900 mb-8">You might like these</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg p-4 hover:shadow-amber-200/50 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-amber-900 mb-2 text-lg">{product.name}</h3>
                  <p className="text-sm text-amber-600 mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-amber-900 mb-4">£{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Items in Cart View
  const ItemsCartView = () => (
    <div className="min-h-screen bg-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-amber-700 hover:text-red-600 transition-colors duration-300 px-4 py-2 border border-amber-300 rounded-lg"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg p-6 hover:shadow-amber-200/50 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Product Info */}
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
                              i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">({item.reviews})</span>
                      </div>
                      <p className="text-xl font-bold text-amber-900">£{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-colors duration-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-amber-400 hover:text-red-600 transition-colors duration-300 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/product"
              className="mt-6 flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-amber-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-amber-700">Subtotal</span>
                  <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Tax</span>
                  <span className="font-semibold">£{tax.toFixed(2)}</span>
                </div>
                <hr className="border-amber-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={isProcessingCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mb-4 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
              >
                {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
              </button>

              {checkoutError && <p className="text-red-500 text-sm mb-2">{checkoutError}</p>}

              {/* Security Badge */}
              <div className="text-center">
                <p className="text-xs text-amber-600">🔒 Secure checkout guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render based on cart state
  return (
    <>
      <Header />
      {cartItems.length === 0 ? <EmptyCartView /> : <ItemsCartView />}
      <Footer />
    </>
  )
}
