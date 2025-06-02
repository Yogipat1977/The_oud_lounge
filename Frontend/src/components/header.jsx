
"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { SheetTitle, SheetDescription } from "@/components/ui/sheet"
// --- MODIFICATION START ---
// Adjust this import path based on your actual project structure.
// This example assumes CartContext.jsx is in a 'pages' directory,
// and Header.jsx is in a 'components' directory,
// e.g., src/components/header.jsx and src/pages/CartContext.jsx
import { useCart } from "../pages/CartContext" // Adjust path if necessary
// --- MODIFICATION END ---

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  // --- MODIFICATION START ---
  const { getCartItemsCount } = useCart()
  // --- MODIFICATION END ---

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
        isScrolled ? "bg-[#DAA520]/90 backdrop-blur-sm shadow-md py-2" : "bg-[#DAA520] py-4",
      )}
    >
      <div className="container mx-auto px-4 max-w-[3000px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-4xl font-medium text-gray-800 font-italianno ml-8"
          style={{ fontFamily: "Italianno" }}
        >
          The oud lounge
        </a>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8 xl:space-x-12 2xl:space-x-16"
          style={{ fontFamily: "'item' " }}
        >
          {["Home", "About", "Product", "Contact"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[#0D1321] hover:text-[#003366] relative group transition-all duration-50 hover:scale-110 text-xl"
            >
              <span className="transition-colors duration-110">{item}</span>
            </a>
          ))}
        </nav>

        {/* Cart and Login - Desktop */}
        <div className="hidden md:flex items-center space-x-4 xl:space-x-6">
          <a
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-100 hover:scale-105 relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} className="transition-colors duration-100 hover:text-[#0D1321]" />
            {/* --- MODIFICATION START --- */}
            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemsCount()}
            </span>
            {/* --- MODIFICATION END --- */}
          </a>
          <a
            href="/login"
            className="flex items-center space-x-1 px-1 py-1border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-200 hover:scale-102"
            style={{ fontFamily: "'Itim', cursive" }}
          >
            <User size={16} />
            {/* <span></span> */}
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-3 md:hidden">
          {/* Cart Button - Mobile */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <a href="/cart" aria-label="Shopping cart">
              <ShoppingCart size={20} className="text-gray-950" />
              {/* --- MODIFICATION START --- */}
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gray-950 text-amber-500 text-xs">
                {getCartItemsCount()}
              </Badge>
              {/* --- MODIFICATION END --- */}
            </a>
          </Button>

          {/* Login Button - Mobile */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-gray-800  text-gray-950 bg-transparent hover:bg-gray-800 hover:text-white transition-all duration-200 hover:scale-102"
            asChild
          >
            <a href="/login" className="flex items-center gap-1">
              <User size={14} />
              <span className="text-sm" style={{ fontFamily: "'Itim', cursive" }}>
                Login
              </span>
            </a>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-950">
                <Menu size={24} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs p-0 bg-gradient-to-b from-amber-500 to-amber-800 border-none"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation links for The Oud Lounge</SheetDescription>
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-950 hover:bg-amber-600/20"
                  >
                    <X size={24} />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col items-center justify-center flex-1 space-y-6 py-8">
                  {["Home", "About", "Product", "Contact"].map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="text-2xl font-medium text-gray-950 hover:text-gray-850 transition-all duration-200 hover:scale-110 py-2 px-6 rounded-full hover:bg-amber-600/30"
                      style={{ fontFamily: "'Itim', cursive" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>

                {/* Footer with social links or additional info */}
                <div className="p-6 border-t border-amber-600/30">
                  <div className="text-center text-gray-950/80 text-sm">
                    <p className="mb-2" style={{ fontFamily: "'Itim', cursive" }}>
                      Follow us
                    </p>
                    <div className="flex justify-center space-x-4">
                      {/* You can add social media icons here */}
                      <span className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center">FB</span>
                      <span className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center">IG</span>
                      <span className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center">TW</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}