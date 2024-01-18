import { Request, Response } from "express";
import CategoryModel, { ICategory } from "../models/CategoryModel";
import mongoose from "mongoose";
import Category from "../models/CategoryModel";

interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

const createCategory = async (
  req: Request,
  res: Response<ApiResponse<ICategory | undefined>>
): Promise<Response<ApiResponse<ICategory | undefined>>> => {
  try {
    const { title, description, slug } = req.body;

    // Check if a category with the same title already exists
    const existingCategory = await CategoryModel.findOne({ title });

    if (existingCategory) {
      const response: ApiResponse<ICategory | undefined> = {
        error: "Category already exists",
        message: "A category with this title already exists",
      };
      return res.status(400).json(response);
    }

    // If the category doesn't exist, create a new one
    const newCategory = await CategoryModel.create({ title, description, slug });

    const response: ApiResponse<ICategory | undefined> = {
      message: "Category created successfully!",
      data: newCategory,
    };

    return res.status(201).json(response);
  } catch (error: unknown) {
    console.log("Error creating category:", error);

    const response: ApiResponse<ICategory | undefined> = {
      error: "Error creating category",
      message: (error as Error).message,
    };

    return res.status(500).json(response);
  }
};

const getAllCategories = async (
  req: Request,
  res: Response<ApiResponse<ICategory[] | undefined>>
): Promise<Response<ApiResponse<ICategory[] | undefined>>> => {
  try {
    const categoriesList = await CategoryModel.find();

    const response: ApiResponse<ICategory[]> = {
      data: categoriesList !== undefined ? categoriesList : [],
    };

    return res.status(200).json(response);
  } catch (error: unknown) {
    console.log("Error fetching categories:", error);

    const response: ApiResponse<ICategory[]> = {
      error: "Error fetching categories",
      message: (error as Error).message,
    };

    return res.status(500).json(response);
  }
};



const updateCategory = async (
  req: Request,
  res: Response<ApiResponse<ICategory | null>>
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate that id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<ICategory> = {
        error: "Invalid ObjectId",
        message: "The provided ID is not a valid ObjectId.",
      };

      res.status(400).json(response);
      return;
    }

    const categoryId = new mongoose.Types.ObjectId(id);
    const { title, description } = req.body;

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { title, description },
      { new: true }
    );

    if (!category) {
      const notFoundResponse: ApiResponse<ICategory> = {
        error: "Category not found",
        message: "Category not found!",
      };

      res.status(404).json(notFoundResponse);
      return;
    }

    const response: ApiResponse<ICategory | null> = {
      message: "Category updated successfully!",
      data: category,
    };

    res.json(response);
  } catch (error: unknown) {
    console.error("Error updating category:", error);

    if (error instanceof Error) {
      const response: ApiResponse<ICategory> = {
        error: "Error updating category",
        message: error.message,
      };

      res.status(500).json(response);
    } else {
      const response: ApiResponse<ICategory> = {
        error: "Unknown error",
      };

      res.status(500).json(response);
    }
  }
};



const removeCategory = async (
  req: Request,
  res: Response<ApiResponse<ICategory>>
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate that id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response: ApiResponse<ICategory> = {
        error: "Invalid ObjectId",
        message: "The provided ID is not a valid ObjectId.",
      };

      res.status(400).json(response);
      return;
    }

    // Convert the string id to ObjectId
    const categoryId = new mongoose.Types.ObjectId(id);

    const category = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      const notFoundResponse: ApiResponse<ICategory> = {
        error: "Category not found",
        message: "Category not found!",
      };

      res.status(404).json(notFoundResponse);
      return;
    }

    const response: ApiResponse<ICategory> = {
      message: "Category removed successfully!",
    };

    res.status(200).json(response);
  } catch (error: unknown) {
    console.error("Error removing category:", error);

    if (error instanceof Error) {
      const response: ApiResponse<ICategory> = {
        error: "Internal error",
        message: error.message,
      };

      res.status(500).json(response);
    } else {
      const response: ApiResponse<ICategory> = {
        error: "Unknown error",
      };

      res.status(500).json(response);
    }
  }
};


export { createCategory, removeCategory, getAllCategories, updateCategory };
