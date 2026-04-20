import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get('http://localhost:5000/api/products', config);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  if (loading) return <div className="flex justify-center mt-20 font-serif italic text-xl">Loading collection...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12 border-b border-premium-dark/10 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-premium-dark">The Collection</h1>
          <p className="text-sm text-premium-dark/60 uppercase tracking-widest mt-2">Curated for excellence</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-premium-dark/60 italic font-serif">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product, index) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${product._id}`}>
                <div className="aspect-[3/4] overflow-hidden bg-premium-beige mb-4 relative shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'} 
                    alt={product.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-premium-dark/0 group-hover:bg-premium-dark/10 transition-colors duration-500"></div>
                </div>
                <div>
                  <p className="text-xs text-premium-brown uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-lg font-medium text-premium-dark mb-1">{product.title}</h3>
                  <p className="text-premium-dark/80">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
