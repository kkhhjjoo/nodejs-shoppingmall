const Cart = require('../models/Cart');

const cartController = {}
cartController.addItemToCart = async (req, res) => { 
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    //유저를 가지고 카트 찾기
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) { 
      //유저가 만든 카트가 없다, 만들어주기
      cart = new Cart({ userId });
      await cart.save();
    }
    //이미 카트에 들어가있는 아이템이냐? productId, size
    const existItem = cart.items.find((item) => item.productId.equals(productId) && item.size === size);
    if (existItem) { 
      //그렇다면 에러 ('이미 상품이 카트에 있습니다')
      throw new Error('상품이 이미 카트에 담겨 있습니다')
    }
    //카트에 아이템을 추가
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length });
  } catch (error) { 
    return res.status(400).json({ status: 'fail', message: error.message });
  }
}

cartController.updateCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const { id, qty } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId, 'items._id': id },
      { $set: { 'items.$.qty': qty } },
      { new: true }
    ).populate('items.productId');
    if (!cart) throw new Error('카트를 찾을 수 없습니다');
    res.status(200).json({ status: 'success', data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

cartController.getCartList = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product'
      }
    });
    if (!cart) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    res.status(200).json({ status: 'success', data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

cartController.deleteCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: id } } },
      { new: true }
    ).populate('items.productId');
    if (!cart) throw new Error('카트를 찾을 수 없습니다');
    res.status(200).json({ status: 'success', data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

module.exports = cartController;