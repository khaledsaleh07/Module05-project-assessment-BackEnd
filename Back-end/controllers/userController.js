import User from "../models/userModel.js";
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      status: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve the requested user",
      status: 500,
      data: null,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      status: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      status: 500,
      data: null,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

    if (address) {
      const updatedAddress = { ...existingUser.address, ...address };
      req.body.address = updatedAddress;
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Failed to update user",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      status: 200,
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({
        success: false,
        message: "email already exists",
        status: 500,
        data: null,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update the user",
        status: 500,
        data: null,
      });
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Not valid id format" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      status: 200,
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the user",
      status: 500,
      data: null,
    });
  }
};
export { getAllUsers, getUserById, updateUser, deleteUser };
