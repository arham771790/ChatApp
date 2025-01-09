import express from "express";

const router = express.Router();// Create a new router

router.post('/signup', (req, res) => {
    res.send('Signup route');
});// Define the signup route
router.post('/login', (req, res) => {
    res.send('Login route');
});// Define the signup route
router.post('/logout', (req, res) => {
    res.send('Logout route');
});// Define the signup route

export default router;