import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/jwt.js";

const getAllowedAdminCredentials = () => ({
  email: process.env.ADMIN_EMAIL?.trim() || "admin@gmail.com",
  password: process.env.ADMIN_PASSWORD || "admin@123",
  role: process.env.ADMIN_ROLE?.trim() || "superadmin",
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  const { email, password: allowedPassword, role } = getAllowedAdminCredentials();

  if (username.trim().toLowerCase() !== email.toLowerCase() || password !== allowedPassword) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ username: email, role });

  res.json({
    token,
    admin: {
      username: email,
      role,
    },
  });
});

export const createAdmin = asyncHandler(async (_req, res) => {
  res.status(403);
  throw new Error("Admin creation is disabled. Use the configured credentials instead.");
});
