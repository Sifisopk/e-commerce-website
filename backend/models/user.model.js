import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true // was misspelled "tirm" so emails were never trimmed
        },
        password: {
            type: String,
            required:[true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters long"]
        },
       cartItems: [
    {
        quantity: {
            type: Number,
            default: 1
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        color: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: ""
        }
    }
],
        role:{
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },

        // start of email verification + password reset
        // emailVerified has NO default on purpose: accounts created before this
        // feature have no value (undefined) and are treated as verified.
        // Only new signups are saved as false.
        emailVerified: {
            type: Boolean
        },
        emailVerifyToken: { type: String, select: false },   // sha256 hash of the emailed token
        emailVerifyExpires: { type: Date, select: false },
        resetPasswordToken: { type: String, select: false }, // sha256 hash of the emailed token
        resetPasswordExpires: { type: Date, select: false },
        // end of email verification + password reset
    },
    {
        timestamps: true
    }

);




// pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))  return next();{
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.log("Error hashing password", error.message);
    }
    next();
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;
