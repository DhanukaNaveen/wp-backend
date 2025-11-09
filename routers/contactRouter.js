import express from "express";
import {
  submitContact,
  getContacts,
  deleteContact,
  updateContactStatus
} from "../controllers/contactController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const contactRouter = express.Router();

contactRouter.post("/", submitContact);
contactRouter.get("/", authMiddleware, getContacts);
contactRouter.put("/:id/status", authMiddleware, updateContactStatus);
contactRouter.delete("/:id", authMiddleware, deleteContact);

export default contactRouter;