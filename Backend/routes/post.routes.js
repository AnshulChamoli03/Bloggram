import express from "express";
import Posts from "../models/post.model.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find().populate('user', 'userName profilePicture').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { user: userId, userName, content, hashtags } = req.body;
        const authenticatedUserId = req.user?.userId;

        // Validate required fields - allow posts with only media or only text
        if (!content || typeof content !== 'object') {
            return res.status(400).json({ error: 'Post content is required' });
        }

        // Text is optional, media is optional, but at least one must be provided
        const hasText = content.text !== undefined && content.text !== null && String(content.text).trim().length > 0;
        const hasMedia = content.media && Array.isArray(content.media) && content.media.length > 0;
        
        if (!hasText && !hasMedia) {
            return res.status(400).json({ error: 'Post must have either text content or media' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!userName) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Validate user ID format
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Verify that the authenticated user matches the userId in the request
        if (authenticatedUserId !== userId) {
            return res.status(403).json({ error: 'You can only create posts for yourself' });
        }

        // Verify user exists
        const userExists = await Users.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate media URLs if provided
        if (content.media && Array.isArray(content.media)) {
            const invalidUrls = content.media.filter(url => !/^https?:\/\/.+/.test(url));
            if (invalidUrls.length > 0) {
                return res.status(400).json({ 
                    error: 'Invalid media URLs. All URLs must start with http:// or https://',
                    invalidUrls 
                });
            }
        }

        // Validate hashtags format if provided
        if (hashtags && Array.isArray(hashtags) && hashtags.length > 0) {
            const invalidTags = hashtags.filter(tag => {
                // Check if tag is a string and matches the required format
                if (typeof tag !== 'string') return true;
                return !/^#[a-z0-9_]+$/i.test(tag);
            });
            if (invalidTags.length > 0) {
                return res.status(400).json({ 
                    error: 'Invalid hashtag format. Hashtags must start with # and contain only letters, numbers, or underscores',
                    details: [`Invalid hashtags: ${invalidTags.join(', ')}`],
                    invalidTags 
                });
            }
        }
        
        // Ensure hashtags is an array (even if empty)
        const finalHashtags = Array.isArray(hashtags) ? hashtags : [];

        // Create post
        // Text is optional - use empty string if not provided or empty
        let finalText = '';
        if (content && content.text !== undefined && content.text !== null) {
            const trimmed = String(content.text).trim();
            finalText = trimmed;
        }
        
        // Ensure media is an array with valid URLs or empty array
        const finalMedia = Array.isArray(content.media) ? content.media.filter(url => url && typeof url === 'string') : [];
        
        const newPost = await Posts.create({
            user: userId,
            userName,
            content: {
                text: finalText,
                media: finalMedia
            },
            hashtags: finalHashtags
        });

        // Update user's posts array
        await Users.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id }
        });

        // Populate user data in response
        const populatedPost = await Posts.findById(newPost._id).populate('user', 'userName profilePicture');

        res.status(201).json(populatedPost);
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validationErrors 
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate post detected' });
        }

        res.status(500).json({ 
            error: 'Failed to create post', 
            details: error.message 
        }); 
    }
});

// Search posts by optional query params: hashtags (comma-separated), text, user (ObjectId)
router.get('/search', async (req, res) => {
    try {
        const { hashtags, text, user } = req.query;

        const query = {};

        if (hashtags) {
            const tags = (Array.isArray(hashtags) ? hashtags : String(hashtags).split(','))
                .map(t => t.trim())
                .filter(Boolean)
                .map(t => (t.startsWith('#') ? t : `#${t}`));
            if (tags.length > 0) {
                const tagRegexes = tags.map(t => new RegExp(`^${t}$`, 'i'));
                query.hashtags = { $in: tagRegexes };
            }
        }

        if (text && String(text).trim().length > 0) {
            query['content.text'] = { $regex: String(text).trim(), $options: 'i' };
        }

        if (user) {
            if (!mongoose.isValidObjectId(user)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }
            query.user = user;
        }

        const posts = await Posts.find(query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search posts' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return;
    }

    try{
        const updatedPost = await Posts.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const post = await Posts.findByIdAndDelete(id);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});


export default router;

