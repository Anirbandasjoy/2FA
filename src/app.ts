import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { createError } from "./config";
import { errorResponse, successResponse } from "./helper/response";
import rootRouter from "./router";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(morgan("dev"));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin: ["https://authnexus.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.get("/", (_req: Request, res: Response) => {
  successResponse(res, { message: "Welcome to the Authtication API" });
});

app.use("/api/v1", limiter, rootRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  return next(createError(404, "route not found"));
});

app.use(((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "An unexpected error occurred";

  errorResponse(res, { statusCode, message, payload: err });
}) as unknown as ErrorRequestHandler);

export default app;
