import express from "express";
import {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
  toggleTestimonialVisibility
} from "../controllers/testimonialController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const testimonialRouter = express.Router();

// Public submission
testimonialRouter.post("/", createTestimonial);

// Public view (only visible testimonials)
testimonialRouter.get("/", getTestimonials);

// Admin view (all testimonials)
testimonialRouter.get("/admin", authMiddleware, (req, res) => {
  req.query.adminView = "true"; // Force admin view
  getTestimonials(req, res);
});

// Toggle visibility
testimonialRouter.patch("/:id", authMiddleware, toggleTestimonialVisibility);

// Delete testimonial
testimonialRouter.delete("/:id", authMiddleware, deleteTestimonial);

export default testimonialRouter;