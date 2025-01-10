import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import { signupUser,loginUser,logoutUser ,updateProfile,checkAuth} from "../controllers/user.controller.js";

const router = express.Router();// Create a new router
router.post('/signup', signupUser); // Signup route
router.post('/login', loginUser); // Login route
router.post('/logout', logoutUser); // Logout route
router.post('/updateProfile', protectRoute, updateProfile); // Protected updateProfile route
router.get('/check', protectRoute, checkAuth); // Protected check route

export default router;