const express = require('express')
const router = express.Router();
const {login, register,getme}  = require('../controllers/auth');
const {protect} = require('../middleware/auth')
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getme);
module.exports = router;