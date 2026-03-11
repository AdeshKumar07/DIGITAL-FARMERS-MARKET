const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['direct', 'auction'], required: true },
        quantity: { type: Number, default: 1 },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
        shippingAddress: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
