const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.protect, authController.getProfile);
router.post('/change-password', authController.protect, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
