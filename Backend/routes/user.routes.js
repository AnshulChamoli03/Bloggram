import express from "express";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

connectDB();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password, profilePicture, bio, mobile } = req.body;

        // Validate required fields
        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'userName, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Sanitize mobile number (remove spaces, dashes, etc.)
        let sanitizedMobile = "";
        if (mobile) {
            sanitizedMobile = mobile.replace(/\D/g, ""); // Remove all non-digit characters
        }

        // Create new user (password will be hashed by pre-save hook)
        const newUser = await Users.create({
            userName,
            email,
            password,
            profilePicture: profilePicture || "",
            bio: bio || "",
            mobile: sanitizedMobile || ""
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
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: 'Validation failed', details: validationErrors });
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

        // Validate user has a valid ID
        if (!user._id || !mongoose.isValidObjectId(user._id)) {
            return res.status(500).json({ error: 'Invalid user data', details: 'User ID is missing or invalid' });
        }

        // Don't send password in response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id.toString(),
                email: user.email 
            }, 
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '7d' } // Token expires in 7 days
        );
        
        res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token: token
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

// Get current user profile (requires authentication)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;

        // Validate userId exists and format
        if (!userId) {
            return res.status(400).json({ 
                error: 'Invalid user ID in token',
                details: 'Token does not contain a valid userId. Please login again.'
            });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID in token',
                details: `User ID format is invalid: ${userId}. Please login again.`
            });
        }

        const user = await Users.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found',
                details: 'The user associated with this token no longer exists. Please login again.'
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
    }
});

// Update current user profile (requires authentication)
router.put('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;

        // Validate userId exists and format
        if (!userId) {
            return res.status(400).json({ 
                error: 'Invalid user ID in token',
                details: 'Token does not contain a valid userId. Please login again.'
            });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID in token',
                details: `User ID format is invalid: ${userId}. Please login again.`
            });
        }

        // Don't allow password update through this route (use separate change password route)
        const { password, email, ...updateData } = req.body;

        // Prevent email changes through this endpoint
        if (email !== undefined) {
            return res.status(400).json({ error: 'Email cannot be changed through this endpoint' });
        }

        // Sanitize mobile number if provided (remove spaces, dashes, etc.)
        if (updateData.mobile !== undefined) {
            if (updateData.mobile) {
                updateData.mobile = updateData.mobile.replace(/\D/g, ""); // Remove all non-digit characters
            } else {
                updateData.mobile = ""; // Allow clearing mobile by setting to empty string
            }
        }

        // Check if user exists first
        const existingUser = await Users.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ 
                error: 'User not found',
                details: 'The user associated with this token no longer exists. Please login again.'
            });
        }

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
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

// Get current user's connections (requires authentication)
router.get('/me/connections', authenticateToken, async (req, res) => {
    try {
        const user = await Users.findById(req.user.userId).select('connections');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Populate connections with user details
        const connections = await Users.find({
            _id: { $in: user.connections || [] }
        }).select('-password');

        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch connections', details: error.message });
    }
});

// Add or remove connection (requires authentication)
router.post('/me/connections/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user.userId;

        // Validate target user ID
        if (!mongoose.isValidObjectId(targetUserId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Prevent self-connection
        if (currentUserId === targetUserId) {
            return res.status(400).json({ error: 'Cannot connect to yourself' });
        }

        // Check if target user exists
        const targetUser = await Users.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get current user
        const currentUser = await Users.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // Check if already connected
        const isConnected = currentUser.connections.includes(targetUserId);
        
        if (isConnected) {
            // Remove connection (both ways)
            currentUser.connections = currentUser.connections.filter(
                id => id.toString() !== targetUserId
            );
            targetUser.connections = targetUser.connections.filter(
                id => id.toString() !== currentUserId
            );
            await currentUser.save();
            await targetUser.save();
            
            res.status(200).json({ 
                message: 'Connection removed successfully',
                connected: false
            });
        } else {
            // Add connection (both ways)
            currentUser.connections.push(targetUserId);
            targetUser.connections.push(currentUserId);
            await currentUser.save();
            await targetUser.save();
            
            res.status(200).json({ 
                message: 'Connection added successfully',
                connected: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update connection', details: error.message });
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

// Update user (requires authentication - can only update own profile)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Check if user is updating their own profile
        if (req.user.userId !== id) {
            return res.status(403).json({ error: 'You can only update your own profile' });
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

// Delete user (requires authentication - can only delete own account)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Check if user is deleting their own account
        if (req.user.userId !== id) {
            return res.status(403).json({ error: 'You can only delete your own account' });
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
