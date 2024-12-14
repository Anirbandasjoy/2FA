import {
  handleFindAllUsers,
  handleGetCurrentUser,
  handleResendVerificationCode,
  handleUserRegistation,
  handleVerify,
} from "@/controller/user.controller";
import { isAdmin, isLogin } from "@/middlewares/auth.middleware";
import validateRequest from "@/schemas";
import {
  validateResendVarificationCode,
  validateUserSchema,
  validateVerifyUser,
} from "@/schemas/user.schema";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post(
  "/registation",
  validateRequest(validateUserSchema),
  handleUserRegistation
);

userRouter.post(
  "/verify-user",
  validateRequest(validateVerifyUser),
  handleVerify
);
userRouter.post(
  "/resend-verification-code",
  validateRequest(validateResendVarificationCode),
  handleResendVerificationCode
);

userRouter.get("/current-user", isLogin, handleGetCurrentUser);
userRouter.get("/find-all-users", isLogin, isAdmin, handleFindAllUsers);

export default userRouter;
