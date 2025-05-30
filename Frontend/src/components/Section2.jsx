import { useState, useEffect } from "react";
import { useCart } from '@/pages/CartContext';
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Plus } from 'lucide-react';
import { Link } from "react-router-dom";


// Import the images
const perfumeImages = [
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
  // Fresh
  {
    id: 6,
    name: "AQUA DI GIO",
    description: "Refreshing aquatic scent that captures the essence of Mediterranean waters",
    price: 49.99,
    image: "/Images/Aqua-Di-Gio.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Fresh",
  },
];

// Card component with animations
const PerfumeCard = ({ perfume, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gold-500/30 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 to-transparent opacity-70 z-0"></div>
      <div className="relative z-10 overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="aspect-square overflow-hidden bg-black"
        >
          <img 
            src={perfume.image || "/placeholder.svg"} 
            alt={perfume.name} 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
        </motion.div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-300"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-gold-400 text-gold-400' : 'text-white'}`} />
        </motion.button>
      </div>

      <div className="p-5 relative z-10">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
        >
          <h3 className="text-xl font-bold text-gold-400 mb-1">{perfume.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gold-200 text-lg font-semibold">£{perfume.price}</p>
            <div className="text-gold-400 text-sm">★★★★★</div>
          </div>
          <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: "'item' " }}>{perfume.description}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 px-4 bg-gold-500 hover:bg-gold-600 text-black font-medium rounded-md flex items-center justify-center gap-2 transition-all duration-300"
          onClick={() => addToCart(perfume)} 
        >
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </motion.button>
      </div>
    </motion.div>
  );
};

const LuxurySection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 relative ">
      {/* Elegant background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 z-0 "></div>
      
      {/* Gold accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-500/30"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-500/30"></div>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold-500/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gold-500/5 blur-3xl"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 z-0" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23D4AF37\' fillOpacity=\'0.4\' fillRule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
             backgroundSize: '20px 20px'
           }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16" 
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#808080] "style={{ fontFamily: "Italiana" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Luxury Scents
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#a9a9a9]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontFamily: "'item' " }}
          >
            Elevate your essence with our premium perfume collection. Unveil luxury scents, crafted to
            captivate and inspire every moment.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perfumeImages.map((perfume, index) => (
            <PerfumeCard key={perfume.id} perfume={perfume} index={index} />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link to="/product">
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
    whileTap={{ scale: 0.95 }}
    className="px-8 py-3 bg-transparent border-2 border-gold-400 text-gold-400 hover:bg-gold-500/10 rounded-md font-medium flex items-center gap-2 mx-auto transition-all duration-300"
  >
    <Plus className="w-5 h-5" />
    View All Collections
  </motion.button>
</Link>

        </motion.div>
      </div>
    </section>
  );
};

export default LuxurySection;