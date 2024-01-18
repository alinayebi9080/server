import { Schema, Document, model } from "mongoose";

export interface ICategory extends Document {
  title: string;
  slug?: string;
  description?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
