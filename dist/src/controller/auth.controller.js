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
exports.handleVerify2FACode =
  exports.handleDisable2FA =
  exports.handleEnable2FA =
  exports.handelRefreshToken =
  exports.handleLogOut =
  exports.handleLogin =
    void 0;
const config_1 = require("@/config");
const helper_1 = require("@/helper");
const response_1 = require("@/helper/response");
const user_model_1 = __importDefault(require("@/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = __importDefault(require("@/service/email"));
const handleLogin = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      if (!password) {
        return next((0, config_1.createError)(400, "Password is required"));
      }
      const user = yield user_model_1.default.findOne({ email });
      if (!user) {
        return next((0, config_1.createError)(404, "User not found"));
      }
      const matchPassword = yield bcryptjs_1.default.compare(
        password,
        user.password
      );
      if (!matchPassword) {
        return next((0, config_1.createError)(400, "Invalid credentials"));
      }
      if (!user.isActive) {
        return next(
          (0, config_1.createError)(400, "Please Active Your Account")
        );
      }
      if (user.twoFactorEnabled) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.twoFactorCode = code;
        user.twoFactorCodeExpiresAt = expiresAt;
        yield user.save();
        const emailData = {
          email: email,
          subject: "2FA Verification",
          html: `
          <p>2FA Code</p>
          <p>Your 2FA code is: ${code}</p>
        `,
        };
        yield (0, email_1.default)(emailData);
        return (0, response_1.successResponse)(res, {
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
        message: "Logged in successfully",
        payload: {
          _id: user._id,
          name: user === null || user === void 0 ? void 0 : user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleLogin = handleLogin;
const handleLogOut = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production",
      };
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      (0, response_1.successResponse)(res, {
        message: "LogOut successfully",
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleLogOut = handleLogOut;
const handelRefreshToken = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const oldRefreshToken = req.cookies.refreshToken;
      const decodedToken = jsonwebtoken_1.default.verify(
        oldRefreshToken,
        config_1.jwt_refresh_secret
      );
      if (typeof decodedToken !== "object" || !decodedToken.user) {
        throw (0, config_1.createError)(
          400,
          "Invalid refresh token. Please loginIn"
        );
      }
      const accessToken = (0, helper_1.createToken)(
        {
          user:
            decodedToken === null || decodedToken === void 0
              ? void 0
              : decodedToken.user,
        },
        config_1.jwt_access_secret,
        "15m"
      );
      if (!accessToken) {
        return next(
          (0, config_1.createError)(
            401,
            "Somthing was wrong not created access token"
          )
        );
      }
      (0, helper_1.setAccessTokenCookie)(res, accessToken);
      (0, response_1.successResponse)(res, {
        statusCode: 200,
        message: "New access token is genareted",
        payload: {},
      });
    } catch (error) {
      next(error);
    }
  });
exports.handelRefreshToken = handelRefreshToken;
const handleEnable2FA = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
      const user = yield user_model_1.default.findById(userId);
      if (!user) {
        return next((0, config_1.createError)(404, "User not found"));
      }
      const isMatch = yield bcryptjs_1.default.compare(password, user.password);
      if (!isMatch) {
        return next((0, config_1.createError)(400, "Incorrect password"));
      }
      user.twoFactorEnabled = true;
      yield user.save();
      (0, response_1.successResponse)(res, {
        message: "2FA enabled successfully",
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleEnable2FA = handleEnable2FA;
const handleDisable2FA = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
      const user = yield user_model_1.default.findById(userId);
      if (!user) {
        return next((0, config_1.createError)(404, "User not found"));
      }
      const isMatch = yield bcryptjs_1.default.compare(password, user.password);
      if (!isMatch) {
        return next((0, config_1.createError)(400, "Incorrect password"));
      }
      user.twoFactorEnabled = false;
      user.twoFactorCode = "";
      user.twoFactorCodeExpiresAt = null;
      yield user.save();
      (0, response_1.successResponse)(res, {
        message: "2FA has been disabled",
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleDisable2FA = handleDisable2FA;
const handleVerify2FACode = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, code } = req.body;
      const user = yield user_model_1.default.findOne({ email });
      if (!user) {
        return next((0, config_1.createError)(404, "User not found"));
      }
      if (user.twoFactorCode !== code) {
        return next((0, config_1.createError)(400, "Invalid 2FA code"));
      }
      if (user.twoFactorCodeExpiresAt === null) {
        return next(
          (0, config_1.createError)(400, "2FA code expiration not set")
        );
      }
      if (new Date() > new Date(user.twoFactorCodeExpiresAt)) {
        return next((0, config_1.createError)(400, "2FA code has expired"));
      }
      user.twoFactorCode = "";
      user.twoFactorCodeExpiresAt = null;
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
        message: "Logged in successfully",
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  });
exports.handleVerify2FACode = handleVerify2FACode;
