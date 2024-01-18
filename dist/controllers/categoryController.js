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
exports.updateCategory = exports.getAllCategories = exports.removeCategory = exports.createCategory = void 0;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, slug } = req.body;
        // Check if a category with the same title already exists
        const existingCategory = yield CategoryModel_1.default.findOne({ title });
        if (existingCategory) {
            const response = {
                error: "Category already exists",
                message: "A category with this title already exists",
            };
            return res.status(400).json(response);
        }
        // If the category doesn't exist, create a new one
        const newCategory = yield CategoryModel_1.default.create({ title, description, slug });
        const response = {
            message: "Category created successfully!",
            data: newCategory,
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.log("Error creating category:", error);
        const response = {
            error: "Error creating category",
            message: error.message,
        };
        return res.status(500).json(response);
    }
});
exports.createCategory = createCategory;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesList = yield CategoryModel_1.default.find();
        const response = {
            data: categoriesList !== undefined ? categoriesList : [],
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log("Error fetching categories:", error);
        const response = {
            error: "Error fetching categories",
            message: error.message,
        };
        return res.status(500).json(response);
    }
});
exports.getAllCategories = getAllCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate that id is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            const response = {
                error: "Invalid ObjectId",
                message: "The provided ID is not a valid ObjectId.",
            };
            res.status(400).json(response);
            return;
        }
        const categoryId = new mongoose_1.default.Types.ObjectId(id);
        const { title, description } = req.body;
        const category = yield CategoryModel_1.default.findByIdAndUpdate(categoryId, { title, description }, { new: true });
        if (!category) {
            const notFoundResponse = {
                error: "Category not found",
                message: "Category not found!",
            };
            res.status(404).json(notFoundResponse);
            return;
        }
        const response = {
            message: "Category updated successfully!",
            data: category,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error updating category:", error);
        if (error instanceof Error) {
            const response = {
                error: "Error updating category",
                message: error.message,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                error: "Unknown error",
            };
            res.status(500).json(response);
        }
    }
});
exports.updateCategory = updateCategory;
const removeCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate that id is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            const response = {
                error: "Invalid ObjectId",
                message: "The provided ID is not a valid ObjectId.",
            };
            res.status(400).json(response);
            return;
        }
        // Convert the string id to ObjectId
        const categoryId = new mongoose_1.default.Types.ObjectId(id);
        const category = yield CategoryModel_1.default.findByIdAndDelete(categoryId);
        if (!category) {
            const notFoundResponse = {
                error: "Category not found",
                message: "Category not found!",
            };
            res.status(404).json(notFoundResponse);
            return;
        }
        const response = {
            message: "Category removed successfully!",
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error removing category:", error);
        if (error instanceof Error) {
            const response = {
                error: "Internal error",
                message: error.message,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                error: "Unknown error",
            };
            res.status(500).json(response);
        }
    }
});
exports.removeCategory = removeCategory;
//# sourceMappingURL=categoryController.js.map