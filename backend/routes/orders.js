const router = require('express').Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

router.get('/', auth, checkRole('readOrders'), orderController.getAll);
router.get('/:id', auth, checkRole('readOrders'), orderController.getById);
router.post('/', auth, checkRole('createOrders'), orderController.create);
router.put('/:id', auth, checkRole('updateOrders'), orderController.update);
router.put('/:id/status', auth, checkRole('updateOrders'), orderController.updateStatus);
router.delete('/:id', auth, checkRole('deleteOrders'), orderController.delete);

module.exports = router;