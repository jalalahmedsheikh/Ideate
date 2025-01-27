import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";

// Create a new poll
export const createPoll = async (req, res) => {
    try {
        const { question,options } = req.body
        const authorId = req.id

        if (!question || !options) {
            return res.status(400).json({
                success: false,
                message: "Field cannot be empty."
            })
        }
        const poll = await Poll.create({
            question,
            options,
            author: authorId
        })

        const userr = await User.findById(authorId)
        if (userr) {
            userr.polls.push(poll._id)
            await userr.save()
        }

        await poll.populate({ path: 'creator', select: '-password' })

        return res.status(201).json({
            success: true,
            poll,
            message: "New poll added."
        })

    } catch (error) {
        console.log(error);

    }
};

// Get all polls
export const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find()
            .sort({ createdAt: -1 })
            .populate({ path: "creator", select: "username profileImage" });

        return res.status(200).json({
            success: true,
            polls,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Get all polls created by the logged-in user
export const getUserPolls = async (req, res) => {
    try {
        const authorId = req.id;

        const polls = await Poll.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profileImage" });

        return res.status(200).json({
            success: true,
            polls,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Vote on a poll option
export const voteOnPoll = async (req, res) => {
    try {
        const userId = req.id;
        const pollId = req.params.id;
        const { optionIndex } = req.body;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        // Ensure a valid option is selected
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ success: false, message: "Invalid option index." });
        }

        // Check if the user has already voted
        if (poll.voters.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "You have already voted on this poll.",
            });
        }

        // Increment vote count for the selected option and add voter
        poll.options[optionIndex].votes += 1;
        poll.voters.push(userId);
        await poll.save();

        return res.status(200).json({
            success: true,
            message: "Vote registered successfully.",
            poll,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Delete a poll
export const deletePoll = async (req, res) => {
    try {
        const pollId = req.params.id;
        const userId = req.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        // Check if the logged-in user is the owner of the poll
        if (poll.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        // Delete the poll
        await Poll.findByIdAndDelete(pollId);

        // Remove poll from user's polls array
        const user = await User.findById(userId);
        user.polls = user.polls.filter((id) => id.toString() !== pollId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Poll deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Get poll details (with results)
export const getPollDetails = async (req, res) => {
    try {
        const pollId = req.params.id;

        const poll = await Poll.findById(pollId)
            .populate({ path: "author", select: "username profileImage" });

        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        return res.status(200).json({
            success: true,
            poll,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Save a poll to bookmarks
export const savePoll = async (req, res) => {
    try {
        const pollId = req.params.id;
        const userId = req.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        const user = await User.findById(userId);
        if (user.bookmarks.includes(poll._id)) {
            // If poll is already bookmarked, remove it
            user.bookmarks = user.bookmarks.filter((id) => id.toString() !== pollId);
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Poll removed from bookmarks.",
            });
        } else {
            // Otherwise, add to bookmarks
            user.bookmarks.push(poll._id);
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Poll saved to bookmarks.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};