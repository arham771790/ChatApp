import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshToken } from "../utils/utilsToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { uploadonCloudinary } from "../utils/cloudinary.js";

// Signup Route: Register a new user
const signupUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields (Full Name, Email, Password) are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "Email or Username already exists");
    }

    // Upload avatar and cover image to Cloudinary
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

    // const avatar = await uploadonCloudinary(avatarLocalPath);
    // if (!avatar) throw new ApiError(400, "Error uploading avatar image");

    // let coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;
    // let coverImage = coverImageLocalPath ? await uploadonCloudinary(coverImageLocalPath) : null;

    const user = await User.create({
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Error while registering user");

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Login Route: Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or Username is required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Exclude password and refreshToken from the response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
        sameSite: "strict",
    };

    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Logout Route: Log out a user
const logoutUser = asyncHandler(async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
            sameSite: "strict",
        };

        // Clear cookies
        return res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        throw new ApiError(500, "Logout failed");
    }
});

export { signupUser, loginUser, logoutUser };
