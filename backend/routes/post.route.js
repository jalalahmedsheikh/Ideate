import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utills/multer.js'
import { addComment, addNewPost, deletePost, getAllPosts, getAllPostsOfFollowing, getCommentsOfPost, getOtherUserPosts, getSinglePost, getUserPosts, SavePost, sharePost, toggleLikePost } from '../controllers/post.controller.js'

const router = express.Router()

router.route("/createPost").post(isAuthenticated, upload.single('post'),addNewPost)
router.route("/allposts").get(getAllPosts)
router.route("/:id").get(getSinglePost)
router.route("/followings").get(getAllPostsOfFollowing)
router.route("/userpost/all").get(isAuthenticated,getUserPosts)
router.route("/userpost/all/:id").get(getOtherUserPosts)
router.route("/:id/like").post(isAuthenticated,toggleLikePost);
// router.route("/:id/dislike").post(unlikePost);
router.route("/share/:id").post(isAuthenticated, sharePost);
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").get(getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/savepost").post(isAuthenticated, SavePost);

export default router;