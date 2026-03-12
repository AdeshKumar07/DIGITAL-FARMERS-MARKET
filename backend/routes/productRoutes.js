const express = require('express');
const router = express.Router();
const {
    createProduct, getProducts, getProductById, getMyProducts, getProductImage, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles, requireApproval } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/my', protect, requireApproval, authorizeRoles('farmer'), getMyProducts);
router.get('/:id/image', getProductImage);
router.get('/:id', getProductById);
router.post('/', protect, requireApproval, authorizeRoles('farmer'), upload.single('image'), createProduct);
router.put('/:id', protect, requireApproval, authorizeRoles('farmer'), updateProduct);
router.delete('/:id', protect, requireApproval, authorizeRoles('farmer', 'admin'), deleteProduct);

module.exports = router;
