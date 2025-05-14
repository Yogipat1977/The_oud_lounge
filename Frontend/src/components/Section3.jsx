import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";


const Section3 = () => {
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
  
  return (
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
          className="text-center mb-12"
          style={{ fontFamily: "Italiana" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#d4af37]">
            Trusted by Fragrance Enthusiasts Worldwide
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: "'item'" }}>
            Experience the finest selection of luxurious perfumes, handpicked to elevate your senses.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
            style={{ fontFamily: "'item'" }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
              {isVisible ? formatNumber(counts.customers) : "0"}
            </div>
            <p className="text-gray-400" style={{ fontFamily: "'item'" }}>Happy Customers</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
            style={{ fontFamily: "'item'" }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
              {isVisible ? formatNumber(counts.orders) : "0"}
            </div>
            <p className="text-gray-400" style={{ fontFamily: "'item'" }}>Orders Daily</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
            style={{ fontFamily: "'item'" }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
              {isVisible ? formatNumber(counts.cities) : "0"}
            </div>
            <p className="text-gray-400" style={{ fontFamily: "'item'" }}>Cities Served</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
       <Link to="/Product">
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "#b8860b" }}
    whileTap={{ scale: 0.95 }}
    className="px-8 py-3 bg-[#d4af37] text-black rounded-full font-medium flex items-center gap-2 transition-all duration-300"
  >
    Shop Now
    <ArrowRight className="w-4 h-4" />
  </motion.button>
</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Section3;