const express = require('express');
const router = express.Router();
const { createOrder, verifyRazorpayPayment, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getUserOrders);
router.route('/verify-payment').post(protect, verifyRazorpayPayment);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
