const { User } = require('../models/User');
const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Event = require('../models/Event');
const Offer = require('../models/Offer');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// --- User Management ---

// 1. Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Create a new user (usually a Boutique owner)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, profile } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            profile: profile || 'SHOP', // Default to SHOP role if created by Admin
            status: 1 // 1 = Active
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Change user status (activate, suspend, delete)
// Status map: 1 = Active, 2 = Suspended, 0 = Inactive/Deleted (or hard delete)
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json({ message: 'User status updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { profile } = req.body;
        const validProfiles = ['ADMIN', 'SHOP', 'CUSTOMER'];

        if (!validProfiles.includes(profile)) {
            return res.status(400).json({ message: 'Invalid profile role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profile = profile;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Update user details (name, email, profile, password)
exports.updateUser = async (req, res) => {
    try {
        const { name, email, profile, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (profile) user.profile = profile;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Dashboard Stats ---

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeStores = await Shop.countDocuments();
        const newCustomers = await User.countDocuments({ profile: 'CUSTOMER', status: 1 });
        const pendingOffers = await Offer.countDocuments({ status: { $ne: 'VALIDATED' } });

        res.json({
            stats: [
                { title: 'Boutiques Actives', value: activeStores, icon: 'storefront' },
                { title: 'Utilisateurs Totaux', value: totalUsers, icon: 'people' },
                { title: 'Nouveaux Clients', value: newCustomers, icon: 'person_add' },
                { title: 'Demandes en Attente', value: pendingOffers, icon: 'pending_actions' }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Category Management ---

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = new Category({ name: req.body.name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Shop Management for Admin ---

exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find()
            .populate('idOwner', 'name email')
            .populate('idCategory', 'name');
        res.json(shops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createShop = async (req, res) => {
    try {
        const shop = new Shop(req.body);
        await shop.save();
        res.status(201).json(shop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(shop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteShop = async (req, res) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shop deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Event Management ---

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Offers Validation & Management ---

exports.getPendingOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ status: { $ne: 'VALIDATED' } });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOfferStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const offer = await Offer.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(offer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Reviews Moderation ---

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name email');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
