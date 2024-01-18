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
exports.toggleMyList = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const toggleMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, movieId } = req.body;
        // Find the user by email
        const user = yield UserModel_1.default.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if the movie is already in the user's My List
        const movieIndex = user.myList.some((movie) => movie.id === movieId);
        if (!movieIndex) {
            // Add the movie to the My List
            user.myList.push({ id: movieId, title: "", imageUrl: "" });
        }
        else {
            // Remove the movie from the My List
            user.myList = user.myList.filter((movie) => movie.id !== movieId);
        }
        yield user.save();
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error toggling My List:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.toggleMyList = toggleMyList;
//# sourceMappingURL=myListController.js.map