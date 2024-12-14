import { errorResponse } from "@/helper/response";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const validationErrors = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return errorResponse(res, {
        statusCode: 400,
        message: "Validation failed",
        payload: validationErrors,
      });
    }
    next();
  };
};

export default validateRequest;
