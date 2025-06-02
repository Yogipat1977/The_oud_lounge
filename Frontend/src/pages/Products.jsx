"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useCart } from "./CartContext"
import { Star, Heart, ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "../components/header"
import Footer from "../components/Footer"

// Local product data
const localPerfumeProducts = [
  {
    id: 1,
    name: "ARAB MONEY",
    description: "Luxurious and rich blend of precious woods and golden amber",
    price: 39.99,
    image: "/Images/Arab-money.jpg",
    rating: 4.9,
    reviews: 89,
    category: "Woody",
  },
  {
    id: 2,
    name: "NIGHT ILLUSION",
    description: "Deep and mysterious fragrance with dark, enchanting notes",
    price: 39.99,
    image: "/Images/Night-Illusion.jpg",
    rating: 4.8,
    reviews: 124,
    category: "Oriental",
  },
  {
    id: 3,
    name: "VELVET MUSK",
    description: "Soft and musky with luxurious velvet undertones",
    price: 39.99,
    image: "/Images/Velvet-Musk.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Woody",
  },
  {
    id: 4,
    name: "NIGHT IN PARIS",
    description: "Romantic and elegant fragrance inspired by Parisian nights",
    price: 39.99,
    image: "/Images/Night-in-Paris.jpg",
    rating: 4.8,
    reviews: 134,
    category: "Floral",
  },
  {
    id: 5,
    name: "TROPICAL AROMA",
    description: "Exotic and warm fragrance with tropical florals and spices",
    price: 39.99,
    image: "/Images/Tropical-Aroma.jpg",
    rating: 4.7,
    reviews: 112,
    category: "Woody",
  },
  {
    id: 6,
    name: "AQUA DI GIO",
    description: "Refreshing aquatic scent that captures the essence of Mediterranean waters",
    price: 39.99,
    image: "/Images/Aqua-Di-Gio.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Fresh",
  },
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
    id: 8,
    name: "WARDIA",
    description: "Rich, floral and opulent with precious rose and jasmine",
    price: 39.99,
    image: "/Images/Wardia.jpg",
    rating: 4.9,
    reviews: 98,
    category: "Floral",
  },
  {
    id: 9,
    name: "CANDY CRUSH",
    description: "Sweet and vibrant fragrance bursting with playful energy",
    price: 39.99,
    image: "/Images/Candy-Crush.jpg",
    rating: 4.6,
    reviews: 178,
    category: "Floral",
  },
  {
    id: 10,
    name: "MARSHMALLOW",
    description: "Sweet and warm gourmand with comforting vanilla notes",
    price: 39.99,
    image: "/Images/Marshemellow.jpg",
    rating: 4.7,
    reviews: 145,
    category: "Floral",
  },
  {
    id: 11,
    name: "FRUITELLA",
    description: "Juicy and fruity explosion of tropical and citrus notes",
    price: 39.99,
    image: "/Images/Fruitella.jpg",
    rating: 4.5,
    reviews: 167,
    category: "Floral",
  },
]

// Promotional Banner Component
const PromotionalBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-8 mb-12 mx-4 overflow-hidden"
      style={{
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 opacity-20">
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
        ></div>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-4 left-8">
        <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
      </div>
      <div className="absolute top-8 right-12">
        <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
      </div>
      <div className="absolute bottom-6 left-16">
        <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
      </div>
      <div className="absolute bottom-4 right-8">
        <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
      </div>

      {/* Shopping bag icons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <ShoppingCart className="w-12 h-12 text-white opacity-30" />
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <ShoppingCart className="w-12 h-12 text-white opacity-30" />
      </div>

      <div className="relative z-10 text-center">
        {/* Main banner ribbon */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto mb-6 max-w-2xl"
        >
          <div
            className="bg-red-600 text-white p-6 transform -rotate-2 shadow-2xl"
            style={{
              clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
            }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-wider">SUPER DEAL</h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <div
            className="bg-black/20 p-6 transform rotate-1"
            style={{
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            }}
          >
            <p className="text-2xl md:text-3xl font-bold mb-2">Buy Any 3 Perfumes for £100</p>
            <p className="text-lg md:text-xl font-semibold mb-2">+ Get 2 FREE Roll-ins Worth £20!</p>
            <p className="text-base font-medium">Save up to £39.97 on your order!</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          <div
            className="bg-white/20 px-6 py-3 transform -rotate-1"
            style={{
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            <span className="font-bold">✨ Mix & Match Any Fragrances</span>
          </div>
          <div
            className="bg-white/20 px-6 py-3 transform rotate-1"
            style={{
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            <span className="font-bold">🎁 FREE Roll-ins Included</span>
          </div>
          <div
            className="bg-white/20 px-6 py-3 transform -rotate-1"
            style={{
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            <span className="font-bold">💝 Limited Time Offer</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!product || typeof product.id === "undefined") {
      console.error("ProductCard: Cannot add to cart, product data is invalid.", product)
      return
    }
    setIsAdding(true)
    addToCart(product, 1)
    console.log(`ProductCard: Attempted to add ${product.name} to cart`)
    setTimeout(() => setIsAdding(false), 1000)
  }

  if (
    !product ||
    typeof product.id === "undefined" ||
    typeof product.name === "undefined" ||
    typeof product.price === "undefined"
  ) {
    return <div className="p-6 border rounded-2xl shadow-lg text-center text-red-500">Product data is incomplete.</div>
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

      {/* Deal Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
          Part of 3-for-£100 Deal!
        </Badge>
      </div>

      <div className="relative overflow-hidden h-64">
        <motion.img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
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
        {product.category && (
          <Badge variant="secondary" className="mb-3 inline-block">
            {product.category}
          </Badge>
        )}
        <h3
          className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p
          className="text-gray-600 text-sm leading-relaxed mb-4 h-10 overflow-hidden line-clamp-2"
          title={product.description}
        >
          {product.description || "No description available."}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center" role="img" aria-label={`Rating: ${product.rating || 0} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {Number.parseFloat(product.rating || 0).toFixed(1)} ({product.reviews || 0} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              £{product.price ? product.price.toFixed(2) : "0.00"}
            </span>
            <p className="text-xs text-purple-600 font-semibold">Or 3 for £100!</p>
          </div>
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
  const [activeFilter, setActiveFilter] = useState("All")
  const [masterProductList, setMasterProductList] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getCartItemsCount } = useCart()

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    try {
      setMasterProductList(localPerfumeProducts)
      setFilteredProducts(localPerfumeProducts)

      const uniqueCategories = ["All", ...new Set(localPerfumeProducts.map((p) => p.category).filter(Boolean))]
      setCategories(uniqueCategories)
      setIsLoading(false)
    } catch (e) {
      console.error("Error processing local product data:", e)
      setError("Failed to load product information. Please try again.")
      setIsLoading(false)
    }
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
          <p className="text-xl text-yellow-600">Loading perfumes...</p>
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
          <p className="text-md text-gray-700 mb-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Try Again
          </Button>
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
                  🛒 Cart: {getCartItemsCount()} item(s)
                </Badge>
              </motion.div>
            )}
          </motion.header>

          <PromotionalBanner />

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

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10"
            >
              <p className="text-xl text-gray-500">No perfumes found for "{activeFilter}".</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id || index} product={product} index={index} />
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

// Products.jsx
// "use client"

// import { motion } from "framer-motion"
// import { useState, useEffect } from "react"
// import { useCart } from "./CartContext" // Make sure this path is correct: e.g., ../contexts/CartContext or ./CartContext
// import { Star, Heart, ShoppingCart, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button" // Assuming ShadCN UI setup
// import { Badge } from "@/components/ui/badge"   // Assuming ShadCN UI setup
// import Header from "../components/header" // Adjust path if necessary
// import Footer from "../components/Footer"   // Adjust path if necessary

// // --- START: LOCAL PRODUCT DATA ---
// // Mapped from your provided data. 'id' is now 'id_from_js'.
// const localPerfumeProducts = [
//   {
//     id: 1, // This is the id_from_js, mapped to 'id'
//     name: "ARAB MONEY",
//     description: "Luxurious and rich blend of precious woods and golden amber",
//     price: 39.99,
//     image: "/Images/Arab-money.jpg",
//     rating: 4.9,
//     reviews: 89,
//     category: "Woody",
//     // stockQuantity: 100, // Optional for display, backend handles real stock
//   },
//   {
//     id: 2,
//     name: "NIGHT ILLUSION",
//     description: "Deep and mysterious fragrance with dark, enchanting notes",
//     price: 39.99,
//     image: "/Images/Night-Illusion.jpg",
//     rating: 4.8,
//     reviews: 124,
//     category: "Oriental",
//   },
//   {
//     id: 3,
//     name: "VELVET MUSK",
//     description: "Soft and musky with luxurious velvet undertones",
//     price: 39.99,
//     image: "/Images/Velvet-Musk.jpg",
//     rating: 4.8,
//     reviews: 156,
//     category: "Woody",
//   },
//   {
//     id: 4,
//     name: "NIGHT IN PARIS",
//     description: "Romantic and elegant fragrance inspired by Parisian nights",
//     price: 39.99,
//     image: "/Images/Night-in-Paris.jpg",
//     rating: 4.8,
//     reviews: 134,
//     category: "Floral", // Was Woody in Cart.jsx, now Floral as per your new data
//   },
//   {
//     id: 5,
//     name: "TROPICAL AROMA",
//     description: "Exotic and warm fragrance with tropical florals and spices",
//     price: 39.99,
//     image: "/Images/Tropical-Aroma.jpg",
//     rating: 4.7,
//     reviews: 112,
//     category: "Woody", // Was Floral in Products.jsx example, now Woody
//   },
//   {
//     id: 6,
//     name: "AQUA DI GIO",
//     description: "Refreshing aquatic scent that captures the essence of Mediterranean wa…", // Truncated in your data
//     price: 39.99,
//     image: "/Images/Aqua-Di-Gio.jpg",
//     rating: 4.8,
//     reviews: 156,
//     category: "Fresh",
//   },
//   {
//     id: 7,
//     name: "COOL WATER",
//     description: "Crisp and clean aquatic fragrance with invigorating freshness",
//     price: 39.99,
//     image: "/Images/Cool-Water.jpg",
//     rating: 4.7,
//     reviews: 203,
//     category: "Fresh",
//   },
//   {
//     id: 8,
//     name: "WARDIA",
//     description: "Rich, floral and opulent with precious rose and jasmine",
//     price: 39.99,
//     image: "/Images/Wardia.jpg",
//     rating: 4.9,
//     reviews: 98,
//     category: "Floral",
//   },
//   {
//     id: 9,
//     name: "CANDY CRUSH",
//     description: "Sweet and vibrant fragrance bursting with playful energy",
//     price: 39.99,
//     image: "/Images/Candy-Crush.jpg",
//     rating: 4.6,
//     reviews: 178,
//     category: "Floral",
//   },
//   {
//     id: 10,
//     name: "MARSHEMELLOW", // Corrected spelling from "MARSHEMELLOW" based on common usage
//     description: "Sweet and warm gourmand with comforting vanilla notes",
//     price: 39.99,
//     image: "/Images/Marshemellow.jpg", // Ensure filename matches
//     rating: 4.7,
//     reviews: 145,
//     category: "Floral", // Could also be "Gourmand"
//   },
//   {
//     id: 11,
//     name: "FRUITELLA",
//     description: "Juicy and fruity explosion of tropical and citrus notes",
//     price: 39.99,
//     image: "/Images/Fruitella.jpg",
//     rating: 4.5,
//     reviews: 167,
//     category: "Floral", // Could also be "Fruity"
//   },
//   // Add any other products you have here in the same format.
// ];
// // --- END: LOCAL PRODUCT DATA ---


// const ProductCard = ({ product, index }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const { addToCart } = useCart();

//   const handleAddToCart = () => { // Removed async as CartContext.addToCart is not async
//     if (!product || typeof product.id === 'undefined') {
//         console.error("ProductCard: Cannot add to cart, product data is invalid.", product);
//         return;
//     }
//     setIsAdding(true);
//     // The 'product' object from localPerfumeProducts should have all necessary fields
//     // as defined in the CartContext's addToCart validation/structuring.
//     addToCart(product, 1); // Add 1 quantity by default
//     console.log(`ProductCard: Attempted to add ${product.name} to cart`);
//     // Visual feedback for "Added!"
//     setTimeout(() => setIsAdding(false), 1000);
//   };

//   // Fallback for product data if any essential prop is missing
//   if (!product || typeof product.id === 'undefined' || typeof product.name === 'undefined' || typeof product.price === 'undefined') {
//     return (
//       <div className="p-6 border rounded-2xl shadow-lg text-center text-red-500">
//         Product data is incomplete.
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, delay: index * 0.1 }}
//       className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setIsLiked(!isLiked)}
//         className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
//         aria-label={`${isLiked ? "Remove from" : "Add to"} wishlist`}
//       >
//         <Heart
//           className={`w-5 h-5 transition-colors duration-300 ${
//             isLiked ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
//           }`}
//         />
//       </motion.button>

//       <div className="relative overflow-hidden h-64"> {/* Fixed height for image container */}
//         <motion.img
//           src={product.image || "/placeholder.svg"} // Fallback image
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-700" // h-full
//           animate={{ scale: isHovered ? 1.05 : 1 }}
//           transition={{ duration: 0.7 }}
//         />
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: isHovered ? 1 : 0 }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
//         />
//         <motion.div
//           initial={{ y: 100, opacity: 0 }}
//           animate={{
//             y: isHovered ? 0 : 100,
//             opacity: isHovered ? 1 : 0,
//           }}
//           transition={{ duration: 0.3 }}
//           className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
//         >
//           <Button
//             onClick={handleAddToCart}
//             disabled={isAdding}
//             className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg"
//           >
//             <ShoppingCart className="w-4 h-4" />
//             {isAdding ? "Added!" : "Quick Add"}
//           </Button>
//         </motion.div>
//       </div>

//       <div className="p-6">
//         {product.category && <Badge variant="secondary" className="mb-3 inline-block"> {product.category} </Badge>}
//         <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300 truncate" title={product.name}>
//           {product.name}
//         </h3>
//         <p className="text-gray-600 text-sm leading-relaxed mb-4 h-10 overflow-hidden line-clamp-2" title={product.description}> {/* Fixed height and line-clamp */}
//             {product.description || "No description available."}
//         </p>
//         <div className="flex items-center gap-2 mb-4">
//           <div className="flex items-center" role="img" aria-label={`Rating: ${product.rating || 0} out of 5 stars`}>
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-4 h-4 ${
//                   i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-sm text-gray-600">
//             {parseFloat(product.rating || 0).toFixed(1)} ({product.reviews || 0} reviews)
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold text-gray-900">£{product.price ? product.price.toFixed(2) : '0.00'}</span>
//           <Button
//             onClick={handleAddToCart}
//             disabled={isAdding}
//             size="sm"
//             className={`transition-all duration-300 ${
//               isAdding ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-black"
//             }`}
//           >
//             {isAdding ? "Added!" : "Add to Cart"}
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// const FilterBar = ({ activeFilter, onFilterChange, categories }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="flex flex-wrap justify-center gap-2 mb-12 bg-white rounded-full p-2 shadow-lg border border-gray-100 max-w-2xl mx-auto"
//     >
//       {categories.map((category) => (
//         <motion.button
//           key={category}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => onFilterChange(category)}
//           className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm ${
//             activeFilter === category
//               ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-md"
//               : "bg-transparent text-gray-700 hover:bg-gray-50"
//           }`}
//           aria-pressed={activeFilter === category}
//         >
//           {category}
//         </motion.button>
//       ))}
//     </motion.div>
//   )
// }

// export default function PerfumeProducts() {
//   const [activeFilter, setActiveFilter] = useState("All")
//   const [masterProductList, setMasterProductList] = useState([])
//   const [filteredProducts, setFilteredProducts] = useState([])
//   const [categories, setCategories] = useState(["All"])
//   // isLoading will be true for a very short time, or not at all if data is processed sync
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const { getCartItemsCount } = useCart()

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);
//     try {
//         // Use the local product data.
//         // The 'id' field in localPerfumeProducts is already what CartContext expects.
//         setMasterProductList(localPerfumeProducts);
//         setFilteredProducts(localPerfumeProducts); // Initially show all

//         const uniqueCategories = ["All", ...new Set(localPerfumeProducts.map(p => p.category).filter(Boolean))];
//         setCategories(uniqueCategories);
//         setIsLoading(false);
//     } catch (e) {
//         console.error("Error processing local product data:", e);
//         setError("Failed to load product information. Please try again.");
//         setIsLoading(false);
//     }
//   }, []);

//   const handleFilterChange = (category) => {
//     setActiveFilter(category)
//     if (category === "All") {
//       setFilteredProducts(masterProductList)
//     } else {
//       setFilteredProducts(masterProductList.filter((product) => product.category === category))
//     }
//   }

//   if (isLoading) {
//     return (
//       <>
//         <Header />
//         <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 px-4">
//           <p className="text-xl text-yellow-600">Loading perfumes...</p>
//         </main>
//         <Footer />
//       </>
//     )
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 text-center">
//           <p className="text-xl text-red-600 mb-4">Oops! Something went wrong.</p>
//           <p className="text-md text-gray-700 mb-2">{error}</p>
//           <Button onClick={() => window.location.reload()} className="mt-6">Try Again</Button>
//         </main>
//         <Footer />
//       </>
//     )
//   }

//   return (
//     <>
//       <Header />
//       <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <motion.header
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-16"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="flex justify-center mb-6"
//             >
//               <Sparkles className="w-16 h-16 text-yellow-500" />
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent mb-6"
//             >
//               Premium Perfumes
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.5 }}
//               className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
//             >
//               Discover our exquisite collection of premium fragrances, each crafted to perfection.
//             </motion.p>
//             {getCartItemsCount() > 0 && (
//               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
//                 <Badge variant="outline" className="text-lg px-4 py-2 bg-yellow-100 text-yellow-800 border-yellow-300">
//                   🛒 Cart: {getCartItemsCount()} item(s)
//                 </Badge>
//               </motion.div>
//             )}
//           </motion.header>

//           <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} categories={categories} />

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="text-center mb-8"
//           >
//             <p className="text-gray-600">
//               Showing <span className="font-semibold text-yellow-600">{filteredProducts.length}</span> of{" "}
//               <span className="font-semibold">{masterProductList.length}</span> products
//             </p>
//           </motion.div>

//           {filteredProducts.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-center py-10"
//             >
//               <p className="text-xl text-gray-500">No perfumes found for "{activeFilter}".</p>
//             </motion.div>
//           ) : (
//             <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product, index) => (
//                 <ProductCard key={product.id || index} product={product} index={index} /> // Added index as fallback key
//               ))}
//             </motion.div>
//           )}

//           <motion.section
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="text-center mt-20"
//             aria-labelledby="cta-heading"
//           >
//             <div className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 rounded-3xl p-12 border-2 border-yellow-200 shadow-xl">
//               <motion.h2
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.8 }}
//                 id="cta-heading"
//                 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
//               >
//                 Find Your Signature Scent
//               </motion.h2>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.9 }}
//                 className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg"
//               >
//                 Each fragrance tells a unique story. Explore our collection and discover the perfect scent that defines
//                 your personality and style.
//               </motion.p>
//             </div>
//           </motion.section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   )
// }

