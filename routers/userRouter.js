import express from "express";
import { loginUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.get("/check-auth", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Authenticated" });
});

export default userRouter;