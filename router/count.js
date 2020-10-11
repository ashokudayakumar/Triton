const express = require('express')
const router = express.Router();
const {createCount}  = require('../controllers/count');
const {protect,authorize} = require('../middleware/auth')
router.route('/:id').post(protect,authorize('user'),createCount);
module.exports = router;