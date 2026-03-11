const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ─────── USER MANAGEMENT ───────

// @desc  Get all pending users
// @route GET /api/admin/pending
const getPendingUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isApproved: false, role: { $ne: 'admin' } })
            .select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { next(err); }
};

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { next(err); }
};

// @desc  Approve a user
// @route PUT /api/admin/approve/:id
const approveUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { isApproved: true }, { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `${user.name} approved successfully`, user });
    } catch (err) { next(err); }
};

// @desc  Disapprove/suspend a user (revoke approval without deleting)
// @route PUT /api/admin/disapprove/:id
const disapproveUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { isApproved: false }, { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `${user.name} suspended`, user });
    } catch (err) { next(err); }
};

// @desc  Promote farmer to admin
// @route PUT /api/admin/promote/:id
const promoteToAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Already an admin' });
        user.role = 'admin';
        user.isApproved = true;
        await user.save();
        const result = user.toObject();
        delete result.password;
        res.json({ message: `${user.name} promoted to admin`, user: result });
    } catch (err) { next(err); }
};

// @desc  Change user role (farmer ↔ consumer)
// @route PUT /api/admin/role/:id
const changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['farmer', 'consumer'].includes(role))
            return res.status(400).json({ message: 'Role must be farmer or consumer' });
        const user = await User.findByIdAndUpdate(
            req.params.id, { role }, { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `Role changed to ${role}`, user });
    } catch (err) { next(err); }
};

// @desc  Delete/ban a user permanently
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot remove another admin' });
        await user.deleteOne();
        // Also remove their products
        await Product.deleteMany({ farmerId: user._id });
        res.json({ message: `${user.name} has been permanently removed` });
    } catch (err) { next(err); }
};

// ─────── PRODUCT MODERATION ───────

// @desc  Get all products pending admin review
// @route GET /api/admin/products/pending
const getPendingProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isApproved: false, isRejected: false })
            .populate('farmerId', 'name email location')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) { next(err); }
};

// @desc  Get all products (for admin overview)
// @route GET /api/admin/products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('farmerId', 'name email location')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) { next(err); }
};

// @desc  Approve a product
// @route PUT /api/admin/products/:id/approve
const approveProduct = async (req, res, next) => {
    try {
        // handle case where body may be undefined on PUT
        const { adminNote } = req.body || {};

        // validate id format first
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // update approval fields explicitly and save
        product.isApproved = true;
        product.isRejected = false;
        product.rejectionReason = '';
        product.adminNote = adminNote || '';
        product.approvedBy = req.user._id;
        product.approvedAt = new Date();
        // keep any future `status` enum in sync if added later
        if (product.schema && product.schema.path('status')) {
            product.status = 'approved';
        }

        await product.save();

        // return updated document along with standard success shape
        res.json({ success: true, message: 'Product approved successfully', product });
    } catch (err) {
        console.error('approveProduct error:', err);
        next(err);
    }
};

// @desc  Reject a product
// @route PUT /api/admin/products/:id/reject
const rejectProduct = async (req, res, next) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ message: 'Rejection reason is required' });
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isApproved: false, isRejected: true, rejectionReason: reason },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: `"${product.name}" rejected`, product });
    } catch (err) { next(err); }
};

// @desc  Disapprove a live product (pull it from marketplace)
// @route PUT /api/admin/products/:id/disapprove
const disapproveProduct = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isApproved: false, isRejected: false, rejectionReason: reason || 'Pulled by admin' },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: `"${product.name}" pulled from marketplace`, product });
    } catch (err) { next(err); }
};

// @desc  Delete a product permanently
// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product permanently deleted' });
    } catch (err) { next(err); }
};

// ─────── PLATFORM STATS ───────

// @desc  Admin platform overview stats
// @route GET /api/admin/stats
const getPlatformStats = async (req, res, next) => {
    try {
        const [
            totalUsers, pendingUsers, totalFarmers, totalConsumers,
            totalProducts, pendingProducts, approvedProducts,
            totalOrders, deliveredOrders
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ isApproved: false, role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'farmer' }),
            User.countDocuments({ role: 'consumer' }),
            Product.countDocuments(),
            Product.countDocuments({ isApproved: false, isRejected: false }),
            Product.countDocuments({ isApproved: true }),
            Order.countDocuments(),
            Order.countDocuments({ status: 'delivered' }),
        ]);

        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({
            totalUsers, pendingUsers, totalFarmers, totalConsumers,
            totalProducts, pendingProducts, approvedProducts,
            totalOrders, deliveredOrders, totalRevenue,
        });
    } catch (err) { next(err); }
};

module.exports = {
    getPendingUsers, getAllUsers, approveUser, disapproveUser,
    promoteToAdmin, changeUserRole, deleteUser,
    getPendingProducts, getAllProducts, approveProduct, rejectProduct, disapproveProduct, deleteProduct,
    getPlatformStats,
};
