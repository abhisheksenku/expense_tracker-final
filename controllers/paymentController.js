const Order = require('../models/order');
const User = require('../models/users');
const { createOrder, getPaymentStatus } = require('../services/paymentService');
const jwt = require('jsonwebtoken');
const sequelize = require('../utilities/sql');
const handleCreateOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Generate a unique order ID
    const orderId = `ORDER_${Date.now()}`;
    const orderAmount = 1.00; // Example amount; you can get from req.body
    const orderCurrency = "INR"; // Correct currency code
    const customerID = "CUST_001"; // Replace or get from req.body
    const customerPhone = "9999999999"; // Replace or get from req.body
    const UserId = req.user.id;
    if (!req.user || !UserId) {
      await t.rollback();
        return res.status(401).json({ error: "Unauthorized: user not found" });
    }
    // Call service to create order in Cashfree
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
      
    );
    await Order.create({
      orderId: orderId,
      paymentId: null,           // will be updated after payment success
      status: "PENDING",
      UserId
    },{transaction:t});
    // Send paymentSessionId and orderId back to frontend
    await t.commit();
    res.status(200).json({
      paymentSessionId,
      orderId
    });
  } catch (error) {
    await t.rollback();
    console.error("Error in handleCreateOrder:", error.message);
    console.error(error);  // This logs full error stack trace - very useful
    res.status(500).json({ error: "Failed to create order" });
  }
};

const handlePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderStatus = await getPaymentStatus(orderId);
    res.status(200).json({
      orderStatus
    });
  } catch (error) {
    console.error("Error in handlePaymentStatus:", error.message);
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
};
const handlePaymentSuccess = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { orderId, paymentId } = req.body;
    const UserId = req.user.id;
    await Order.update(
      { status: "SUCCESSFUL", paymentId: paymentId },
      { where: { orderId: orderId,
        UserId:UserId,
       },transaction:t }, 
    );
    await User.update({ isPremium: true }, { where: { id: UserId }, transaction:t });
    await t.commit();
    res.status(200).json({ message: "Order marked as SUCCESSFUL" });
  } catch (error) {
    await t.rollback();
    console.error("Error in handlePaymentSuccess:", error.message);
    res.status(500).json({ error: "Failed to update order" });
  }
};
const handlePaymentFailed = async (req, res) => {
  try {
    const { orderId } = req.body;
    const UserId = req.user.id;

    await Order.update(
      { status: "FAILED" },
      { where: { orderId, UserId } }
    );

    res.status(200).json({ message: "Order marked as FAILED" });
  } catch (error) {
    console.error("Error in handlePaymentFailed:", error.message);
    res.status(500).json({ error: "Failed to update order" });
  }
};

module.exports = {
  handleCreateOrder,
  handlePaymentStatus,
  handlePaymentSuccess,
  handlePaymentFailed
};
