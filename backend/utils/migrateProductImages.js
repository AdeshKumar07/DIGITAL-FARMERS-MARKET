const fs = require('fs/promises');
const path = require('path');
const Product = require('../models/Product');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const MIME_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
};

const buildProductImageUrl = (productId) => `/api/products/${productId}/image`;

const getMimeTypeForFile = (filePath) => MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';

const migrateProductImages = async () => {
    const products = await Product.find({
        image: { $regex: '^/uploads/' },
        $or: [
            { imageContentType: '' },
            { imageContentType: { $exists: false } },
        ],
    }).select('_id image imageContentType');

    let migratedCount = 0;

    for (const product of products) {
        const fileName = path.basename(product.image);
        const filePath = path.join(uploadsDir, fileName);

        try {
            const imageData = await fs.readFile(filePath);

            if (!imageData.length) {
                continue;
            }

            product.imageData = imageData;
            product.imageContentType = getMimeTypeForFile(filePath);
            product.image = buildProductImageUrl(product._id);
            await product.save();
            migratedCount += 1;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Failed to migrate image for product ${product._id}: ${error.message}`);
            }
        }
    }

    if (migratedCount > 0) {
        console.log(`Migrated ${migratedCount} product image(s) into MongoDB storage.`);
    }
};

module.exports = { migrateProductImages, buildProductImageUrl };