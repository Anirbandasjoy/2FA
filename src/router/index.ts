import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";

const rootRouter: Router = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/auth", authRouter);

export default rootRouter;
