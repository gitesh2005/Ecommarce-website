import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-premium-light flex items-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-premium-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-premium-brown/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl lg:text-7xl font-serif text-premium-dark leading-tight mb-6">
            Elegance <br />
            <span className="italic text-premium-brown">Redefined.</span>
          </h1>
          <p className="text-lg text-premium-dark/70 mb-10 max-w-md leading-relaxed">
            Discover a curated collection of premium fashion pieces designed for the modern individual who values sophistication and quality.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              to="/products" 
              className="bg-premium-dark text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-premium-accent transition-colors shadow-2xl inline-block"
            >
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <div className="aspect-[4/5] bg-premium-beige rounded-tl-[100px] rounded-br-[100px] overflow-hidden relative shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
              alt="Fashion Model" 
              className="w-full h-full object-cover mix-blend-multiply opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-premium-dark/40 to-transparent"></div>
          </div>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute -bottom-10 -left-10 bg-white p-6 shadow-xl glass-card max-w-xs"
          >
            <p className="font-serif italic text-xl text-premium-brown mb-2">"True luxury is understanding quality."</p>
            <p className="text-xs uppercase tracking-widest text-premium-dark/60">— Hari Collection</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
