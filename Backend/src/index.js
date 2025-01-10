import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"
import connectDB from "./utils/db.js";
dotenv.config();
const app = express();
const PORT=process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello World!");
}); 
app.use(cookieParser());// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(express.json());// Parse JSON-encoded bodies 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});

app.use("/api/auth",authRoutes);// Use the auth routes for all routes starting with /api/auth containing signup, login, logout, updateProfile and checkAuth routes
app.use("/api/message",messageRoutes);// Use the message routes for all routes starting with /api/message containing sendMessage and getMessages routes