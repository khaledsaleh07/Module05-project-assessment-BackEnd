import express from "express";
import {
  createAdmin,
  loginAdmin,
  createUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// Register admin
router.post("/auth/admin/signup", createAdmin);

// Login admin
router.post("/auth/admin/login", loginAdmin);

// Register user
router.post("/auth/user/signup", createUser);

// Login user
router.post("/auth/user/login", loginUser);

export default router;
