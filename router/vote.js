const express = require('express')
const router = express.Router();
const {getVotes,getVote,createVote,updateVote,deleteVote}  = require('../controllers/vote');
const {protect,authorize} = require('../middleware/auth')
router.route('/').get(protect,authorize('admin'),getVotes).post(protect,authorize('admin'),createVote);
router.route('/:id').get(protect,authorize('admin'),getVote).put(protect,authorize('admin'),updateVote).delete(protect,authorize('admin'),deleteVote);
module.exports = router;