const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// ✅ POST /api/billing → Save bill + update inventory
router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal, tax, total, customerName, invoiceNumber, date } = req.body;

    // 1. Update inventory quantities
    for (const i of items) {
      const item = await Item.findById(i.id);
      if (item) {
        item.quantity = Math.max(item.quantity - i.quantity, 0);
        await item.save();
      }
    }

    // 2. Create and save bill
    const newBill = new Bill({
      items,
      subtotal,
      tax,
      total,
      customerName: customerName || 'Walk-in',
      invoiceNumber: invoiceNumber || Math.floor(Math.random() * 1000000),
      date: date || new Date()
    });

    await newBill.save();
    res.status(201).json({ message: 'Bill saved and inventory updated' });

  } catch (err) {
    console.error('Error saving bill:', err);
    res.status(500).json({ message: 'Error saving bill' });
  }
});

// ✅ GET /api/billing/history → All bills
router.get('/history', auth, async (req, res) => {
  try {
    const history = await Bill.find().sort({ date: -1 }).limit(100); // recent first
    res.json(history);
  } catch (err) {
    console.error('Error loading history:', err);
    res.status(500).json({ message: 'Error loading billing history' });
  }
});

module.exports = router;
