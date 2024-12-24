import { createError, jwt_access_secret } from "@/config";
import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return next(createError(401, "Access token not found, please loggedIn"));
    }
    const decode = jwt.verify(accessToken, jwt_access_secret) as JwtPayload;
    if (!decode) {
      return next(createError(401, "Invalid token"));
    }
    if (!(decode as any).user) {
      return next(createError(401, "Token does not contain user information"));
    }

    req.user = (decode as any).user;
    next();
  } catch (error) {
    next(error);
  }
};

export const isLogOut = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      return next(createError(401, "User already logged in"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      if (req.user.role !== 2000080) {
        return next(createError(403, "Fobidden access"));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
