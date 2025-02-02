import express from 'express'
import { getUserProfile, login, logout, register, suggestedUsers, toggleFollow, updateProfile, getSingleUser, checkUsernameAvailability } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from "../utills/multer.js";

const router = express.Router()

router.route("/register").post(register)
router.post('/check-username', checkUsernameAvailability); // Check if username is available
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile").get(isAuthenticated,getUserProfile)
router.route("/profile/:id").get(getSingleUser)
router.route("/profile/update").put(updateProfile)
router.route("/toggleFollow").post(isAuthenticated,toggleFollow)
router.route("/suggestions").get(isAuthenticated,suggestedUsers)

export default router;