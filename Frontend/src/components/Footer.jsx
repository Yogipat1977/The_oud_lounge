import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };
  
  return (
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
                    style={{ fontFamily: "'item'" }}
                  >
                    Products
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
                  >
                    Overview
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
                  >
                    Pricing
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
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
                    style={{ fontFamily: "'item'" }}
                  >
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
                  >
                    Contact Us
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
                  >
                    Updates
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    whileHover={{ x: 3 }}
                    style={{ fontFamily: "'item'" }}
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
  );
};

export default Footer;