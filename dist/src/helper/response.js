"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, { statusCode = 200, message = "Success", payload = {} }) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        payload,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, { statusCode = 500, message = "Internal Server Error", payload = {} }) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        payload,
    });
};
exports.errorResponse = errorResponse;
