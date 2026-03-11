const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating password/role...');
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin';
            existingAdmin.isApproved = true;
            await existingAdmin.save();
        } else {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isApproved: true,
                location: 'Head Office'
            });
            console.log('Admin account created successfully!');
        }

        console.log(`Admin Email: ${adminEmail}`);
        console.log('Admin Password: [set in .env]');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
