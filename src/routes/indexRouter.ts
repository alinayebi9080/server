import { Router } from "express";
import { index } from "../controllers/indexController";
import userRouter from "./userRouter";
import categoryRouter from "./categoryRouter";
import MovieRouter from "./movieRoutes";
const indexRouter = Router();

indexRouter.use(userRouter);
indexRouter.use(categoryRouter);
indexRouter.use(MovieRouter);

indexRouter.get("/", index);

export default indexRouter;
