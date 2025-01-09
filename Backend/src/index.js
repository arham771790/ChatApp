import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./utils/db.js";
dotenv.config();
const app = express();
const PORT=process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello World!");
}); 
app.use(express.json());// Parse JSON-encoded bodies 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});

app.use("/api/auth",authRoutes);