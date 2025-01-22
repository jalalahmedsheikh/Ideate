import { Post } from "../models/post.model.js";
import { Poll } from "../models/poll.model.js";

const getTrendingPostsPolls = async (req, res) => {
    try {
        const loggedInUserId = req.id;

        // Use aggregation pipeline to perform all operations at the database level
        const postsAndPolls = await Promise.all([
            Post.aggregate([
                { $match: { author: { $ne: loggedInUserId } } },
                {
                    $project: {
                        type: { $literal: 'post' },
                        likes: { $size: { $ifNull: ["$likes", []] } },
                        comments: { $size: { $ifNull: ["$comments", []] } },
                        createdAt: 1,
                    }
                },
                { $sort: { createdAt: -1 } }
            ]),

            Poll.aggregate([
                { $match: { creator: { $ne: loggedInUserId } } },
                {
                    $project: {
                        type: { $literal: 'poll' },
                        likes: { $size: { $ifNull: ["$likes", []] } },
                        comments: { $size: { $ifNull: ["$comments", []] } },
                        createdAt: 1,
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
        ]);

        // Combine posts and polls
        const combined = [...postsAndPolls[0], ...postsAndPolls[1]];

        // Map combined results and calculate engagement scores
        const scored = combined.map((item) => {
            const ageInMilliseconds = Date.now() - new Date(item.createdAt).getTime();
            const ageInHours = ageInMilliseconds / (1000 * 60 * 60);

            // Calculate the engagement score based on likes and comments
            const engagementScore = (
                item.likes * 2 + item.comments * 3
            ) / (ageInHours + 1);

            return { item, score: engagementScore };
        });

        // Sort by score in descending order
        const sorted = scored.sort((a, b) => b.score - a.score).map(({ item }) => item);

        return res.status(200).json({
            success: true,
            data: sorted,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch posts and polls.",
        });
    }
};

export default getTrendingPostsPolls;
