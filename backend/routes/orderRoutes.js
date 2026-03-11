const express = require('express');
const router = express.Router();
const {
    createDirectOrder, createAuctionOrder, getMyOrders, getFarmerOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, requireApproval, authorizeRoles } = require('../middleware/auth');

router.post('/direct', protect, requireApproval, authorizeRoles('consumer'), createDirectOrder);
router.post('/auction', protect, requireApproval, authorizeRoles('consumer'), createAuctionOrder);
router.get('/my', protect, requireApproval, getMyOrders);
router.get('/farmer', protect, requireApproval, authorizeRoles('farmer'), getFarmerOrders);
router.put('/:id/status', protect, requireApproval, updateOrderStatus);

module.exports = router;
