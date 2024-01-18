"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middlewares/auth");
const categoryRouter = (0, express_1.Router)();
categoryRouter.get("/categories", categoryController_1.getAllCategories);
categoryRouter.post("/category", auth_1.isLoggedIn, auth_1.isAdmin, categoryController_1.createCategory);
categoryRouter.delete("/category/:id", categoryController_1.removeCategory);
categoryRouter.put("/category/:id", auth_1.isLoggedIn, auth_1.isAdmin, categoryController_1.updateCategory);
exports.default = categoryRouter;
//# sourceMappingURL=categoryRouter.js.map