const router = require('express').Router();
const authRoutes = require('./auth');
const productRoutes = require('./products');
const saleRoutes = require('./sales');
const supplierRoutes = require('./suppliers');
const orderRoutes = require('./orders');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/orders', orderRoutes);

module.exports = router;