const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

router.get('/', auth, checkRole('readProducts'), productController.getAll);
router.get('/low-stock', auth, checkRole('readProducts'), productController.getLowStock);
router.get('/expiring', auth, checkRole('readProducts'), productController.getExpiringProducts);
router.get('/:id', auth, checkRole('readProducts'), productController.getById);
router.post('/', auth, checkRole('createProducts'), productController.create);
router.put('/:id', auth, checkRole('updateProducts'), productController.update);
router.delete('/:id', auth, checkRole('deleteProducts'), productController.delete);

module.exports = router;