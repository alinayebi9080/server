import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  getMyListMovieDetails,
  userMoviesList,
  getUsersList,
  uploadProfilePictureHandler,
  suspendUser,
  reactivateUser,
} from "../controllers/userController";

import { addToMyList, removeFromMyList } from "../controllers/userController";
import { isAdmin, isLoggedIn } from "../middlewares/auth";

const userRouter = Router();

userRouter.get("/profile", isLoggedIn, getUserProfile);
userRouter.put("/api/users/:userId/update-user-info", isLoggedIn, updateUserProfile);
userRouter.post("/auth/signup", registerUser);
userRouter.post("/auth/login", loginUser);
userRouter.post("/auth/logout", logoutUser);

// Add to My List
userRouter.post("/api/user/myList/add/:movieId", isLoggedIn, addToMyList);
// Remove from My List
userRouter.post(
  "/api/user/myList/remove/:movieId",
  isLoggedIn,
  removeFromMyList
);
// Get Movie Details
userRouter.get("/api/user/myList/:movieId", isLoggedIn, getMyListMovieDetails);
// Get User Movie List
userRouter.get("/api/user/myList/", isLoggedIn, userMoviesList);

userRouter.get("/api/usersList", isLoggedIn, isAdmin, getUsersList);

// Route to suspend a user
userRouter.post("/api/suspendUser/:userId", suspendUser);
// Reactivate user
userRouter.post("/api/reactivateUser/:userId", reactivateUser);

// Route to handle file upload
userRouter.post(
  "/api/users/:userId/upload-profile-picture",
  isLoggedIn,
  uploadProfilePictureHandler
);

export default userRouter;
