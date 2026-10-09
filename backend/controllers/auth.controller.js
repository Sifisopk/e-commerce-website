import crypto from "crypto";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";

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

// start of helpers for emailed one-time tokens
// the raw token goes in the email link; only its sha256 hash is stored in the database
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const makeToken = () => {
    const raw = crypto.randomBytes(32).toString("hex");
    return { raw, hashed: hashToken(raw) };
};

const cleanEmail = (value) => String(value ?? "").trim().toLowerCase();

const userPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified !== false, // accounts from before this feature count as verified
});

// true if we may proceed, false if this key was used in the last `seconds`
const passCooldown = async (key, seconds) => {
    try {
        const ok = await redis.set(key, "1", "EX", seconds, "NX");
        return ok !== null;
    } catch (error) {
        console.log("Cooldown check failed", error.message);
        return true; // don't block users if redis hiccups
    }
};
// end of helpers for emailed one-time tokens


//signup route  
export const signup = async (req,res) => {
    try {
        const name = String(req.body.name ?? "").trim();
        const email = cleanEmail(req.body.email);
        const { password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill in all fields"});
        }

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const { raw, hashed } = makeToken();

        const user = await User.create({
            name,
            email,
            password,
            emailVerified: false,
            emailVerifyToken: hashed,
            emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        //authenticate user and generate token
        const [accessToken, refreshToken] = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        // fire and forget: a failed email must not stop the signup
        sendVerificationEmail({ user, token: raw });

        res.status(201).json({
            user: userPayload(user),
            message: "User created successfully",});
    } catch (error) {
        if(error.name === "ValidationError"){
            const first = Object.values(error.errors)[0]?.message;
            return res.status(400).json({message: first || "Please check your details"});
        }
        console.log("Error signing up", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

//login route
export const login = async (req,res) => {
    try{
        const email = cleanEmail(req.body.email);
        const { password } = req.body;
        const user = await User.findOne({email});
       
        if(user && await user.comparePassword(password)){
            const [accessToken, refreshToken] = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                user: userPayload(user),
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


// start of forgot password
// Always answers the same way so nobody can use this to find out which emails have accounts.
export const forgotPassword = async (req,res) => {
    const genericReply = { message: "If an account exists for that email, we've sent a link to reset the password." };

    try {
        const email = cleanEmail(req.body.email);
        if(!email){
            return res.status(400).json({message: "Please enter your email"});
        }

        const user = await User.findOne({email});

        // one reset email per address per minute
        if(user && await passCooldown(`reset_cooldown:${email}`, 60)){
            const { raw, hashed } = makeToken();
            await User.updateOne(
                { _id: user._id },
                { $set: { resetPasswordToken: hashed, resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000) } }
            );
            sendPasswordResetEmail({ user, token: raw }); // fire and forget
        }

        res.json(genericReply);
    } catch (error) {
        console.log("Error in forgot password", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
// end of forgot password

// start of reset password
export const resetPassword = async (req,res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if(!password || password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({
            resetPasswordToken: hashToken(token),
            resetPasswordExpires: { $gt: new Date() },
        });

        if(!user){
            return res.status(400).json({message: "This reset link is invalid or has expired. Please request a new one."});
        }

        user.password = password; // hashed by the pre-save hook
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // they received an email at this address, so it is real
        user.emailVerified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpires = undefined;
        await user.save();

        // log out any other sessions
        await redis.del(`refresh_Token:${user._id}`);

        res.json({message: "Password updated. You can now log in."});
    } catch (error) {
        if(error.name === "ValidationError"){
            const first = Object.values(error.errors)[0]?.message;
            return res.status(400).json({message: first || "Please check your password"});
        }
        console.log("Error resetting password", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
// end of reset password

// start of verify email
export const verifyEmail = async (req,res) => {
    try {
        const { token } = req.params;

        const user = await User.findOneAndUpdate(
            { emailVerifyToken: hashToken(token), emailVerifyExpires: { $gt: new Date() } },
            { $set: { emailVerified: true }, $unset: { emailVerifyToken: 1, emailVerifyExpires: 1 } }
        );

        if(!user){
            return res.status(400).json({message: "This verification link is invalid, expired or already used."});
        }

        res.json({message: "Email verified. Thank you!"});
    } catch (error) {
        console.log("Error verifying email", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

// logged-in users can ask for a fresh verification email
export const resendVerification = async (req,res) => {
    try {
        if(req.user.emailVerified !== false){
            return res.json({message: "Your email is already verified"});
        }

        if(!await passCooldown(`verify_cooldown:${req.user._id}`, 60)){
            return res.status(429).json({message: "Please wait a minute before asking for another email"});
        }

        const { raw, hashed } = makeToken();
        await User.updateOne(
            { _id: req.user._id },
            { $set: { emailVerifyToken: hashed, emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) } }
        );

        // logged in, so we can be honest if sending fails
        const sent = await sendVerificationEmail({ user: req.user, token: raw });
        if(!sent){
            return res.status(502).json({message: "We couldn't send the email right now. Please try again later."});
        }

        res.json({message: "Verification email sent. Check your inbox."});
    } catch (error) {
        console.log("Error resending verification", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
// end of verify email
