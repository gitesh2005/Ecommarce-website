import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get(`https://hari-collection-backend.onrender.com/api/products/${id}`, config);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <div className="flex justify-center mt-20 font-serif italic text-xl">Loading details...</div>;
  if (!product) return <div className="flex justify-center mt-20 font-serif italic text-xl">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/products" className="text-sm uppercase tracking-widest text-premium-dark/60 hover:text-premium-dark transition-colors">
          &larr; Back to Collection
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="aspect-[3/4] bg-premium-beige overflow-hidden shadow-2xl"
        >
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <p className="text-sm text-premium-brown uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-4xl md:text-5xl font-serif text-premium-dark mb-6 leading-tight">{product.title}</h1>
          <p className="text-2xl text-premium-dark/90 mb-8">₹{product.price.toLocaleString('en-IN')}</p>
          
          <div className="w-12 h-[1px] bg-premium-accent mb-8"></div>
          
          <p className="text-premium-dark/70 mb-10 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center border border-premium-dark/20">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-premium-dark hover:bg-premium-dark/5 transition-colors"
              >-</button>
              <span className="px-4 py-2 text-center w-12">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 text-premium-dark hover:bg-premium-dark/5 transition-colors"
              >+</button>
            </div>
            <p className="text-sm text-premium-dark/60">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 uppercase tracking-widest text-sm shadow-xl transition-all duration-300 ${
              product.stock > 0 
                ? 'bg-premium-dark text-white hover:bg-premium-accent' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
