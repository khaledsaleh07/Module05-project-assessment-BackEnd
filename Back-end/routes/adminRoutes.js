import express from "express";
import {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Get all
router.get("/admins", getAllAdmins);

// Get single
router.get("/admins/:id", getAdminById);

// Update
router.put("/admins/:id", updateAdmin);

// Delete
router.delete("/admins/:id", deleteAdmin);

export default router;
