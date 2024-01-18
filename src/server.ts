import express, { Application, json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import indexRouter from "./routes/indexRouter";
import cors = require("cors");

// Set up Express
const app: Application = express();
const port = process.env.PORT;

// Middleware to parse JSON
app.use(json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://rezarezaeijamiuk:myaqchiqN6RdaG81@cluster0.1jqnuhd.mongodb.net/streamingDB?retryWrites=true&w=majority",
  {}
);


// Check MongoDB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


// Use the index router
app.use(indexRouter);

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