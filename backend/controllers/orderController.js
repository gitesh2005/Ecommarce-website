const Order = require('../models/Order');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount, paymentMethod } = req.body;
    
    const order = new Order({
      user: req.user._id,
      items,
      shippingDetails,
      totalAmount,
      paymentMethod,
    });
    
    const createdOrder = await order.save();

    if (paymentMethod === 'Razorpay') {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
      });
      
      const options = {
        amount: totalAmount * 100, // in paise
        currency: 'INR',
        receipt: `receipt_${createdOrder._id}`,
      };
      
      const rzOrder = await razorpay.orders.create(options);
      createdOrder.razorpayOrderId = rzOrder.id;
      await createdOrder.save();
      
      return res.status(201).json({ order: createdOrder, rzOrder });
    }

    // Send email for COD
    try {
      const user = await User.findById(req.user._id);
      await sendEmail({
        email: user.email,
        subject: `Order Confirmation - Hari Collection`,
        message: `Thank you for your order! Your order ID is ${createdOrder._id}. Total Amount: ₹${totalAmount}. Payment Method: COD.`
      });
    } catch (emailErr) {
      console.error('Email could not be sent', emailErr);
    }

    res.status(201).json({ order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'Success';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // Send email for Razorpay success
        try {
          const user = await User.findById(order.user);
          await sendEmail({
            email: user.email,
            subject: `Payment Successful - Hari Collection`,
            message: `Thank you for your order! Your payment for order ID ${order._id} was successful. Total Amount: ₹${order.totalAmount}.`
          });
        } catch (emailErr) {
          console.error('Email could not be sent', emailErr);
        }

        return res.status(200).json({ message: "Payment verified successfully" });
      }
    }
    return res.status(400).json({ message: "Invalid signature sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = status;
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyRazorpayPayment, getUserOrders, getAllOrders, updateOrderStatus };
