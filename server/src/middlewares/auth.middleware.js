import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no provisto" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}