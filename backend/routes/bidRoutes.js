const express = require('express');
const router = express.Router();
const { placeBid, getBidHistory, getHighestBid, getMyBids } = require('../controllers/bidController');
const { protect, requireApproval, authorizeRoles } = require('../middleware/auth');

router.post('/', protect, requireApproval, authorizeRoles('consumer'), placeBid);
router.get('/my', protect, requireApproval, getMyBids);
router.get('/:productId/highest', getHighestBid);
router.get('/:productId', getBidHistory);

module.exports = router;
