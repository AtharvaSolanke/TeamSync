import mongoose from "mongoose"
import generateToken from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    // get user details that he/she sent
    console.log("Received Request Body:", req.body);
    const { username, email, password } = req.body

    try {
        // check if all fileds are there or not
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({
                    message: "All fields are required"
                })
        }

        // check password criteria
        if (password.length < 6) {
            return res
                .status(400)
                .json({
                    message: "Password must be atleast 6 characters"
                })
        }

        // check team id criteria
        // const findteam = await User.findOne({ teamId })
        // if (findteam) {
        //     return res
        //         .status(400)
        //         .json({
        //             message: "user with team id already exists"
        //         })
        // }

        // find if user with same email exists
        const user = await User.findOne({ email })
        if (user) {
            return res
                .status(400)
                .json({
                    message: "user with same email already exists"
                })
        }

        // check for username already exists
        const user1 = await User.findOne({ username })
        if (user1) {
            return res
                .status(400)
                .json({
                    message: "user with same username already exists"
                })
        }

        //create salt and hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user with User model
        const newUser = new User({
            username,
            email,
            // team,
            // teamId,
            password: hashedPassword
        });

        // genreate token
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            // send success response
            res
                .status(200)
                .json({
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profileImage: newUser.profileImage,
                    // team: newUser.team,
                    // teamId: newUser.teamId
                });
        }
        else {
            res
                .status(400)
                .json({
                    message: "Invalid User Data"
                })
        }
    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res
            .status(500)
            .json({
                message: "Internal server error"
            })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        // find user with email
        const user = await User.findOne({ email });

        // check is user is there
        if (!user) {
            return res.status(400).json({ "message": "Invalid Credential" })
        }

        // authenticate password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ "message": "Invalid Credential" })
        }

        // if all good then generate token and send response
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            // team: user.team,
            // teamId: user.teamId
        })
    } catch (error) {
        console.log("Error in user Login : ", error.message);
        res.status(500).json({ "message": "Internal server error" })
    }
}

export const logout = (req, res) => {
    try {
        // clear the cookies and send response
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        // get profile pic and user id
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // upload on cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // find user by id and update the profile pic
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        // send response
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    // to check whether user is logged in or not
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};