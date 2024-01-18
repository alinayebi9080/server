import { Request, Response } from "express";
import MovieModel from "../models/movieModel";
import CategoryModel from "../models/CategoryModel";

const createMovie = async (req: Request, res: Response) => {
  try {
    const { title, genre, category } = req.body;

    // Check if the category with the given ID exists
    const existingCategory = await CategoryModel.findOne({ title: category });
    if (!existingCategory) {
      return res.status(400).json({ error: "category not found!" });
    }

    const newMovie = await MovieModel.create({
      title,
      genre,
      category: existingCategory._id, // Use the ID of the existing category
    });

    return res.status(201).json({
      message: "Movie created successfully!",
      data: newMovie,
    });
  } catch (error: unknown) {
    console.error("Error creating movie:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const updateMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { title, overview, releaseDate, genre, posterPath, backdropPath } =
      req.body;

    const updatedMovie = await MovieModel.findByIdAndUpdate(
      movieId,
      {
        title,
        overview,
        releaseDate,
        genre,
        posterPath,
        backdropPath,
      },
      { new: true }
    );

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
  } catch (error: unknown) {
    console.error("Error updating movie:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await MovieModel.find();

    return res.status(200).json({
      message: "Movies fetched successfully!",
      data: movies,
    });
  } catch (error: unknown) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    const deletedMovie = await MovieModel.findByIdAndDelete(movieId);

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
  } catch (error: unknown) {
    console.error("Error deleting movie:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
};

export { createMovie, updateMovie, getMovies, deleteMovie };
