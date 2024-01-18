import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; //  store hashed passwords
  avatar?: string; // URL or file path to user's avatar
  isAdmin: boolean;
  myList: {
    id: string;
    title: string;
    imageUrl: string;
    originalLanguage?: string;
    rating?: number;
  }[];
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  subscriptionStatus: "free" | "basic" | "premium";
  suspended?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    myList: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
        },
        originalLanguage: {
          type: String,
        },
      },
    ],
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    subscriptionStatus: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    suspended: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
