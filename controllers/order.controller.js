const Order = require('../models/Order');
const { randomStringGenerator } = require('../utils/randomStringGenerator');
const productController = require('./product.controller');

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    //프론트엔드에서 데이터 보낸거 받아와 userId, totalPrice, shipTo, contact, orderList
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;
    //재고 확인 & 재고 업데이트
    const insufficientStockItems = await productController.checkItemListStock(orderList);

    //재고가 충분하지 않는 아이템이 있엇다 => 에러
    if (insufficientStockItems.length > 0) { 
      const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, '');
      throw new Error(errorMessage);
    }
    //order를 만들자
    // const orderNum = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const order = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator()
    });

    await order.save();
    //save 후에 카트를 비워주자

    res.status(200).json({ status: 'success', orderNum: order.orderNum});
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1;

    const totalOrders = await Order.countDocuments({ userId });
    const totalPageNum = Math.ceil(totalOrders / PAGE_SIZE);

    const orderList = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.status(200).json({ status: 'success', data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 1;
    const { ordernum } = req.query;

    const query = {};
    if (ordernum) query.orderNum = { $regex: ordernum, $options: 'i' };

    const totalOrders = await Order.countDocuments(query);
    const totalPageNum = Math.ceil(totalOrders / PAGE_SIZE);

    const orderList = await Order.find(query)
      .populate('userId')
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.status(200).json({ status: 'success', data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = orderController;
