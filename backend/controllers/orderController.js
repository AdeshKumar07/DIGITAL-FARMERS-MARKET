const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc  Create direct buy order
// @route POST /api/orders/direct
const createDirectOrder = async (req, res, next) => {
    try {
        const { productId, quantity, shippingAddress } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product is not available', available: false });
        if (product.type !== 'direct') return res.status(400).json({ message: 'Use auction order for bidding products' });
        if (product.quantity < quantity) return res.status(400).json({ message: `Only ${product.quantity} ${product.unit || 'kg'} available`, available: false });

        const amount = product.price * quantity;

        const order = await Order.create({
            productId,
            buyerId: req.user._id,
            farmerId: product.farmerId,
            type: 'direct',
            quantity,
            amount,
            status: 'placed',
            shippingAddress,
        });

        // Reduce stock
        await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });

        res.status(201).json({ message: 'Order placed successfully!', order, available: true });
    } catch (err) {
        next(err);
    }
};

// @desc  Create auction order (winning bid checkout)
// @route POST /api/orders/auction
const createAuctionOrder = async (req, res, next) => {
    try {
        const { productId, amount, shippingAddress } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const order = await Order.create({
            productId,
            buyerId: req.user._id,
            farmerId: product.farmerId,
            type: 'auction',
            quantity: 1,
            amount,
            status: 'placed',
            shippingAddress,
        });

        res.status(201).json({ message: 'Auction order placed successfully!', order, available: true });
    } catch (err) {
        next(err);
    }
};

// @desc  Get my orders (as buyer)
// @route GET /api/orders/my
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ buyerId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('productId', 'name image price category')
            .populate('farmerId', 'name location');
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// @desc  Get orders for farmer
// @route GET /api/orders/farmer
const getFarmerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ farmerId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('productId', 'name image category')
            .populate('buyerId', 'name email location');
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = { createDirectOrder, createAuctionOrder, getMyOrders, getFarmerOrders, updateOrderStatus };
