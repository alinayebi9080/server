"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactivateUser = exports.suspendUser = exports.uploadProfilePictureHandler = exports.getUsersList = exports.userMoviesList = exports.getMyListMovieDetails = exports.addToMyList = exports.removeFromMyList = exports.logoutUser = exports.getUserProfile = exports.updateUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const tokenBlackList_1 = __importDefault(require("../models/tokenBlackList"));
const multerMiddleware_1 = __importDefault(require("../middlewares/multerMiddleware"));
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
// Validation schema for user registration
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-={}[]|;:"<>,.?/~`])'))
        .message("Password must be at least 8 characters long and include at least one letter, one number, and one special character."),
    terms: joi_1.default.boolean().valid(true).required(),
});
// Validation schema for user login
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
// Validation schema for updating user profile
const updateUserProfileSchema = joi_1.default.object({
    name: joi_1.default.string(),
    phoneNumber: joi_1.default.string().allow(null, "").optional(), // Optional, can be null or empty
    dateOfBirth: joi_1.default.date().iso().optional(), // Optional date in ISO format
    address: joi_1.default.string().allow(null, "").optional(),
});
// Define Joi schema for updateProfilePicture endpoint
const uploadProfilePictureSchema = joi_1.default.object({
    file: joi_1.default.object({
        path: joi_1.default.string().required(),
    }).required(),
});
///////////////////////////////
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: "Validation error",
                message: error.details[0].message,
            });
        }
        const { name, email, password } = value;
        // Check if the user already exists
        const existingUser = yield UserModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
                message: "A user with this email already exists",
            });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create a new user
        const newUser = yield UserModel_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "User registered successfully!",
            data: newUser,
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: "Validation error",
                message: error.details[0].message,
            });
        }
        const { email, password } = value;
        // Check if the user exists
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: "Authentication failed",
                message: "Invalid email or password",
            });
        }
        // Compare the provided password with the hashed password
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: "Authentication failed",
                message: "Invalid email or password",
            });
        }
        // Generate a JWT token for authentication
        const tokenPayload = {
            userId: user._id,
            isAdmin: user.isAdmin,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecret, {
            expiresIn: "1h", // Token expiration time
        });
        return res.status(200).json({
            message: "Login successful!",
            token,
            isAdmin: user.isAdmin, // Include isAdmin in the response
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(400).json({ error: "No token provided" });
        }
        // Check if the token is in the blacklist
        const findToken = yield tokenBlackList_1.default.findOne({ token });
        if (findToken) {
            return res.status(401).json({
                error: "Token already blacklisted / User already logged out!",
            });
        }
        // Add the token to the blacklist
        yield tokenBlackList_1.default.create({ token });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.logoutUser = logoutUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // middleware extracts user information from the token
        const user = req.user;
        return res.status(200).json({
            message: "User profile retrieved successfully!",
            data: user,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract data from request body
        const { name, phoneNumber, dateOfBirth, address } = req.body;
        // Validate the data using Joi schema
        const { error, value } = updateUserProfileSchema.validate({
            name,
            phoneNumber,
            dateOfBirth,
            address,
        });
        if (error) {
            return res.status(400).json({
                error: "Validation error",
                message: error.details[0].message,
            });
        }
        // Extract validated data
        const { name: validatedName, phoneNumber: validatedPhoneNumber, dateOfBirth: validatedDateOfBirth, address: validatedAddress, } = value;
        // Get the user ID from the authenticated user
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Ensure the user is authenticated
        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "User not authenticated",
            });
        }
        // Update user's personal information in the database
        const updatedUser = yield UserModel_1.default.findByIdAndUpdate(userId, {
            name: validatedName,
            phoneNumber: validatedPhoneNumber,
            dateOfBirth: validatedDateOfBirth,
            address: validatedAddress,
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                error: "Not Found",
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "Personal information updated successfully!",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Error updating personal information:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.updateUserProfile = updateUserProfile;
const uploadProfilePictureHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request received:", req.params);
        // Wrap the multer middleware in a Promise to make it awaitable
        const multerMiddleware = () => new Promise((resolve, reject) => {
            (0, multerMiddleware_1.default)(req, res, (err) => {
                if (err) {
                    console.error("Error uploading file:", err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        // Wait for the multer middleware to complete
        yield multerMiddleware();
        const userId = req.params.userId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const updatedUser = yield UserModel_1.default.findByIdAndUpdate(userId, { avatar: file.path }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Send the response here, after handling the file upload
        return res.status(200).json({
            message: "Profile picture uploaded successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.uploadProfilePictureHandler = uploadProfilePictureHandler;
const addToMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const userId = req.user._id; // user information stored in req.user
    const { title, backdrop_path, rating, originalLanguage } = req.body;
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Add the movieId to the user's myList
        if (!user.myList.some((movie) => movie.id === movieId)) {
            user.myList.push({
                id: movieId,
                title,
                imageUrl: backdrop_path,
                rating: rating || 0, // Default to 0 if not provided
                originalLanguage: originalLanguage || "", // Default to empty string if not provided
            });
            yield user.save();
        }
        return res.status(200).json({ message: "Movie added to My List" });
    }
    catch (error) {
        console.error("Error adding movie to My List:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
});
exports.addToMyList = addToMyList;
const removeFromMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const userId = req.user._id;
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Remove the movieId from the user's myList
        const movieIndex = user.myList.findIndex((movie) => movie.id === movieId);
        if (movieIndex !== -1) {
            user.myList.splice(movieIndex, 1);
            yield user.save();
        }
        return res.status(200).json({ message: "Movie removed from My List" });
    }
    catch (error) {
        console.error("Error removing movie from My List:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
});
exports.removeFromMyList = removeFromMyList;
const getMyListMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const userId = req.user._id;
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if the movieId is in the user's myList
        const isInMyList = user.myList.some((movie) => movie.id === movieId);
        if (isInMyList) {
            return res.status(200).json({
                isInMyList: true,
                movieDetails: user.myList.find((movie) => movie.id === movieId),
            });
        }
        else {
            return res.status(200).json({
                isInMyList: false,
            });
        }
    }
    catch (error) {
        console.error("Error fetching movie details from My List:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
});
exports.getMyListMovieDetails = getMyListMovieDetails;
const userMoviesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const userId = req.user._id;
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if the movieId is in the user's myList
        const myListLength = user.myList.length;
        // console.log(MyList)
        if (myListLength) {
            return res.status(200).json({ myList: user.myList });
        }
        else {
            return res.status(200).json({
                MyList: { myList: [] },
            });
        }
    }
    catch (error) {
        console.error("Error fetching movie List:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
});
exports.userMoviesList = userMoviesList;
const getUsersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.default.find({}, { password: 0 });
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error("Error fetching users list:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
});
exports.getUsersList = getUsersList;
const suspendUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        // Find the user by ID
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        // Update the 'suspended' field to true
        user.suspended = true;
        // Save the updated user
        yield user.save();
        res.status(200).json({ message: "User suspended successfully." }); // Return success response
    }
    catch (error) {
        console.error("Error suspending user:", error);
        res.status(500).json({ error: "Internal server error." }); // Return error response
    }
});
exports.suspendUser = suspendUser;
const reactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        // Find the user by ID
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        // Update the 'suspended' field to false for reactivation
        user.suspended = false;
        // Save the updated user
        yield user.save();
        res.status(200).json({ message: "User reactivated successfully." }); // Return success response
    }
    catch (error) {
        console.error("Error reactivating user:", error);
        res.status(500).json({ error: "Internal server error." }); // Return error response
    }
});
exports.reactivateUser = reactivateUser;
//# sourceMappingURL=userController.js.map