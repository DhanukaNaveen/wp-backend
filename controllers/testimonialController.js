import Testimonial from "../models/testimonial.js";

// Create a new testimonial (public)
export async function createTestimonial(req, res) {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({
      message: "Thank you! Your testimonial has been submitted for review.",
      testimonial
    });
  } catch (error) {
    console.error("Create error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to submit testimonial." });
  }
}

// Get testimonials (public or admin)
export async function getTestimonials(req, res) {
  try {
    const isAdmin = req.user || req.query.adminView === "true";
    const filter = isAdmin ? {} : { isVisible: true };

    const testimonials = await Testimonial.find(filter).sort({
      isVisible: -1,
      createdAt: -1
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch testimonials." });
  }
}

// Toggle visibility (admin)
export async function toggleTestimonialVisibility(req, res) {
  try {
    const { isVisible } = req.body;
    const testimonialId = req.params.id;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({ message: "'isVisible' must be a boolean." });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      testimonialId,
      { isVisible },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    res.status(200).json({
      message: `Testimonial visibility set to ${isVisible ? "visible" : "hidden"}.`,
      testimonial
    });
  } catch (error) {
    console.error("Visibility toggle error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid testimonial ID." });
    }
    res.status(500).json({ message: "Failed to update testimonial visibility." });
  }
}

// Delete testimonial (admin)
export async function deleteTestimonial(req, res) {
  try {
    const testimonialId = req.params.id;
    const testimonial = await Testimonial.findByIdAndDelete(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    res.status(200).json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid testimonial ID." });
    }
    res.status(500).json({ message: "Failed to delete testimonial." });
  }
}