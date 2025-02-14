import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);


        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }


    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}