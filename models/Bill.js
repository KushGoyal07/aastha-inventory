const mongoose = require('mongoose');
const BillSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  customerName: String,
  date: { type: Date, default: Date.now },
  invoiceNumber: Number
});
module.exports = mongoose.model('Bill', BillSchema);
