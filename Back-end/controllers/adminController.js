import Admin from "../models/adminModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      status: 200,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve admins",
      status: 500,
      data: null,
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      status: 200,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve the requested admin",
      status: 500,
      data: null,
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const existingAdmin = await Admin.findById(id);

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
        status: 404,
        data: null,
      });
    }

    if (password) {
      //check password strength
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Password is not strong enough",
        });
      }

      const hashedPassword = await hashPassword(password);
      req.body.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Failed to update admin",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      status: 200,
      data: updatedAdmin,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({
        success: false,
        message: "username already exists",
        status: 500,
        data: null,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update the admin",
        status: 500,
        data: null,
      });
    }
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      status: 200,
      data: deletedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the admin",
      status: 500,
      data: null,
    });
  }
};

export { getAllAdmins, getAdminById, updateAdmin, deleteAdmin };
