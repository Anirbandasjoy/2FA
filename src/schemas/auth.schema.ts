import { z } from "zod";

export const validateLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const validate2FAEnabledDisabled = z.object({
  password: z.string().min(8),
});

export const validate2FACode = z.object({
  email: z.string().email(),
  code: z.string(),
});
