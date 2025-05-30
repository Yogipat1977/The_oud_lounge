"use client"

import { useState, useEffect } from "react"
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

/**
 * The Hero component displays a curated subscription box service landing page
 * with a search bar and a product carousel. It uses React's useState and useEffect
 * hooks to manage the state of the search bar and the product carousel.
 *
 * @returns {JSX.Element} The Hero component
 */
const Hero = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Dummy product data - replace with actual products later
  const products = [
    { id: 1, color: "transparent", name: "Oud Collection Box" },
    { id: 2, color: "transparent", name: "Premium Fragrance Set" },
    { id: 3, color: "transparent", name: "Luxury Oud Sampler" },
    { id: 4, color: "transparent", name: "Signature Scent Box" },
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [products.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-[#1c1c1c] relative overflow-hidden">
      <div className="container mx-auto px-6 py-20 md:py-40">
        {/* Use max-w-7xl or similar on the container if you want overall width limit */}
        <div className="grid grid-cols-1 dp:grid-cols-2 lap:grid-cols-2 gap-8">
          {/* Left side content */}
          <div className="max-w-4xl dp:text-left lap:text-left tab:text-center ph:text-center mx-auto dp:mx-0 lap:mx-0">
            <h1
              className="
                font-italiana
                text-[#DAA520]
                mb-8
                mt-10
                dp:text-8xl
                lap:text-7xl
                tab:text-6xl
                ph:text-5xl
                dp:text-left
                lap:text-left
                tab:text-center
                ph:text-center
              "
              style={{ fontFamily: "Italiana" }}
            >
              <span className="block">Curated Subscription </span>
              <span className="block">Boxes at Your</span>
              <span className="block">Doorstep</span>
            </h1>

            <p
              className="
                text-[#Ecebe4]
                mt-20 mb-8
                text-lg
                dp:text-xl
                dp:pr-40
                lap:pr-40
                tab:pr-0
                ph:pr-0
                dp:text-left
                lap:text-left
                tab:text-center
                ph:text-center
              "
              style={{ fontFamily: "item" }}
            >
              Step into 'The Oud Lounge' where every scent tells a story of luxury, tradition, and allure. Let our
              fragrances transport you to an oasis of sophistication, where the richness of oud meets modern elegance.
            </p>

            <div
              className="
              mt-20
              dp:text-left
              lap:text-left
              tab:text-center
              ph:text-center
            "
            >
              <a
                href="/product"
                className="
                  font-item
                  inline-block
                  border-[0.10rem]
                   border-[#DAA520]
                  text-[#DAA520]
                  rounded-full
                  px-8 py-3
                  mt-4
                  transition-all
                  duration-200
                  ease-in-out
                  hover:bg-[#DAA520]
                  hover:text-[#1c1c1c]
                "
                style={{ fontFamily: "item" }}
              >
                Shop Our Boxes
              </a>
            </div>

            {/* Search Bar */}
            <div className="dp:mt-40 mt-20 relative max-w-md mx-auto dp:mx-0 lap:mx-0">
              <div
                className={`
                flex items-center
                border-b-2
                m-x-auto
                dp:w-[40rem] /* Consider max-w-[40rem] w-full for flexibility */

                ${isFocused ? "border-[#DAA520]" : "border-[#Ecebe4]"}
                transition-all duration-150
              `}
              >
                <input
                  type="text"
                  placeholder="Search our collections..."
                  className="
                    bg-transparent
                    text-[#Ecebe4]
                    py-2
                    px-4
                    w-full
                    focus:outline-none
                  "
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <div className="flex items-center pr-2">
                  {!isFocused && (
                    <Search
                      className="
                    w-5 h-5
                    text-[#Ecebe4]
                    transition-all
                    duration-300
                    scale-100
                  "
                    />
                  )}
                  {isFocused && (
                    <ArrowRight
                      className="
                    w-5 h-5
                    text-[#DAA520]
                    ml-2
                    animate-pulse
                  "
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side product carousel */}
          {/* Outer container: Controls positioning and max size within the grid */}
          <div className="hidden tab:block relative h-[400px] lap:h-[600px] dp:h-[700px] w-full tab:w-[500px] tab:mx-auto lap:w-full lap:max-w-[800px] lap:ml-auto lap:mr-0 mt-10 lap:mt-0">
            {/* Inner Container: Holds slides and navigation, should fill outer container */}
            {/* REMOVED lap:ml-40 */}
            <div className="relative h-full w-full overflow-hidden">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`
                    absolute
                    top-0
                    left-0
                    w-full
                    flex
                    h-full
                    items-center
                    justify-center
                    transition-opacity
                    duration-500
                    ${currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"}


                  `}
                  style={{ backgroundColor: product.color }} // Note: color is 'transparent' in data
                >
                  <div className="text-white text-center p-4"> {/* Added padding for safety */}
                    <h3 className="text-3xl font-italiana mb-4">{product.name}</h3>
                    <p className="text-lg">Premium Collection</p>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  bg-black/30 /* Slightly darker for visibility */
                  hover:bg-black/50
                  rounded-full
                  p-2
                  z-20
                  transition-all
                  text-white
                "
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  bg-black/30 /* Slightly darker for visibility */
                  hover:bg-black/50
                  rounded-full
                  p-2
                  z-20
                  transition-all
                  text-white
                "
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Circular Navigation Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`
                      w-3 h-3
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        currentSlide === index
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75" // Simpler inactive state
                      }
                    `}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero