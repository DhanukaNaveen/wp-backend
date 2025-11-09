import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import userRouter from "./routers/userRouter.js";
import photoRouter from "./routers/photoRouter.js";
import contactRouter from "./routers/contactRouter.js";
import testimonialRouter from "./routers/testimonialRouter.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

app.use("/api/auth", userRouter);
app.use("/api/photos", photoRouter);
app.use("/api/contact", contactRouter);
app.use("/api/testimonials", testimonialRouter);

app.get("/", (req, res) => {
  res.send("Photographer Website API is running.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));