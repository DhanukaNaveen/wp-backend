import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export async function registerUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({
        message: "Admin account already exists. Registration is disabled."
      });
    }

    const user = await User.create({ email, password, role: "admin" });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      message: "Admin registration successful."
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (isPasswordCorrect) {
      const token = generateToken(user._id, user.role);
      res.status(200).json({
        token,
        message: "Admin login successful.",
        id: user._id,
        role: user.role
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
}