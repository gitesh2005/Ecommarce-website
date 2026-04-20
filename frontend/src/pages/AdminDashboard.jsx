import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', category: '', image: '', stock: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('https://hari-collection-backend.onrender.com/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://hari-collection-backend.onrender.com/api/orders', config);
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('https://hari-collection-backend.onrender.com/api/upload', formData, config);
      setNewProduct({ ...newProduct, image: data.url });
      setUploadingImage(false);
    } catch (error) {
      console.error(error);
      setUploadingImage(false);
      alert('Image upload failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('https://hari-collection-backend.onrender.com/api/products', newProduct, config);
      setNewProduct({ title: '', description: '', price: '', category: '', image: '', stock: '' });
      fetchProducts();
      alert('Product added!');
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`https://hari-collection-backend.onrender.com/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10 border-b border-premium-dark/10 pb-6">
        <h1 className="text-4xl font-serif text-premium-dark">Admin Dashboard</h1>
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm uppercase tracking-widest text-premium-brown hover:text-premium-accent transition-colors"
        >
          View Store &rarr;
        </a>
      </div>

      <div className="flex gap-8 mb-8 border-b border-premium-dark/10">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 uppercase tracking-widest text-sm transition-colors ${activeTab === 'products' ? 'border-b-2 border-premium-dark text-premium-dark' : 'text-premium-dark/50 hover:text-premium-dark'}`}
        >
          Manage Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 uppercase tracking-widest text-sm transition-colors ${activeTab === 'orders' ? 'border-b-2 border-premium-dark text-premium-dark' : 'text-premium-dark/50 hover:text-premium-dark'}`}
        >
          Manage Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-serif mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4 glass-card p-6 shadow-md">
              <input type="text" placeholder="Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full px-3 py-2 border-b border-premium-dark/20 bg-transparent focus:outline-none" />
              <textarea placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-3 py-2 border-b border-premium-dark/20 bg-transparent focus:outline-none" rows="3" />
              <input type="number" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-3 py-2 border-b border-premium-dark/20 bg-transparent focus:outline-none" />
              <input type="text" placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-3 py-2 border-b border-premium-dark/20 bg-transparent focus:outline-none" />
              
              <div className="border-b border-premium-dark/20 py-2">
                <label className="block text-sm text-premium-dark/60 mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-premium-beige px-4 py-2 text-sm text-premium-dark shadow-sm hover:bg-premium-dark hover:text-white transition-colors">
                    Choose Image
                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                  </label>
                  {uploadingImage && <span className="text-xs italic">Uploading...</span>}
                  {!uploadingImage && newProduct.image && <span className="text-xs text-green-600">Image uploaded!</span>}
                </div>
              </div>

              <input type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-3 py-2 border-b border-premium-dark/20 bg-transparent focus:outline-none" />
              
              <button type="submit" className="w-full bg-premium-dark text-white py-3 mt-4 uppercase tracking-widest text-xs hover:bg-premium-accent transition-colors">Add Product</button>
            </form>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-serif mb-6">Products List</h2>
            <div className="overflow-x-auto glass-card shadow-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-premium-beige border-b border-premium-dark/10">
                    <th className="p-4 text-xs tracking-widest uppercase">Image</th>
                    <th className="p-4 text-xs tracking-widest uppercase">Title</th>
                    <th className="p-4 text-xs tracking-widest uppercase">Price</th>
                    <th className="p-4 text-xs tracking-widest uppercase">Stock</th>
                    <th className="p-4 text-xs tracking-widest uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-premium-dark/5 hover:bg-premium-dark/5 transition-colors">
                      <td className="p-4"><img src={p.image} alt={p.title} className="w-10 h-10 object-cover" /></td>
                      <td className="p-4 text-sm font-medium">{p.title}</td>
                      <td className="p-4 text-sm">₹{p.price}</td>
                      <td className="p-4 text-sm">{p.stock}</td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 text-xs uppercase tracking-widest hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-serif mb-6">Recent Orders</h2>
          <div className="overflow-x-auto glass-card shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-premium-beige border-b border-premium-dark/10">
                  <th className="p-4 text-xs tracking-widest uppercase">Order ID</th>
                  <th className="p-4 text-xs tracking-widest uppercase">User</th>
                  <th className="p-4 text-xs tracking-widest uppercase">Amount</th>
                  <th className="p-4 text-xs tracking-widest uppercase">Method</th>
                  <th className="p-4 text-xs tracking-widest uppercase">Status</th>
                  <th className="p-4 text-xs tracking-widest uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-premium-dark/5 hover:bg-premium-dark/5 transition-colors">
                    <td className="p-4 text-sm font-mono">{o._id.substring(0, 8)}...</td>
                    <td className="p-4 text-sm">{o.user?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm font-medium">₹{o.totalAmount}</td>
                    <td className="p-4 text-sm">{o.paymentMethod}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-premium-dark/60">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
