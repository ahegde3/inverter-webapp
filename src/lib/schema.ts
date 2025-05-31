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
