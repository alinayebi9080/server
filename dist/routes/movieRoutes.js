"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MovieController_1 = require("../controllers/MovieController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/auth/addMovie", auth_1.isLoggedIn, auth_1.isAdmin, MovieController_1.createMovie);
router.put("/update/:movieId", auth_1.isLoggedIn, auth_1.isAdmin, MovieController_1.updateMovie);
router.get("/MoviesList", auth_1.isLoggedIn, auth_1.isAdmin, MovieController_1.getMovies);
router.delete("/delete/:movieId", auth_1.isLoggedIn, auth_1.isAdmin, MovieController_1.deleteMovie);
exports.default = router;
//# sourceMappingURL=movieRoutes.js.map