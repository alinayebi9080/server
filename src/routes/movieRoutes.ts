import express from "express";
import {
  createMovie,
  updateMovie,
  getMovies,
  deleteMovie,
} from "../controllers/MovieController";
import { isAdmin, isLoggedIn } from "../middlewares/auth";

const router = express.Router();

router.post("/auth/addMovie", isLoggedIn, isAdmin, createMovie);
router.put("/update/:movieId", isLoggedIn, isAdmin, updateMovie);
router.get("/MoviesList", isLoggedIn, isAdmin, getMovies);
router.delete("/delete/:movieId", isLoggedIn, isAdmin, deleteMovie);

export default router;
