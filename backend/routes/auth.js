const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validators');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/me', auth, authController.me);

module.exports = router;