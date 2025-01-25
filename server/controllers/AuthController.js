import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {renameSync, unlinkSync} from 'fs'

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password is required." })
        };

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: 'This email has already account'
            })
        }

        const user = await User.create({ email, password });
        res.cookie('jwt', createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).json({
            success: true,
            message: "Account has been created",
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}



export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password is required." })
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Please check email or password'
            })
        }
        const auth = await bcrypt.compare(password, user?.password);
        if (!auth) {
            return res.status(404).json({
                success: false,
                message: 'Please check email or password'
            })
        }
        res.cookie('jwt', createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            success: true,
            message: `welcome ${user.firstName ? (user?.firstName) : (user?.email)}`,
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find(); 

        return res.status(200).json({
            success: true,
            message:'hi',
            users: suggestedUsers
        });

    } catch (error) {
        console.log(`error: ${error}`);
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: `welcome ${user.firstName ? (user?.firstName) : (user?.email)}`,
            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'GetUserInfo/ Internal Server Error'
        })
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { userId } = req;
        const { firstName, lastName } = req.body

        if (!firstName || !lastName) {
            return res.status(404).json({
                success: false,
                message: 'First name and Last name are required'
            })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                profileSetup: true
            },
            { new: true, runValidators: true })

        return res.status(200).json({
            success: true,
            message: `welcome ${user.firstName ? (user?.firstName) : (user?.email)}`,
            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'GetUserInfo/ Internal Server Error'
        })
    }
}

export const addProfileImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message:"Image is requied"
            })
        }

        const date = Date.now();
        let filename = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, filename);

        const updateUser = await User.findByIdAndUpdate(req.userId, {image: filename}, {new:true, runValidators:true})
        return res.status(200).json({
            success: true,
            message:'Image has updated',
            image: updateUser.image

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'GetUserInfo/ Internal Server Error'
        })
    }
}

export const removeProfileImage = async (req, res) => {
    try {

        const {userId} = req;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({success:false, message: 'User not found'});
        if(user.image){
            unlinkSync(user.image)
        }
        user.image =null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile Image has been removed'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'GetUserInfo/ Internal Server Error'
        })
    }
}


export const logout = async (req, res)=>{
    try {
        res.cookie('jwt', '', {maxAge: 1, secure:true, sameSite:'None'})
        return res.status(200).json({
            success: true,
            message: 'Logout Successfull'
        })
    } catch (error) {
        console.log(`LOGOUT/ internal seerver errror `, error)
    }
}