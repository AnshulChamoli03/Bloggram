import express from "express";
import Posts from "../models/post.model.js";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

connectDB();

const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Posts.find();
    res.json(posts);
});

router.post('/', async (req, res) => {
    try{
        const newPost = await Posts.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' }); 
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
        console.log("Successfully deleted post");
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});


export default router;

