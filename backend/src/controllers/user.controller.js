import User from '../models/user.model.js';
import path from 'path';

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update profile (name, phone, avatar)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const updates = {
            name: req.body.name,
            phone: req.body.phone,
        };

        // If a new avatar was uploaded
        if (req.file) {
            updates.avatar_url = `/uploads/${req.file.filename}`;
        }

        // Remove undefined fields
        Object.keys(updates).forEach(
            (k) => updates[k] === undefined && delete updates[k]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required.',
            });
        }

        // Fetch with password field
        const user = await User.findById(req.user.id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect.',
            });
        }

        user.password = newPassword;
        await user.save(); // triggers pre-save bcrypt hook

        res.status(200).json({
            success: true,
            message: 'Password updated successfully.',
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, role } = req.query;

        const filter = role ? { role } : {};
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            users,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
        });
    } catch (err) {
        next(err);
    }
};