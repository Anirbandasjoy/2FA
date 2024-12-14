import { Response } from "express";
export const successResponse = (
  res: Response,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    payload,
  });
};

export const errorResponse = (
  res: Response,
  { statusCode = 500, message = "Internal Server Error", payload = {} }
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    payload,
  });
};
