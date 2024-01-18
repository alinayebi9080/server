import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

import path from "path";
import fs from "fs";

import UserModel from "../models/UserModel";
import TokenBlackList from "../models/tokenBlackList";
import upload from "../middlewares/multerMiddleware";
import { IGetUserAuthInfoRequest } from "../middlewares/definitionfile";

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

// Validation schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-={}[]|;:"<>,.?/~`])'
      )
    )
    .message(
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
    ),
  terms: Joi.boolean().valid(true).required(),
});

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Validation schema for updating user profile
const updateUserProfileSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string().allow(null, "").optional(), // Optional, can be null or empty
  dateOfBirth: Joi.date().iso().optional(), // Optional date in ISO format
  address: Joi.string().allow(null, "").optional(),
});

// Define Joi schema for updateProfilePicture endpoint
const uploadProfilePictureSchema = Joi.object({
  file: Joi.object({
    path: Joi.string().required(),
  }).required(),
});

///////////////////////////////

const registerUser = async (req: Request, res: Response) => {
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
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message: "A user with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
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
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

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

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h", // Token expiration time
    });

    return res.status(200).json({
      message: "Login successful!",
      token,
      isAdmin: user.isAdmin, // Include isAdmin in the response
    });
  } catch (error: unknown) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Check if the token is in the blacklist
    const findToken = await TokenBlackList.findOne({ token });

    if (findToken) {
      return res.status(401).json({
        error: "Token already blacklisted / User already logged out!",
      });
    }

    // Add the token to the blacklist
    await TokenBlackList.create({ token });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error: unknown) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const getUserProfile = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    // middleware extracts user information from the token
    const user = req.user;

    return res.status(200).json({
      message: "User profile retrieved successfully!",
      data: user,
    });
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const updateUserProfile = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
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
    const {
      name: validatedName,
      phoneNumber: validatedPhoneNumber,
      dateOfBirth: validatedDateOfBirth,
      address: validatedAddress,
    } = value;

    // Get the user ID from the authenticated user
    const userId = req.user?._id;

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    // Update user's personal information in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: validatedName,
        phoneNumber: validatedPhoneNumber,
        dateOfBirth: validatedDateOfBirth,
        address: validatedAddress,
      },
      { new: true }
    );

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
  } catch (error: unknown) {
    console.error("Error updating personal information:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const uploadProfilePictureHandler = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    console.log("Request received:", req.params);

    // Wrap the multer middleware in a Promise to make it awaitable
    const multerMiddleware = () =>
      new Promise<void>((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) {
            console.error("Error uploading file:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

    // Wait for the multer middleware to complete
    await multerMiddleware();

    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: file.path },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the response here, after handling the file upload
    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const addToMyList = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { movieId } = req.params;
  const userId = req.user._id; // user information stored in req.user
  const { title, backdrop_path, rating, originalLanguage } = req.body;

  try {
    const user = await UserModel.findById(userId);

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
      await user.save();
    }

    return res.status(200).json({ message: "Movie added to My List" });
  } catch (error: any) {
    console.error("Error adding movie to My List:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
    });
  }
};

const removeFromMyList = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the movieId from the user's myList
    const movieIndex = user.myList.findIndex((movie) => movie.id === movieId);
    if (movieIndex !== -1) {
      user.myList.splice(movieIndex, 1);
      await user.save();
    }

    return res.status(200).json({ message: "Movie removed from My List" });
  } catch (error: any) {
    console.error("Error removing movie from My List:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
    });
  }
};

const getMyListMovieDetails = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);

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
    } else {
      return res.status(200).json({
        isInMyList: false,
      });
    }
  } catch (error: any) {
    console.error("Error fetching movie details from My List:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
    });
  }
};

const userMoviesList = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the movieId is in the user's myList
    const myListLength = user.myList.length;
    // console.log(MyList)
    if (myListLength) {
      return res.status(200).json({ myList: user.myList });
    } else {
      return res.status(200).json({
        MyList: { myList: [] },
      });
    }
  } catch (error: any) {
    console.error("Error fetching movie List:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
    });
  }
};

const getUsersList = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({}, { password: 0 });

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error("Error fetching users list:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
    });
  }
};

const suspendUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Update the 'suspended' field to true
    user.suspended = true;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User suspended successfully." }); // Return success response
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ error: "Internal server error." }); // Return error response
  }
};

const reactivateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Update the 'suspended' field to false for reactivation
    user.suspended = false;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User reactivated successfully." }); // Return success response
  } catch (error) {
    console.error("Error reactivating user:", error);
    res.status(500).json({ error: "Internal server error." }); // Return error response
  }
};

export {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  logoutUser,
  removeFromMyList,
  addToMyList,
  getMyListMovieDetails,
  userMoviesList,
  getUsersList,
  uploadProfilePictureHandler,
  suspendUser,
  reactivateUser,
};
