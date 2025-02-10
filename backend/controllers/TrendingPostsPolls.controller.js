const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Helper function to calculate post score
const calculatePostScore = (post) => {
    const engagementScore = (post.likes * 1) + (post.comments * 2) + (post.shares * 3);
    const timeDecay = Math.exp(-0.00001 * (Date.now() - post.createdAt));
    return engagementScore * timeDecay;
};

// Feed API Route
router.get('/api/feed/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch user details (interests & seen posts)
        const user = await User.findById(userId).select("interests seenPosts");

        // Step 1: Get recommended posts based on user interests
        const recommendedPosts = await Post.find({ categories: { $in: user.interests } }).limit(10);

        // Step 2: Get trending posts (high engagement in a short time)
        const trendingPosts = await Post.find().sort({ 
            createdAt: -1, 
            trendingScore: -1 
        }).limit(5);

        // Step 3: Get recent posts (excluding seen posts)
        const freshPosts = await Post.find({ _id: { $nin: user.seenPosts } })
            .sort({ createdAt: -1 })
            .limit(10);

        // Combine posts and remove duplicates
        let feedPosts = [...recommendedPosts, ...trendingPosts, ...freshPosts];
        feedPosts = Array.from(new Set(feedPosts.map(p => p._id.toString()))).map(id => feedPosts.find(p => p._id.toString() === id));

        // Step 4: Rank posts using weighted score
        feedPosts.sort((a, b) => calculatePostScore(b) - calculatePostScore(a));

        // Update user's seen posts (store last 50)
        user.seenPosts = [...new Set([...user.seenPosts, ...feedPosts.map(p => p._id)])].slice(-50);
        await user.save();

        res.json(feedPosts);
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ error: "Error fetching feed" });
    }
});

module.exports = router;
