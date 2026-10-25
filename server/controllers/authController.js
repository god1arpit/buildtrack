import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Add it to server/.env (see .env.example).");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, skill } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Security: public registration is restricted to the "labour" role only.
    // Builder/supervisor accounts are created via seed data or by an existing admin.
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: "labour",
      skill: skill || "Helper",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      skill: user.skill || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone: email }],
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        assignedProjects: user.assignedProjects,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email/phone or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("assignedProjects");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file || !req.file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ message: "Please choose an image file for your profile photo." });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      profileImage: `/uploads/${req.file.filename}`,
    });
    if (!user) return res.status(404).json({ message: "Account not found." });
    res.json({ profileImage: user.profileImage });
  } catch (error) {
    next(error);
  }
};

export const getSupervisors = async (req, res, next) => {
  try {
    const supervisors = await User.find({ role: "supervisor" }).select("-password");
    res.json(supervisors);
  } catch (error) {
    next(error);
  }
};
