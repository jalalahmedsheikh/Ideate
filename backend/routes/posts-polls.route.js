import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import getTrendingPostsPolls  from "../controllers/TrendingPostsPolls.controller.js";

const router = express.Router();

// Route to get all posts and polls except the logged-in user's
router.route("/trending-posts-polls").get(getTrendingPostsPolls);


export default router;
