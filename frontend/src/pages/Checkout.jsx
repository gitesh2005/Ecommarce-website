import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const orderData = {
        items: cart.map(item => ({ product: item.product._id, quantity: item.quantity, price: item.price })),
        shippingDetails,
        totalAmount: cartTotal,
        paymentMethod
      };

      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);

      if (paymentMethod === 'Razorpay') {
        const { data: clientId } = await axios.get('http://localhost:5000/api/config/razorpay');

        const res = await loadRazorpay();
        if (!res) {
          setError('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        const options = {
          key: clientId,
          amount: data.rzOrder.amount,
          currency: 'INR',
          name: 'Hari Collection',
          description: 'Premium Fashion Store',
          order_id: data.rzOrder.id,
          handler: async function (response) {
            try {
              await axios.post('http://localhost:5000/api/orders/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.order._id
              }, config);
              clearCart();
              alert('Payment successful & Order Placed!');
              navigate('/products');
            } catch (err) {
              setError('Payment verification failed.');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#2c2a29'
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        clearCart();
        alert('Order placed successfully via COD!');
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-premium-dark mb-10">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={placeOrder} className="space-y-8 glass-card p-8 shadow-xl">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3">{error}</div>}
            
            <div>
              <h2 className="text-2xl font-serif text-premium-dark mb-6">Shipping Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border-b border-premium-dark/20 bg-transparent focus:outline-none focus:border-premium-accent transition-colors"
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 border-b border-premium-dark/20 bg-transparent focus:outline-none focus:border-premium-accent transition-colors"
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 border-b border-premium-dark/20 bg-transparent focus:outline-none focus:border-premium-accent transition-colors"
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  type="text"
                  name="country"
                  required
                  placeholder="Country"
                  className="w-full px-4 py-3 border-b border-premium-dark/20 bg-transparent focus:outline-none focus:border-premium-accent transition-colors"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-premium-dark mb-6">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-premium-dark/20 cursor-pointer hover:bg-premium-dark/5 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-premium-dark w-4 h-4"
                  />
                  <span className="text-premium-dark">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-premium-dark/20 cursor-pointer hover:bg-premium-dark/5 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-premium-dark w-4 h-4"
                  />
                  <span className="text-premium-dark">Pay Online (Razorpay)</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 uppercase tracking-widest text-sm shadow-xl transition-all duration-300 ${loading ? 'bg-gray-400' : 'bg-premium-dark text-white hover:bg-premium-accent'}`}
            >
              {loading ? 'Processing...' : `Place Order (₹${cartTotal.toLocaleString('en-IN')})`}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-premium-beige p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-premium-dark mb-6 border-b border-premium-dark/10 pb-4">Order Review</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100'} alt={item.product.title} className="w-12 h-16 object-cover" />
                    <div>
                      <p className="text-sm font-medium text-premium-dark">{item.product.title}</p>
                      <p className="text-xs text-premium-dark/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-premium-dark/10 pt-4 flex justify-between text-lg font-medium text-premium-dark">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
