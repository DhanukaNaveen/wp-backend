import express from "express";
import {
  createPhoto,
  getPhotos,
  getPhotoInfo,
  updatePhoto,
  deletePhoto,
  searchPhotos
} from "../controllers/photoController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const photoRouter = express.Router();

photoRouter.get("/", getPhotos);
photoRouter.get("/search/:query", searchPhotos);
photoRouter.get("/:photoId", authMiddleware, getPhotoInfo);

photoRouter.post("/", authMiddleware, createPhoto);
photoRouter.put("/:photoId", authMiddleware, updatePhoto);
photoRouter.delete("/:photoId", authMiddleware, deletePhoto);

export default photoRouter;