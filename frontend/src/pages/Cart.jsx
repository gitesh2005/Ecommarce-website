import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-premium-dark mb-4">Your Cart is Empty</h2>
        <p className="text-premium-dark/60 mb-8 uppercase tracking-widest text-sm">Discover our collection</p>
        <Link 
          to="/products" 
          className="bg-premium-dark text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-premium-accent transition-colors shadow-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-premium-dark mb-10">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <motion.div 
              key={item.product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row items-center gap-6 p-6 glass-card shadow-sm"
            >
              <img 
                src={item.product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200'} 
                alt={item.product.title} 
                className="w-24 h-32 object-cover bg-premium-beige"
              />
              <div className="flex-grow text-center sm:text-left">
                <Link to={`/product/${item.product._id}`}>
                  <h3 className="text-lg font-medium text-premium-dark hover:text-premium-accent transition-colors">{item.product.title}</h3>
                </Link>
                <p className="text-sm text-premium-dark/60 uppercase tracking-widest mt-1">{item.product.category}</p>
                <p className="text-premium-dark mt-2">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-premium-dark/20">
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-3 py-1 text-premium-dark hover:bg-premium-dark/5 transition-colors"
                  >-</button>
                  <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 text-premium-dark hover:bg-premium-dark/5 transition-colors"
                  >+</button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-premium-dark/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card p-8 shadow-xl sticky top-28">
            <h2 className="text-2xl font-serif text-premium-dark mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-premium-dark/80 mb-6 border-b border-premium-dark/10 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-medium text-premium-dark mb-8">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full bg-premium-dark text-white py-4 uppercase tracking-widest text-sm hover:bg-premium-accent transition-colors shadow-lg"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
