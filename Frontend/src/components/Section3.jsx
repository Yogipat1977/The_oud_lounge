import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';

const TrustSection = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ customers: 0, orders: 0, cities: 0 });
  
  // Animation for counting up numbers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const section = document.getElementById('trust-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  
  // Animate the counting of statistics
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        customers: Math.floor(progress * 1000000),
        orders: Math.floor(progress * 200),
        cities: Math.floor(progress * 100)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [isVisible]);
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    } else {
      return num + '+';
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };
  
  return (
    <>
      {/* Trust Section */}
      <section 
        id="trust-section" 
        className="py-16 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden border-t border-none"
      >
        {/* Gold accent elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#d4af37]/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#d4af37]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"style={{ fontFamily: "Italiana" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#d4af37]">
              Trusted by Fragrance Enthusiasts Worldwide
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: "'item' " }}>
              Experience the finest selection of luxurious perfumes, handpicked to elevate your senses.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
              style={{ fontFamily: "'item' " }}
             
            >
              <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
                {isVisible ? formatNumber(counts.customers) : "0"}
                
              </div>
              <p className="text-gray-400" style={{ fontFamily: "'item' " }}>Happy Customers</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
              style ={{ fontFamily: "'item' " }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
                {isVisible ? formatNumber(counts.orders) : "0"}
              </div>
              <p className="text-gray-400"style={{ fontFamily: "'item' " }}>Orders Daily</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
              style ={{ fontFamily: "'item' " }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
                {isVisible ? formatNumber(counts.cities) : "0"}
              </div>
              <p className="text-gray-400" style={{ fontFamily: "'item' " }}>Cities Served</p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#b8860b" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#d4af37] text-black rounded-full font-medium flex items-center gap-2 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-gray-300 pt-16 pb-8 relative overflow-hidden">
        {/* Gold accent elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-[#d4af37]/30"></div>
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[#d4af37]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Social */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-2xl font-serif italic text-[#d4af37] mb-6">The Oud Lounge</h2>
                <div className="mb-4">
                  <p className="text-sm mb-2">Follow us →</p>
                  <div className="flex space-x-4">
                    <motion.a 
                      href="#" 
                      whileHover={{ y: -3, color: "#d4af37" }}
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    >
                      <Facebook size={18} />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      whileHover={{ y: -3, color: "#d4af37" }}
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    >
                      <Instagram size={18} />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      whileHover={{ y: -3, color: "#d4af37" }}
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    >
                      <Twitter size={18} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Shop Links */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-[#d4af37] font-medium mb-4 uppercase text-sm tracking-wider">Shop</h3>
                <ul className="space-y-2">
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Products
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Overview
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Pricing
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      New Releases
                    </motion.a>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            {/* Company Links */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-[#d4af37] font-medium mb-4 uppercase text-sm tracking-wider">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      About Us
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Contact Us
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Updates
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-[#d4af37] transition-colors"
                      whileHover={{ x: 3 }}
                      style={{ fontFamily: "'item' " }}
                    >
                      Support
                    </motion.a>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            {/* Newsletter */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-[#d4af37] font-medium mb-4 uppercase text-sm tracking-wider">Stay Up To Date</h3>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-gray-200 flex-grow"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, backgroundColor: "#b8860b" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-[#d4af37] text-black font-medium rounded-md transition-colors"
                  >
                    Submit
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <motion.a 
                  href="#" 
                  className="text-gray-400 text-sm hover:text-[#d4af37] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Cookies
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 text-sm hover:text-[#d4af37] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Terms and conditions
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 text-sm hover:text-[#d4af37] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Privacy
                </motion.a>
              </div>
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} The Oud Lounge. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default TrustSection;