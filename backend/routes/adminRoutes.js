const express = require('express');
const router = express.Router();
const {
    getPendingUsers, getAllUsers, approveUser, disapproveUser,
    promoteToAdmin, changeUserRole, deleteUser,
    getPendingProducts, getAllProducts, approveProduct, rejectProduct, disapproveProduct, deleteProduct,
    getPlatformStats,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

// ── Platform Stats ──────────────────────────────
router.get('/stats', getPlatformStats);

// ── User Management ─────────────────────────────
router.get('/pending', getPendingUsers);
router.get('/users', getAllUsers);
router.put('/approve/:id', approveUser);
router.put('/disapprove/:id', disapproveUser);
router.put('/promote/:id', promoteToAdmin);
router.put('/role/:id', changeUserRole);
router.delete('/users/:id', deleteUser);

// ── Product Moderation ───────────────────────────
router.get('/products/pending', getPendingProducts);
router.get('/products', getAllProducts);
// add lightweight logger to help troubleshoot id/authorization issues
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);
router.put('/products/:id/disapprove', disapproveProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
