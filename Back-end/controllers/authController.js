import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
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

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password",
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Wrong username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        admin: admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process login request",
      error: error.message,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    //save inputs
    const { username, password } = req.body;
    //check empty fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Please provide both username and password",
      });
    }
    //check password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Password is not strong enough",
      });
    }

    //hash the password
    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({ username, password: hashedPassword });

    const savedAdmin = await newAdmin.save();

    const token = jwt.sign(
      {
        id: savedAdmin.id,
        username: savedAdmin.username,
        admin: savedAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: savedAdmin,
      accessToken: token,
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
        message: error.message || "Failed to create a new admin",
        status: 500,
        data: null,
      });
    }
  }
};
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, address } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber || !address) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Please provide all required fields",
        data: null,
      });
    }

    //check password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Password is not strong enough",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser.id,
        email: savedUser.email,
        user: savedUser,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      status: 201,
      data: savedUser,
      accessToken: token,
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
        message: error.message || "Failed to create a new user",
        status: 500,
        data: null,
      });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Wrong email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong email or password",
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user: user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process login request",
      error: error.message,
    });
  }
};

export { loginAdmin, createAdmin, createUser, loginUser };
