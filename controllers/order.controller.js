const Order = require('../models/Order');

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;

    const orderNum = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const order = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      orderNum,
      items: orderList,
    });

    await order.save();

    res.status(200).json({ status: 'success', orderNum });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = orderController;
