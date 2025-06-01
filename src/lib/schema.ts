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

// Schema for customer update operations (all fields optional except role)
export const customerUpdateSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().min(1).optional(),
  role: z.literal("CUSTOMER").optional(),
});

// Type for customer update
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;

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

// Schema for customer update API response
export const customerUpdateResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: customerProfileSchema,
    message: z.string(),
    error: z.undefined(),
  }),
  z.object({
    success: z.literal(false),
    data: z.undefined(),
    message: z.undefined(),
    error: z.string(),
  }),
]);

export type CustomerUpdateResponse = z.infer<typeof customerUpdateResponseSchema>;

// Schema for customer delete API response
export const customerDeleteResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    user_id: z.string(),
    message: z.string(),
    error: z.undefined(),
  }),
  z.object({
    success: z.literal(false),
    user_id: z.undefined(),
    message: z.undefined(),
    error: z.string(),
  }),
]);

export type CustomerDeleteResponse = z.infer<typeof customerDeleteResponseSchema>;
