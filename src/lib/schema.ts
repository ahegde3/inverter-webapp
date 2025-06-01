import { z } from "zod";

// Base schema for customer profile data
export const customerProfileSchema = z.object({
  //   PK: z.string().startsWith("CUSTOMER#"),
  //   SK: z.literal("PROFILE"),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  //   phoneNumber: z.string().optional(),
  //   companyName: z.string().min(1),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type for customer profile
export type CustomerProfile = z.infer<typeof customerProfileSchema>;



// Schema for API response
export const customerApiResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.array(customerProfileSchema),
    error: z.undefined(),
  }),
  z.object({
    success: z.literal(false),
    data: z.undefined(),
    error: z.string(),
  }),
]);

export type CustomerApiResponse = z.infer<typeof customerApiResponseSchema>;

// User schema for authentication and user management
export const userSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

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

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
