import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utills/multer.js'
import { addComment, addNewPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUserPosts, likePost, SavePost } from '../controllers/post.controller.js'

const router = express.Router()

router.route("/createPost").post(isAuthenticated, upload.single('post'),addNewPost)
router.route("/allposts").get(isAuthenticated,getAllPosts)
router.route("/userpost/all").get(isAuthenticated,getUserPosts)
router.route("/:id/like").post(isAuthenticated, likePost);
router.route("/:id/dislike").post(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").get(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/savepost").post(isAuthenticated, SavePost);

export default router;