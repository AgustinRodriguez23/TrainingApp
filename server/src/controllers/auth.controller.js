import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import { config } from "../config/config.js";

class AuthController {
  static register = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email y password son obligatorios" });
      }

      const existing = await UserModel.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Ya existe un usuario con ese email" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ email, password: hashedPassword });

      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default AuthController;