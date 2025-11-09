import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."]
    },
    message: {
      type: String,
      required: [true, "Message is required."]
    },
    photoType: {
      type: String,
      default: "general",
      lowercase: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: "website form"
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;