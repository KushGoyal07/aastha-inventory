const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  image: { type: String }
});
module.exports = mongoose.model('Item', ItemSchema);
