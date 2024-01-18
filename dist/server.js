"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const cors = require("cors");
// Set up Express
const app = (0, express_1.default)();
const port = process.env.PORT;
// Middleware to parse JSON
app.use((0, express_1.json)());
app.use(cors());
// Connect to MongoDB
mongoose_1.default.connect("mongodb+srv://rezarezaeijamiuk:myaqchiqN6RdaG81@cluster0.1jqnuhd.mongodb.net/streamingDB?retryWrites=true&w=majority", {});
// Check MongoDB connection
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
// Use the index router
app.use(indexRouter_1.default);
// Start the server
app.listen(8000, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// import express, { Application, json } from "express";
// import mongoose from "mongoose"; 
// import dotenv from "dotenv";
// dotenv.config();
// import indexRouter from "./routes/indexRouter";
// import cors = require("cors");
// // Set up Express
// const app: Application = express();
// const port = process.env.PORT;
// // Middleware to parse JSON
// app.use(json());
// app.use(cors());
// // Connect to MongoDB
// console.log("MongoDB URI:", process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI ||"mongodb://127.0.0.1:27017/streamingDB", {});
// // Check MongoDB connection
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });
// // Use the index router
// app.use(indexRouter);
// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
//# sourceMappingURL=server.js.map