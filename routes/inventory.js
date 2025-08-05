const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// GET all items
router.get('/', auth, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST new item
router.post('/', auth, async (req, res) => {
  const { name, quantity, price, image } = req.body;

  // ✅ use reliable fallback image if none provided
  const fallbackImage = 'https://dummyimage.com/80x80/cccccc/000000&text=No+Img';
  const finalImage = image && image.trim() !== '' ? image : fallbackImage;

  const newItem = new Item({
    name,
    quantity,
    price,
    image: finalImage
  });

  await newItem.save();
  res.json(newItem);
});

// PUT (update quantity)
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  const item = await Item.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
  res.json(item);
});

// DELETE item
router.delete('/:id', auth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
