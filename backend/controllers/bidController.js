const Bid = require('../models/Bid');
const Product = require('../models/Product');

// @desc  Place a bid
// @route POST /api/bids
const placeBid = async (req, res, next) => {
    try {
        const { productId, amount } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.type !== 'bidding') return res.status(400).json({ message: 'This product is not for bidding' });
        if (!product.isBiddingOpen) return res.status(400).json({ message: 'Bidding has closed' });
        if (product.biddingEndTime && new Date() > product.biddingEndTime) {
            await Product.findByIdAndUpdate(productId, { isBiddingOpen: false });
            return res.status(400).json({ message: 'Bidding time has expired' });
        }

        // Check minimum increment (min 5% above current highest)
        const highest = await Bid.findOne({ productId }).sort({ amount: -1 });
        const minBid = highest ? highest.amount * 1.05 : product.price;

        if (amount < minBid) {
            return res.status(400).json({
                message: `Bid must be at least ₹${Math.ceil(minBid).toLocaleString('en-IN')}`,
            });
        }

        const bid = await Bid.create({
            productId,
            bidderId: req.user._id,
            bidderName: req.user.name,
            amount,
        });

        res.status(201).json(bid);
    } catch (err) {
        next(err);
    }
};

// @desc  Get bid history for a product
// @route GET /api/bids/:productId
const getBidHistory = async (req, res, next) => {
    try {
        const bids = await Bid.find({ productId: req.params.productId })
            .sort({ amount: -1 })
            .populate('bidderId', 'name');
        res.json(bids);
    } catch (err) {
        next(err);
    }
};

// @desc  Get highest bid for a product
// @route GET /api/bids/:productId/highest
const getHighestBid = async (req, res, next) => {
    try {
        const bid = await Bid.findOne({ productId: req.params.productId })
            .sort({ amount: -1 })
            .populate('bidderId', 'name');
        res.json(bid || { amount: null });
    } catch (err) {
        next(err);
    }
};

// @desc  Get my bids
// @route GET /api/bids/my
const getMyBids = async (req, res, next) => {
    try {
        const bids = await Bid.find({ bidderId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('productId', 'name image price biddingEndTime isBiddingOpen');
        res.json(bids);
    } catch (err) {
        next(err);
    }
};

module.exports = { placeBid, getBidHistory, getHighestBid, getMyBids };
