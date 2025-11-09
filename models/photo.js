import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    // --- Core Information ---
    // Mongoose will auto-generate an _id, so we remove the manual photoId.
    title: { 
        type: String, 
        required: [true, "Title is required."] 
    },
    description: { 
        type: String, 
        default: "" 
    },
    imageUrl: { 
        type: String, 
        required: [true, "Image URL is required."]
    },
    
    // --- Categorization & Search ---
    category: { 
        type: String, 
        required: [true, "Category is required."], 
        default: "general",
        lowercase: true,
        trim: true
    },
    tags: { 
        type: [String], 
        default: [] 
    },
    
    // --- Admin Control for Frontend Display ---
    isFeatured: { 
        type: Boolean, 
        default: false,
        // If true, the photo appears in the 'Featured Images' section.
    },
    displayOrder: { 
        type: Number, 
        default: 9999, // A high number so that photos without an explicit order fall to the end.
        min: 0, // Order 0, 1, 2, 3, etc.
        // This is the new field for Admin to set the frontend showing order.
    },
    isVisible: { 
        type: Boolean, 
        default: true 
    }, // Allows Admin to unpublish without deleting
    
    // --- Metadata (Simplified) ---
    // We rely on Mongoose's built-in timestamps instead of a manual dateUploaded.
    photographerId: { // If you plan to expand to multiple admins/users
        type: mongoose.Schema.Types.ObjectId, // Recommended to use ObjectID reference
        ref: 'User', 
        default: null
    }
}, {
    // This adds 'createdAt' (for dateUploaded) and 'updatedAt' automatically
    timestamps: true 
});

// Use "Photo" as the model name. Mongoose will pluralize this to create the 'photos' collection.
const Photo = mongoose.model("Photo", photoSchema);
export default Photo;