const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        image: { type: String, default: '' },
        imageContentType: { type: String, default: '' },
        imageData: { type: Buffer, select: false },
        price: { type: Number, required: true },
        category: {
            type: String,
            enum: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Others'],
            required: true,
        },
        location: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'kg' },
        type: { type: String, enum: ['direct', 'bidding'], default: 'direct' },
        biddingEndTime: { type: Date },
        isBiddingOpen: { type: Boolean, default: true },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        farmerName: { type: String },
        // Admin moderation
        isApproved: { type: Boolean, default: false },
        isRejected: { type: Boolean, default: false },
        rejectionReason: { type: String, default: '' },
        adminNote: { type: String, default: '' },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

