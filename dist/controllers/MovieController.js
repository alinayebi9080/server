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
exports.deleteMovie = exports.getMovies = exports.updateMovie = exports.createMovie = void 0;
const movieModel_1 = __importDefault(require("../models/movieModel"));
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, genre, category } = req.body;
        // Check if the category with the given ID exists
        const existingCategory = yield CategoryModel_1.default.findOne({ title: category });
        if (!existingCategory) {
            return res.status(400).json({ error: "category not found!" });
        }
        const newMovie = yield movieModel_1.default.create({
            title,
            genre,
            category: existingCategory._id, // Use the ID of the existing category
        });
        return res.status(201).json({
            message: "Movie created successfully!",
            data: newMovie,
        });
    }
    catch (error) {
        console.error("Error creating movie:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.createMovie = createMovie;
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const { title, overview, releaseDate, genre, posterPath, backdropPath } = req.body;
        const updatedMovie = yield movieModel_1.default.findByIdAndUpdate(movieId, {
            title,
            overview,
            releaseDate,
            genre,
            posterPath,
            backdropPath,
        }, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({
                error: "Not Found",
                message: "Movie not found",
            });
        }
        return res.status(200).json({
            message: "Movie updated successfully!",
            data: updatedMovie,
        });
    }
    catch (error) {
        console.error("Error updating movie:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.updateMovie = updateMovie;
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield movieModel_1.default.find();
        return res.status(200).json({
            message: "Movies fetched successfully!",
            data: movies,
        });
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.getMovies = getMovies;
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const deletedMovie = yield movieModel_1.default.findByIdAndDelete(movieId);
        if (!deletedMovie) {
            return res.status(404).json({
                error: "Not Found",
                message: "Movie not found",
            });
        }
        return res.status(200).json({
            message: "Movie deleted successfully!",
            data: deletedMovie,
        });
    }
    catch (error) {
        console.error("Error deleting movie:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
});
exports.deleteMovie = deleteMovie;
//# sourceMappingURL=MovieController.js.map