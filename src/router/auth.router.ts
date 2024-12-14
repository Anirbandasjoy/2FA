import {
  handelRefreshToken,
  handleDisable2FA,
  handleEnable2FA,
  handleLogin,
  handleLogOut,
  handleVerify2FACode,
} from "@/controller/auth.controller";
import { isLogin, isLogOut } from "@/middlewares/auth.middleware";
import validateRequest from "@/schemas";
import {
  validate2FACode,
  validate2FAEnabledDisabled,
  validateLogin,
} from "@/schemas/auth.schema";
import { Router } from "express";
const authRouter: Router = Router();
authRouter.post(
  "/login",
  isLogOut,
  validateRequest(validateLogin),
  handleLogin
);
authRouter.post("/logOut", isLogin, handleLogOut);
authRouter.get("/refresh-token", handelRefreshToken);
authRouter.post(
  "/enable-2fa",
  isLogin,
  validateRequest(validate2FAEnabledDisabled),
  handleEnable2FA
);
authRouter.post(
  "/disable-2fa",
  isLogin,
  validateRequest(validate2FAEnabledDisabled),
  handleDisable2FA
);
authRouter.put(
  "/verify-2fa",
  validateRequest(validate2FACode),
  handleVerify2FACode
);

export default authRouter;
