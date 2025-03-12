const router = require('express').Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

router.get('/', auth, checkRole('readSuppliers'), supplierController.getAll);
router.get('/:id', auth, checkRole('readSuppliers'), supplierController.getById);
router.get('/:id/orders', auth, checkRole('readSuppliers'), supplierController.getWithOrders);
router.post('/', auth, checkRole('createSuppliers'), supplierController.create);
router.put('/:id', auth, checkRole('updateSuppliers'), supplierController.update);
router.delete('/:id', auth, checkRole('deleteSuppliers'), supplierController.delete);

module.exports = router;