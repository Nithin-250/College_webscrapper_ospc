import asyncHandler from "express-async-handler";
import { verifyToken } from "../utils/jwt.js";

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    if (!decoded?.username || !decoded?.role) {
      res.status(401);
      throw new Error("Not authorized, invalid token payload");
    }

    req.admin = {
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

export const requireRole = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      res.status(403);
      throw new Error("You do not have permission to perform this action");
    }

    next();
  });
