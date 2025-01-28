import express from 'express'
import { getUserProfile, login, logout, register, suggestedUsers, toggleFollow, updateProfile, getSingleUser } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from "../utills/multer.js";

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile").get(isAuthenticated,getUserProfile)
router.route("/profile/:id").get(getSingleUser)
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"),updateProfile)
router.route("/toggleFollow").post(isAuthenticated,toggleFollow)
router.route("/suggestions").get(isAuthenticated,suggestedUsers)

export default router;