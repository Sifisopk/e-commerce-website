import e from "express";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const accessToken = jwt.sign({userId},
         process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"});

        const refreshToken = jwt.sign({userId}, 
         process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"});

        return [accessToken, refreshToken];
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_Token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // set expiration to 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevents xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attacks
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevents xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};


//signup route  
export const signup = async (req,res) => {
    const {email, password, name} = req.body;
    const userExists = await User.findOne({email});
   
    if(userExists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({
        name,
        email,
        password
    });

    //authenticate user and generate token
    const [accessToken, refreshToken] = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);


    res.status(201).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        message: "User created successfully",});
};

//login route
export const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
       
        if(user && await user.comparePassword(password)){
            const [accessToken, refreshToken] = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                message: "Logged in successfully"
            });
        } else{
        res.status(400).json({message: "Invalid email or password"});
    }
    }
   
        catch (error){
            console.log("Error logging in", error.message);
            res.status(500).json({message: "Internal server error"});
    }
};


//logout route
export const logout = async (req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_Token:${decoded.userId}`);
            
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message: "Logged out successfully"});
    }
    
     catch (error){
        console.log("Error logging out", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
//refresh token route
export const refreshToken = async (req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message: "No refresh token provided"});
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_Token:${decoded.userId}`); 

        if(storedToken !== refreshToken){
            return res.status(403).json({message: "Invalid refresh token"});
        }

        const accessToken = jwt.sign({userId: decoded.userId},  
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});

            res.cookie("accessToken", accessToken, {
                httpOnly: true, // prevents xss attacks
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict", // prevents CSRF attacks
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

        res.json({message: "Token refreshed successfully"});
    }
    catch (error){
        console.log("Error refreshing token", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}



export const getProfile = async (req,res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}