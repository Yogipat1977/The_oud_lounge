"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"



export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Utility function to conditionally join classNames
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-md py-2" : "bg-[#DAA520] py-4",
      )}
    >
      <div className="container mx-auto px-4 max-w-[3000px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-4xl font-medium text-gray-800   font-italianno ml-8"
          style={{ fontFamily: "'Italianno', cursive" }}
        >
          The oud lounge
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8 xl:space-x-12 2xl:space-x-16"
          style={{ fontFamily: "'Itim', cursive" }}
        >
          {["Home", "About", "Features", "Contacts"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[#0D1321] hover:text-[#003366] relative group transition-all duration-50 hover:scale-110 text-2xl"
            >
              <span className="transition-colors duration-110 ">{item}</span>
              {/* <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-150 group-hover:w-full" /> */}
            </a>
          ))}
        </nav>

        {/* Cart and Login */}
        <div className="hidden md:flex items-center space-x-4 xl:space-x-6">
          <a
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-100 hover: scale-105 relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} className="transition-colors duration-100 hover:text-[#0D1321]" />
            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </a>
          <a
            href="/login"
            className="flex items-center space-x-1 px-4 py-1.5 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-200 hover:scale-102"
            style={{ fontFamily: "'Itim', cursive" }}
          >
            <User size={16} />
            <span>Login</span>
          </a>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col pt-20 px-6 md:hidden transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav className="flex flex-col space-y-6 items-center" style={{ fontFamily: "'Itim', cursive" }}>
            {["Home", "About", "Features", "Contacts"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-xl text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-center space-x-6 mt-8">
            <a
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative"
              aria-label="Shopping cart"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart size={24} className="transition-colors duration-300 hover:text-blue-600" />
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </a>
            <a
              href="/login"
              className="flex items-center space-x-1 px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105"
              style={{ fontFamily: "'Itim', cursive" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>Login</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

