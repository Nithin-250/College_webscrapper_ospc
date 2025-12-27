import jwt from "jsonwebtoken";

export const generateToken = (payload, expiresIn = "1d") => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET not set in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET not set in environment variables");
  }

  return jwt.verify(token, secret);
};
