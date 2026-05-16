const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../controllers/authController');

// Basic product CRUD
router.get('/', auth.protect, async (req, res, next) => {
  try{
    const { page = 1, limit = 20, q, category } = req.query;
    const where = {};
    if(q) where.name = { [db.Sequelize.Op.like]: `%${q}%` };
    if(category) where.categoryId = category;
    const products = await db.Product.findAndCountAll({ where, limit: +limit, offset: (page-1)*limit });
    res.json(products);
  }catch(err){ next(err); }
});

router.post('/', auth.protect, async (req, res, next) => {
  try{
    const p = await db.Product.create(req.body);
    res.json(p);
  }catch(err){ next(err); }
});

router.get('/:id', auth.protect, async (req, res, next) => {
  try{
    const p = await db.Product.findByPk(req.params.id);
    res.json(p);
  }catch(err){ next(err); }
});

router.put('/:id', auth.protect, async (req, res, next) => {
  try{
    const p = await db.Product.findByPk(req.params.id);
    await p.update(req.body);
    res.json(p);
  }catch(err){ next(err); }
});

router.delete('/:id', auth.protect, async (req, res, next) => {
  try{
    const p = await db.Product.findByPk(req.params.id);
    await p.destroy();
    res.json({ message: 'Deleted' });
  }catch(err){ next(err); }
});

module.exports = router;
