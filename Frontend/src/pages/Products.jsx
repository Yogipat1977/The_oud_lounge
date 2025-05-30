// Products.jsx
"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useCart } from "./CartContext"
import { Star, Heart, ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "../components/header"
import Footer from "../components/Footer"

// --- ADD THIS LINE ---
// Define API_BASE_URL at the module level so it's accessible throughout this file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// --- END OF ADDITION ---

const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      console.log("Adding product to cart:", product)
      addToCart(product)
      console.log(`Successfully added ${product.name} to cart`)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setTimeout(() => setIsAdding(false), 1000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
        aria-label={`${isLiked ? "Remove from" : "Add to"} wishlist`}
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-300 ${
            isLiked ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
          }`}
        />
      </motion.button>

      <div className="relative overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-700"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        />
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: isHovered ? 0 : 100,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Added!" : "Quick Add"}
          </Button>
        </motion.div>
      </div>

      <div className="p-6">
        <Badge variant="secondary" className="mb-3">
          {product.category}
        </Badge>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center" role="img" aria-label={`Rating: ${product.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">£{product.price}</span>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            size="sm"
            className={`transition-all duration-300 ${
              isAdding ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {isAdding ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

const FilterBar = ({ activeFilter, onFilterChange, categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap justify-center gap-2 mb-12 bg-white rounded-full p-2 shadow-lg border border-gray-100 max-w-2xl mx-auto"
    >
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(category)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm ${
            activeFilter === category
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-md"
              : "bg-transparent text-gray-700 hover:bg-gray-50"
          }`}
          aria-pressed={activeFilter === category}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default function PerfumeProducts() {
  // No need to define API_BASE_URL here again, it's defined at the module level above

  const [activeFilter, setActiveFilter] = useState("All")
  const [masterProductList, setMasterProductList] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getCartItemsCount } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      // Add a check for API_BASE_URL before fetching
      if (!API_BASE_URL) {
        setError("API_BASE_URL is not defined. Please check your environment variables and ensure they are prefixed with VITE_ for client-side access.");
        setIsLoading(false);
        console.error("API_BASE_URL is undefined in PerfumeProducts fetchProducts");
        return;
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/products`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || 'Failed to fetch products'}`)
        }
        const data = await response.json()

        const mappedData = data.map(p => ({
          ...p,
          id: p.id_from_js || p._id,
        }));

        setMasterProductList(mappedData)
        setFilteredProducts(mappedData)

        const uniqueCategories = ["All", ...new Set(mappedData.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)

      } catch (e) {
        console.error("Failed to fetch products:", e)
        // Append the API_BASE_URL value to the error for easier debugging if it's still an issue
        setError(`${e.message} (Using API_BASE_URL: ${API_BASE_URL || 'undefined'})` || "An unknown error occurred while fetching products.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleFilterChange = (category) => {
    setActiveFilter(category)
    if (category === "All") {
      setFilteredProducts(masterProductList)
    } else {
      setFilteredProducts(masterProductList.filter((product) => product.category === category))
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 px-4">
          <p className="text-xl text-yellow-600">Loading perfumes, please wait...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 text-center">
          <p className="text-xl text-red-600 mb-4">Oops! Something went wrong.</p>
          <p className="text-md text-gray-700 mb-2">Could not load the perfumes.</p>
          <p className="text-sm text-gray-500">Details: {error}</p> {/* Error will now be more informative */}
          <Button onClick={() => window.location.reload()} className="mt-6">Try Again</Button>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Sparkles className="w-16 h-16 text-yellow-500" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent mb-6"
            >
              Premium Perfumes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Discover our exquisite collection of premium fragrances, each crafted to perfection.
            </motion.p>
            {getCartItemsCount() > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
                <Badge variant="outline" className="text-lg px-4 py-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                  🛒 Cart: {getCartItemsCount()} items
                </Badge>
              </motion.div>
            )}
          </motion.header>

          <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} categories={categories} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600">
              Showing <span className="font-semibold text-yellow-600">{filteredProducts.length}</span> of{" "}
              <span className="font-semibold">{masterProductList.length}</span> products
            </p>
          </motion.div>

          {filteredProducts.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10"
            >
              <p className="text-xl text-gray-500">No perfumes found for "{activeFilter}".</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-20"
            aria-labelledby="cta-heading"
          >
            <div className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 rounded-3xl p-12 border-2 border-yellow-200 shadow-xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                id="cta-heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Find Your Signature Scent
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg"
              >
                Each fragrance tells a unique story. Explore our collection and discover the perfect scent that defines
                your personality and style.
              </motion.p>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  )
}