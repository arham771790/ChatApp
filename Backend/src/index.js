import express from "express";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
}); 
app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
app.use("/api/auth",authRoutes);