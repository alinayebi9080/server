"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    movieId: {
        type: String,
        required: false,
    },
    overview: {
        type: String,
        required: false,
    },
    releaseDate: {
        type: String,
        required: false,
    },
    genre: {
        type: [String],
        required: false,
    },
    posterPath: {
        type: String,
        required: false,
    },
    backdropPath: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        ref: "Category", // Ref to the Category model
        required: true,
    },
}, { timestamps: true });
const MovieModel = (0, mongoose_1.model)("Movie", movieSchema);
exports.default = MovieModel;
//# sourceMappingURL=movieModel.js.map