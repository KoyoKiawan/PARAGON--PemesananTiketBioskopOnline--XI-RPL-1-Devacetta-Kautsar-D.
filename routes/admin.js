const express = require('express');
const { adminAuth, dashboard } = require('../controllers/admin.Controller');
const userController = require('../controllers/user.Controller');

const router = express.Router();

router.post('/login', userController.login);
router.get('/dashboard', adminAuth, dashboard);

module.exports = router;
