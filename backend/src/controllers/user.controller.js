import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { User } from './../models/user.models.js';

export const register = async(req ,res) => {
    try {
        const {fullname , password , email , phoneNumber} = req.body;

        if(!fullname || !password || !email || !phoneNumber){
            return res.status(400).json({
                message: "Something is Missing",
                success:false,
            })
        }

        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({
                message: "User already existed with this email.",
                success:false,
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            fullname,
            password: hashedPassword,
            email,
            phoneNumber,
        });

        const userResponse = {
            id: user._id,
            email: user.email,
            fullname : user.fullname,
            phoneNumber: user.phoneNumber,
            
        };

        return res.status(201).json({
            message: "User Register successfully",
            user: userResponse,
            success:true,
        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}

export const login = async(req , res) => {
    try {
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                message: "Something is missing.",
                success: false,
            })
        }

        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Invallid email or password",
                success: false,
            })
        }

        const isMatched = await bcrypt.compare(password , user.password)

        if(!isMatched){
            return res.status(401).json({
                message: "Invalid email or password.",
                success: false,
            })
        };


        const tokenData = {
            id: user._id,
        }
        const token = jwt.sign(tokenData , process.env.SECRET_KEY , {expiresIn: '1d'});

        res.cookie("token" , token ,{
            httpOnly: true,
            
            sameSite: 'strict',
            maxAge: 1*24*60*60*1000,
        });

        user = {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
        }

        res.status(200).json({
            message: "User Logged in successfully.",
            success: true,
            user,
            
        })





    } catch (error) {
        console.log(error);
    }
}

export const logout = async(req , res) => {
    try {
        return res.cookie("token",{maxAge:0}).json({
            message: 'Successfully logout.',
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}