import express from "express";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

connectDB();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password, profilePicture, bio } = req.body;

        // Validate required fields
        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'userName, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create new user (password will be hashed by pre-save hook)
        const newUser = await Users.create({
            userName,
            email,
            password,
            profilePicture: profilePicture || "",
            bio: bio || ""
        });

        // Don't send password in response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Don't send password in response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await Users.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await Users.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});

// Search users by userName or email
router.get('/search', async (req, res) => {
    try {
        const { userName, email } = req.query;

        const query = {};

        if (userName) {
            query.userName = { $regex: String(userName).trim(), $options: 'i' };
        }

        if (email) {
            query.email = { $regex: String(email).trim(), $options: 'i' };
        }

        const users = await Users.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search users', details: error.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Don't allow password update through this route (use separate change password route)
        const { password, ...updateData } = req.body;

        const updatedUser = await Users.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const deletedUser = await Users.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

export default router;
