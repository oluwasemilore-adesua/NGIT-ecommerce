const bcrypt = require("bcryptjs");
const User = require("../../models/users/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const JWT_TOKEN = process.env.JWT_SECRET || "yourwwwww";

const saltRounds = 10;

//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        
        // check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        //create token 
        const token = jwt.sign(
            { userId: user._id },
            JWT_TOKEN,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

//Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        //  create token 
        const token = jwt.sign(
            { userId: user._id },
            JWT_TOKEN,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in user",
            error: error.message
        });
    }
};

const getUser = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports ={
    registerUser,
    loginUser,
    getUser
};
