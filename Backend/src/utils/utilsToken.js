import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

export { generateAccessAndRefreshToken };
