import { createError, jwt_access_secret, jwt_refresh_secret } from "@/config";
import {
  accessRefreshTokenAndCookieSeter,
  createToken,
  setAccessTokenCookie,
} from "@/helper";
import { successResponse } from "@/helper/response";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { Response, Request, NextFunction, CookieOptions } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import sendingEmail from "@/service/email";

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return next(createError(400, "Password is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return next(createError(400, "Invalid credentials"));
    }

    if (!user.isActive) {
      return next(createError(400, "Please Active Your Account"));
    }

    if (user.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      user.twoFactorCode = code;
      user.twoFactorCodeExpiresAt = expiresAt;

      await user.save();

      const emailData = {
        email: email,
        subject: "2FA Verification",
        html: `
          <p>2FA Code</p>
          <p>Your 2FA code is: ${code}</p>
        `,
      };
      await sendingEmail(emailData);

      return successResponse(res, {
        message: "2FA code sent to email",
        payload: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    const data = {
      user: {
        _id: user._id as Types.ObjectId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      res,
      next,
    };

    await accessRefreshTokenAndCookieSeter(data);

    successResponse(res, {
      message: "Logged in successfully",
      payload: {
        _id: user._id,
        name: user?.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    successResponse(res, {
      message: "LogOut successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handelRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const decodedToken = jwt.verify(oldRefreshToken, jwt_refresh_secret);
    if (typeof decodedToken !== "object" || !decodedToken.user) {
      throw createError(400, "Invalid refresh token. Please loginIn");
    }

    const accessToken = createToken(
      {
        user: decodedToken?.user,
      },
      jwt_access_secret,
      "15m"
    );

    if (!accessToken) {
      return next(
        createError(401, "Somthing was wrong not created access token")
      );
    }

    setAccessTokenCookie(res, accessToken);
    successResponse(res, {
      statusCode: 200,
      message: "New access token is genareted",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export const handleEnable2FA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, "Incorrect password"));
    }
    user.twoFactorEnabled = true;
    await user.save();

    successResponse(res, {
      message: "2FA enabled successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handleDisable2FA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, "Incorrect password"));
    }

    user.twoFactorEnabled = false;
    user.twoFactorCode = "";
    user.twoFactorCodeExpiresAt = null;
    await user.save();

    successResponse(res, {
      message: "2FA has been disabled",
    });
  } catch (error) {
    next(error);
  }
};

export const handleVerify2FACode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.twoFactorCode !== code) {
      return next(createError(400, "Invalid 2FA code"));
    }

    if (user.twoFactorCodeExpiresAt === null) {
      return next(createError(400, "2FA code expiration not set"));
    }

    if (new Date() > new Date(user.twoFactorCodeExpiresAt)) {
      return next(createError(400, "2FA code has expired"));
    }

    user.twoFactorCode = "";
    user.twoFactorCodeExpiresAt = null;
    await user.save();

    const data = {
      user: {
        _id: user._id as Types.ObjectId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      res,
      next,
    };

    await accessRefreshTokenAndCookieSeter(data);

    successResponse(res, {
      message: "Logged in successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};
