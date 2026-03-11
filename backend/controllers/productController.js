const Product = require('../models/Product');

// @desc  Create product
// @route POST /api/products
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, location, quantity, unit, type, biddingEndTime } =
            req.body;

        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const product = await Product.create({
            name,
            description,
            price,
            category,
            location,
            quantity,
            unit,
            type,
            biddingEndTime: type === 'bidding' ? biddingEndTime : undefined,
            image,
            farmerId: req.user._id,
            farmerName: req.user.name,
        });

        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

// @desc  Get all products (with optional filters)
// @route GET /api/products
const getProducts = async (req, res, next) => {
    try {
        const { category, type, location, minPrice, maxPrice, search } = req.query;
        // Public should only see approved products
        const filter = { isApproved: true };

        if (category) filter.category = category;
        if (type) filter.type = type;
        if (location) filter.location = { $regex: location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };

        const products = await Product.find(filter)
            .populate('farmerId', 'name email location')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        next(err);
    }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'farmerId',
            'name email location'
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// @desc  Get farmer's own products
// @route GET /api/products/my
const getMyProducts = async (req, res, next) => {
    try {
        // Farmer sees all their products status
        const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        next(err);
    }
};


// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Only allow updating specific fields to prevent mass assignment
        const allowedFields = ['name', 'description', 'price', 'category', 'location', 'quantity', 'unit', 'type', 'biddingEndTime'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// @desc  Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (err) {
        next(err);
    }
};

module.exports = { createProduct, getProducts, getProductById, getMyProducts, updateProduct, deleteProduct };
