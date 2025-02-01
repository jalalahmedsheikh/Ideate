import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utills/multer.js'
import { addComment, addNewPost, deletePost, dislikePost, getAllPosts, getAllPostsOfFollowing, getCommentsOfPost, getOtherUserPosts, getSinglePost, getUserPosts, likePost, SavePost, sharePost } from '../controllers/post.controller.js'

const router = express.Router()

router.route("/createPost").post(isAuthenticated, upload.single('post'),addNewPost)
router.route("/allposts").get(getAllPosts)
router.route("/:id").get(getSinglePost)
router.route("/followings").get(getAllPostsOfFollowing)
router.route("/userpost/all").get(isAuthenticated,getUserPosts)
router.route("/userpost/all/:id").get(getOtherUserPosts)
router.route("/:id/like").post(isAuthenticated, likePost);
router.route("/:id/dislike").post(isAuthenticated, dislikePost);
router.route("/share/:id").post(isAuthenticated, sharePost);
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").get(getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/savepost").post(isAuthenticated, SavePost);

export default router;