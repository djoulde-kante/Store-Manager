const router = require('express').Router();
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

router.get('/', auth, checkRole('readSales'), saleController.getAll);
router.get('/:id', auth, checkRole('readSales'), saleController.getById);
router.post('/', auth, checkRole('createSales'), saleController.create);
router.put('/:id', auth, checkRole('updateSales'), saleController.update);
router.delete('/:id', auth, checkRole('deleteSales'), saleController.delete);

module.exports = router;