import Photo from "../models/Photo.js";

// Create a new photo
export async function createPhoto(req, res) {
  try {
    console.log("Incoming photo payload:", req.body);

    const photo = new Photo({
      ...req.body,
      photographerId: req.user._id,
    });

    const savedPhoto = await photo.save();

    res.status(201).json({
      message: "Photo uploaded successfully.",
      photo: savedPhoto,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Photo upload failed.", error: error.message });
  }
}

// Get all visible photos (optionally filtered by featured/category)
export async function getPhotos(req, res) {
  try {
    const { isFeatured, isVisible, category } = req.query;

    const filter = {};

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (isVisible !== undefined) {
      filter.isVisible = isVisible === "true";
    }

    if (category) {
      filter.category = category;
    }

    const photos = await Photo.find(filter).sort({ displayOrder: 1 });
    res.status(200).json(photos);
  } catch (error) {
    console.error("Photo fetch error:", error);
    res.status(500).json({ message: "Failed to fetch photos." });
  }
}
// Get details of a single photo
export async function getPhotoInfo(req, res) {
  try {
    const photo = await Photo.findById(req.params.photoId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found." });
    }

    // If photo is hidden and user is not authenticated, block access
    if (!photo.isVisible && !req.user) {
      return res.status(403).json({ message: "Access denied to hidden photo." });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("Photo info error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid photo ID." });
    }
    res.status(500).json({ message: "Failed to fetch photo details." });
  }
}

// Update a photo
export async function updatePhoto(req, res) {
  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.photoId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPhoto) {
      return res.status(404).json({ message: "Photo not found." });
    }

    res.status(200).json({
      message: "Photo updated successfully.",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Photo update error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid photo ID." });
    }
    res.status(500).json({ message: "Photo update failed." });
  }
}

// Delete a photo
export async function deletePhoto(req, res) {
  try {
    const deletedPhoto = await Photo.findByIdAndDelete(req.params.photoId);
    if (!deletedPhoto) {
      return res.status(404).json({ message: "Photo not found." });
    }
    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Photo deletion error:", error);
    res.status(500).json({ message: "Photo deletion failed." });
  }
}

// Search photos by query
export async function searchPhotos(req, res) {
  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const photos = await Photo.find({
      isVisible: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    }).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json(photos);
  } catch (error) {
    console.error("Photo search error:", error);
    res.status(500).json({ message: "Search failed." });
  }
}