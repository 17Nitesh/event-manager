import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    if (!token) {
        return res.status(401).send("Not authorized, no token");
    }
}