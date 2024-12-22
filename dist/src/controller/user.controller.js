"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFindAllUsers =
  exports.handleGetCurrentUser =
  exports.handleResendVerificationCode =
  exports.handleVerify =
  exports.handleUserRegistation =
    void 0;
const response_1 = require("@/helper/response");
const user_model_1 = __importDefault(require("@/models/user.model"));
const email_1 = __importDefault(require("@/service/email"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("@/config");
const helper_1 = require("@/helper");
const service_1 = require("@/service");
const handleUserRegistation = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
      if (!existingUser.isActive) {
        const newVerificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        existingUser.verificationCode = newVerificationCode;
        existingUser.verificationCodeExpiresAt = new Date(
          Date.now() + 3 * 60 * 1000
        );
        yield existingUser.save();
        const emailData = {
          email: email,
          subject: "Verify Your Email Address",
          html: `
          <p>Resend Verification Code</p>
          <p>Your new verification code is: ${newVerificationCode}</p>
        `,
        };
        yield (0, email_1.default)(emailData);
        (0, response_1.successResponse)(res, {
          message: "Verification code resent, please check your email",
        });
      } else {
        return (0, response_1.errorResponse)(res, {
          message: "User already exists and is verified",
        });
      }
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
    yield user_model_1.default.create({
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
    yield (0, email_1.default)(newUserEmailData);
    (0, response_1.successResponse)(res, {
      message: "User registered, please verify your email",
    });
    try {
    } catch (error) {
      next(error);
    }
  });
exports.handleUserRegistation = handleUserRegistation;
const handleVerify = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
      const user = yield user_model_1.default.findOne({ email });
      if (!user) {
        return next((0, config_1.createError)(404, "User not found"));
      }
      if (user.verificationCodeExpiresAt === null) {
        return next(
          (0, config_1.createError)(
            400,
            "User Verification code clearly not available"
          )
        );
      }
      if (user.verificationCodeExpiresAt < new Date()) {
        return next(
          (0, config_1.createError)(400, "Verification code has expired")
        );
      }
      if (user.verificationCode !== verificationCode) {
        return next(
          (0, config_1.createError)(400, "Invalid verification code")
        );
      }
      user.isActive = true;
      user.verificationCode = "";
      user.verificationCodeExpiresAt = null;
      yield user.save();
      const data = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        res,
        next,
      };
      yield (0, helper_1.accessRefreshTokenAndCookieSeter)(data);
      (0, response_1.successResponse)(res, {
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
  });
exports.handleVerify = handleVerify;
const handleResendVerificationCode = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
      const user = yield user_model_1.default.findOne({ email });
      if (!user) return next((0, config_1.createError)(404, "User not found"));
      if (user.isActive) {
        return next((0, config_1.createError)(404, "User is already verified"));
      }
      const newVerificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      user.verificationCode = newVerificationCode;
      user.verificationCodeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
      yield user.save();
      const emailData = {
        email: user.email,
        subject: "Resend Verification Code",
        html: `Your new verification code is: ${newVerificationCode}`,
      };
      yield (0, email_1.default)(emailData);
      (0, response_1.successResponse)(res, {
        message: "New verification code sent to your email",
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleResendVerificationCode = handleResendVerificationCode;
const handleGetCurrentUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.user) {
        return next((0, config_1.createError)(403, "User not authenticated"));
      }
      const currentUser = yield (0, service_1.findWithId)(
        req.user._id,
        user_model_1.default
      );
      (0, response_1.successResponse)(res, {
        message: "Fetched current user successfully",
        payload: currentUser,
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleGetCurrentUser = handleGetCurrentUser;
const handleFindAllUsers = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
      const count = yield user_model_1.default.countDocuments(filter);
      const users = yield user_model_1.default
        .find(filter, option)
        .limit(limit)
        .skip((page - 1) * limit);
      if (!users || users.length === 0)
        return next((0, config_1.createError)(404, "user not found"));
      return (0, response_1.successResponse)(res, {
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
  });
exports.handleFindAllUsers = handleFindAllUsers;
