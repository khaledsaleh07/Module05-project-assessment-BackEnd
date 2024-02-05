import Product from "../models/productModel.js";
import mongoose from "mongoose";

const createProduct = async (req, res) => {
  try {
    const { collectionId, price, color, fabric } = req.body;
    const image = req.file?.path;

    if (!price || !image || !title || !description) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Please provide all required fields for the product",
      });
    }

    const newProduct = new Product({
      ...req.body,
      image: image,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      status: 201,
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create a new product",
      status: 500,
      data: null,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      status: 200,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      status: 500,
      data: null,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const product = await Product.findById(id).select("-__v");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      status: 200,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve the requested product",
      status: 500,
      data: null,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file?.path;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        status: 404,
        data: null,
      });
    }



    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Failed to update product",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      status: 200,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the product",
      status: 500,
      data: null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      status: 200,
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the product",
      status: 500,
      data: null,
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
