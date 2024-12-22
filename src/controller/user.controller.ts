import { errorResponse, successResponse } from "@/helper/response";
import User from "@/models/user.model";
import sendingEmail from "@/service/email";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { createError } from "@/config";
import { accessRefreshTokenAndCookieSeter } from "@/helper";
import { Types } from "mongoose";
import { findWithId } from "@/service";
export const handleUserRegistation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.isActive) {
    return next(createError(400, "User already exists and verified"));
  }

  if (existingUser) {
    if (!existingUser.isActive) {
      const newVerificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      existingUser.verificationCode = newVerificationCode;
      existingUser.verificationCodeExpiresAt = new Date(
        Date.now() + 3 * 60 * 1000
      );
      await existingUser.save();
      const emailData = {
        email: email,
        subject: "Verify Your Email Address",
        html: `
          <p>Resend Verification Code</p>
          <p>Your new verification code is: ${newVerificationCode}</p>
        `,
      };

      await sendingEmail(emailData);
      successResponse(res, {
        message: "Verification code resent, please check your email",
      });
    } else {
      return errorResponse(res, {
        message: "User already exists and is verified",
      });
    }
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const verificationCodeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

  await User.create({
    name,
    email,
    password: hashPassword,
    isActive: false,
    verificationCode,
    verificationCodeExpiresAt,
  });

  const newUserEmailData = {
    email: email,
    subject: "Verify Your Email Address",
    html: `
      <p>Verify Your Email Address</p>
      <p>Your verification code is: ${verificationCode}</p>
    `,
  };

  await sendingEmail(newUserEmailData);

  successResponse(res, {
    message: "User registered, please verify your email",
  });

  try {
  } catch (error) {
    next(error);
  }
};

export const handleVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.isActive) {
      return next(createError(400, "User is already verified"));
    }

    if (user.verificationCodeExpiresAt === null) {
      return next(
        createError(400, "User Verification code clearly not available")
      );
    }

    if (user.verificationCodeExpiresAt < new Date()) {
      return next(createError(400, "Verification code has expired"));
    }

    if (user.verificationCode !== verificationCode) {
      return next(createError(400, "Invalid verification code"));
    }

    user.isActive = true;
    user.verificationCode = "";
    user.verificationCodeExpiresAt = null;
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
      message: "Account verified and logged in successfully",
      payload: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleResendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    if (user.isActive) {
      return next(createError(404, "User is already verified"));
    }

    const newVerificationCode = Math.floor(
      1000 + Math.random() * 9000
    ).toString();
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await user.save();

    const emailData = {
      email: user.email,
      subject: "Resend Verification Code",
      html: `Your new verification code is: ${newVerificationCode}`,
    };

    await sendingEmail(emailData);

    successResponse(res, {
      message: "New verification code sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError(403, "User not authenticated"));
    }
    const currentUser = await findWithId(req.user._id, User);
    successResponse(res, {
      message: "Fetched current user successfully",
      payload: currentUser,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
      ],
    };
    const option = {
      password: 0,
      verificationCode: 0,
      verificationCodeExpiresAt: 0,
      isActive: 0,
    };
    const count = await User.countDocuments(filter);

    const users = await User.find(filter, option)
      .limit(limit)
      .skip((page - 1) * limit);

    if (!users || users.length === 0)
      return next(createError(404, "user not found"));
    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
