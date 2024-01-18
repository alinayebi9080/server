import { Router } from "express";
import {
  createCategory,
  removeCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController";
import { isAdmin, isLoggedIn } from "../middlewares/auth";

const categoryRouter = Router();

categoryRouter.get("/categories", getAllCategories);
categoryRouter.post("/category", isLoggedIn, isAdmin, createCategory);
categoryRouter.delete("/category/:id", removeCategory);
categoryRouter.put("/category/:id", isLoggedIn, isAdmin, updateCategory);

export default categoryRouter;
