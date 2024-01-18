"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRouter = (0, express_1.Router)();
userRouter.get("/profile", auth_1.isLoggedIn, userController_1.getUserProfile);
userRouter.put("/api/users/:userId/update-user-info", auth_1.isLoggedIn, userController_1.updateUserProfile);
userRouter.post("/auth/signup", userController_1.registerUser);
userRouter.post("/auth/login", userController_1.loginUser);
userRouter.post("/auth/logout", userController_1.logoutUser);
// Add to My List
userRouter.post("/api/user/myList/add/:movieId", auth_1.isLoggedIn, userController_2.addToMyList);
// Remove from My List
userRouter.post("/api/user/myList/remove/:movieId", auth_1.isLoggedIn, userController_2.removeFromMyList);
// Get Movie Details
userRouter.get("/api/user/myList/:movieId", auth_1.isLoggedIn, userController_1.getMyListMovieDetails);
// Get User Movie List
userRouter.get("/api/user/myList/", auth_1.isLoggedIn, userController_1.userMoviesList);
userRouter.get("/api/usersList", auth_1.isLoggedIn, auth_1.isAdmin, userController_1.getUsersList);
// Route to suspend a user
userRouter.post("/api/suspendUser/:userId", userController_1.suspendUser);
// Reactivate user
userRouter.post("/api/reactivateUser/:userId", userController_1.reactivateUser);
// Route to handle file upload
userRouter.post("/api/users/:userId/upload-profile-picture", auth_1.isLoggedIn, userController_1.uploadProfilePictureHandler);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map