import { z } from "zod";
import { userSchema } from "@/lib/schema";

// Login request schema
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Login response schema
export const loginResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.object({
      user: userSchema.omit({ password: true }),
      token: z.string(),
    }),
    message: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string(),
  }),
]);

export type LoginResponse = z.infer<typeof loginResponseSchema>;
