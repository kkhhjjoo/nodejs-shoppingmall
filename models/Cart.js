const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Schema = mongoose.Schema;
const cartSchema = Schema({
  userId: { type: mongoose.ObjectId, ref: User },
  items: [{
    productId: {
      type: mongoose.Object, ref: Product
    },
    size: { type: String, required: true },
    qty: {type: Number, default: 1, required: true}
  }]
}, { timeStamps: true });
cartSchema.methods.toJSON = function () { 
  const obj = this._doc
  delete obj.password
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj
}

const Cart = mongoose.model('Cart', userSchema);
module.exports = Cart;