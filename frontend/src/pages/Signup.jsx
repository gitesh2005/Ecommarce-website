import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be 8-16 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/products');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-premium-brown/5 rounded-full blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 glass-card p-10 shadow-2xl relative z-10"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif text-premium-dark">Join the Collection</h2>
          <p className="mt-2 text-center text-sm text-premium-dark/60 tracking-widest uppercase">
            Create your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3">{error}</div>}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border-b border-premium-dark/20 placeholder-premium-dark/40 text-premium-dark focus:outline-none focus:border-premium-accent focus:z-10 sm:text-sm bg-transparent transition-colors"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border-b border-premium-dark/20 placeholder-premium-dark/40 text-premium-dark focus:outline-none focus:border-premium-accent focus:z-10 sm:text-sm bg-transparent transition-colors"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-4 pr-10 border-b border-premium-dark/20 placeholder-premium-dark/40 text-premium-dark focus:outline-none focus:border-premium-accent focus:z-10 sm:text-sm bg-transparent transition-colors"
                  placeholder="Password (8-16 chars, 1 uppercase, 1 number, 1 special)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-premium-dark/40 hover:text-premium-dark transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-premium-dark/50">
                Must be 8-16 characters containing at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
              </p>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium text-white bg-premium-dark hover:bg-premium-accent transition-colors focus:outline-none uppercase tracking-widest shadow-lg"
            >
              Sign Up
            </motion.button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-premium-brown hover:text-premium-accent transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
