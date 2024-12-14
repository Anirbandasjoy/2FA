import { z } from "zod";

export const validateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const validateVerifyUser = z.object({
  email: z.string().email(),
  verificationCode: z.string(),
});

export const validateResendVarificationCode = z.object({
  email: z.string().email(),
});
