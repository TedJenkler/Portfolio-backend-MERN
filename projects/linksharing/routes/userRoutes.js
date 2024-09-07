const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loginLimiter = require('../middleware/rateLimiter');
const { validateLogin, handleValidationErrors } = require('../validation/login');

router.post('/register', userController.register);
router.post('/login', loginLimiter, validateLogin, handleValidationErrors , userController.login);

module.exports = router