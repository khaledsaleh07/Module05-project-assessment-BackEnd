import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Get all
router.get("/users", getAllUsers);

// Get single
router.get("/users/:id", getUserById);

// Update
router.put("/users/:id", updateUser);

// Delete
router.delete("/users/:id", deleteUser);

export default router;
