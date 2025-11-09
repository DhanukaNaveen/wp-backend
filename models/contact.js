import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    // Client Information (Required)
    name: { 
        type: String, 
        required: [true, "Name is required."] 
    },
    email: { 
        type: String, 
        required: [true, "Email is required."],
        lowercase: true, // Store emails in lowercase
        trim: true
    },
    message: { 
        type: String, 
        required: [true, "Message is required."] 
    },
    
    // Optional/Specific Inquiry Details
    shootType: { 
        type: String, 
        default: "general",
        // Consider adding an enum for defined types: enum: ['wedding', 'portrait', 'event', 'general']
    },
    preferredDate: { 
        type: Date 
    },
    budget: { 
        type: String 
    },
    phone: { 
        type: String 
    },

    // Metadata
    isRead: { // NEW FIELD: Helpful for Admin to track which messages they've reviewed
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Use built-in timestamps for better tracking (createdAt/updatedAt)
});

// Use "Contact" as the model name. Mongoose pluralizes this to create the 'contacts' collection.
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;