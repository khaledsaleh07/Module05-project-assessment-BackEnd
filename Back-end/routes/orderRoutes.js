import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Create
router.post("/orders", createOrder);

// Get all
router.get("/orders", getAllOrders);

// Get single
router.get("/orders/:id", getOrderById);

// Update
router.put("/orders/:id", updateOrder);

// Delete
router.delete("/orders/:id", deleteOrder);

export default router;
