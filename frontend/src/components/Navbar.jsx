import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 glass-card border-b border-premium-accent/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl tracking-widest text-premium-dark font-semibold">
              HARI <span className="text-premium-accent font-normal italic">Collection</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-8">
            {!user ? (
              <>
                <Link to="/login" className="text-sm tracking-widest uppercase hover:text-premium-accent transition-colors">Login</Link>
                <Link to="/signup" className="text-sm tracking-widest uppercase bg-premium-dark text-white px-6 py-2 hover:bg-premium-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Signup</Link>
              </>
            ) : (
              <>
                <Link to="/products" className="text-sm tracking-widest uppercase hover:text-premium-accent transition-colors">Products</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm tracking-widest uppercase hover:text-premium-accent transition-colors text-premium-brown">Dashboard</Link>
                )}
                <div className="flex items-center gap-4 border-l border-premium-dark/10 pl-4">
                  <Link to="/cart" className="relative hover:text-premium-accent transition-colors">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                  </Link>
                  <button onClick={handleLogout} className="hover:text-red-500 transition-colors">
                    <LogOut size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
