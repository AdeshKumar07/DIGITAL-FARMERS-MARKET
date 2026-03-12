const Order = require('../models/Order');
const Product = require('../models/Product');

const VALID_TRANSITIONS = {
    placed: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};

// @desc  Create direct buy order
// @route POST /api/orders/direct
const createDirectOrder = async (req, res, next) => {
    try {
        const { productId, quantity, shippingAddress } = req.body;

        if (!productId || !quantity || !shippingAddress) {
            return res.status(400).json({ message: 'Product ID, quantity, and shipping address are required' });
        }

        if (quantity < 1 || !Number.isInteger(Number(quantity))) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }

        const trimmedAddress = String(shippingAddress).trim();
        if (trimmedAddress.length < 5 || trimmedAddress.length > 500) {
            return res.status(400).json({ message: 'Shipping address must be between 5 and 500 characters' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product is not available', available: false });
        if (product.type !== 'direct') return res.status(400).json({ message: 'Use auction order for bidding products' });

        // Atomic stock deduction to prevent race conditions
        const updated = await Product.findOneAndUpdate(
            { _id: productId, quantity: { $gte: Number(quantity) } },
            { $inc: { quantity: -Number(quantity) } },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.quantity} ${product.unit || 'kg'} available`, available: false });
        }

        const amount = product.price * Number(quantity);

        const order = await Order.create({
            productId,
            buyerId: req.user._id,
            farmerId: product.farmerId,
            type: 'direct',
            quantity: Number(quantity),
            amount,
            status: 'placed',
            shippingAddress: trimmedAddress,
        });

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

        if (!productId || !amount || !shippingAddress) {
            return res.status(400).json({ message: 'Product ID, amount, and shipping address are required' });
        }

        const trimmedAddress = String(shippingAddress).trim();
        if (trimmedAddress.length < 5 || trimmedAddress.length > 500) {
            return res.status(400).json({ message: 'Shipping address must be between 5 and 500 characters' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const order = await Order.create({
            productId,
            buyerId: req.user._id,
            farmerId: product.farmerId,
            type: 'auction',
            quantity: 1,
            amount: Number(amount),
            status: 'placed',
            shippingAddress: trimmedAddress,
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
        if (!status) return res.status(400).json({ message: 'Status is required' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Validate state transition
        const allowed = VALID_TRANSITIONS[order.status];
        if (!allowed || !allowed.includes(status)) {
            return res.status(400).json({ message: `Cannot change status from '${order.status}' to '${status}'` });
        }

        order.status = status;
        if (status === 'delivered') {
            order.paymentStatus = 'paid';
        }
        await order.save();
        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = { createDirectOrder, createAuctionOrder, getMyOrders, getFarmerOrders, updateOrderStatus };
