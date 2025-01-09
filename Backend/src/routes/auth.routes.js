import express from "express";
import { signupUser,loginUser,logoutUser } from "../controllers/user.controller.js";
const router = express.Router();// Create a new router

router.post('/signup', signupUser);// Define the signup route
router.post('/login', loginUser);// Define the login route
router.post('/logout', logoutUser);// Define the logout route

export default router;