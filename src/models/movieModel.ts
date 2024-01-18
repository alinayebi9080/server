import { Schema, Document, model, Types } from "mongoose";
import CategoryModel from "./CategoryModel"; // Import your Category model

interface IMovie extends Document {
  title: string;
  movieId: string;
  overview: string;
  releaseDate: String;
  genre: string[];
  posterPath: string;
  backdropPath: string;
  category: string | null; // Ref to the Category model
}

const movieSchema = new Schema<IMovie>(
  {
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
  },
  { timestamps: true }
);

const MovieModel = model<IMovie>("Movie", movieSchema);

export default MovieModel;
