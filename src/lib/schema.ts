import { z } from "zod";

// User schema for authentication and user management
export const userSchema = z.object({
  userId: z.string(),
  emailId: z.string().email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Base schema for customer profile data
export const customerProfileSchema = z.object({
  //   PK: z.string().startsWith("CUSTOMER#"),
  //   SK: z.literal("PROFILE"),
  emailId: z.string().email(),
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

// Device schema for device registration
export const deviceRegistrationSchema = z.object({
  serialNo: z.string().min(1),
  device_type: z.string().min(1),
  manufacturing_data: z.string().min(1), // Note: keeping original name from spec
  waranty_end_date: z.string().min(1), // Note: keeping original name from spec
  customerId: z.string().min(1),
});

export type DeviceRegistration = z.infer<typeof deviceRegistrationSchema>;

// Device profile schema (stored in database)
export const deviceProfileSchema = z.object({
  deviceId: z.string(),
  serialNo: z.string(),
  deviceType: z.string(),
  manufacturingDate: z.string(),
  warrantyEndDate: z.string(),
  customerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DeviceProfile = z.infer<typeof deviceProfileSchema>;

// Schema for device registration response
export const deviceRegistrationResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      deviceId: z.string(),
      message: z.string(),
      error: z.undefined(),
    }),
    z.object({
      success: z.literal(false),
      deviceId: z.undefined(),
      message: z.undefined(),
      error: z.string(),
    }),
  ]
);

export type DeviceRegistrationResponse = z.infer<
  typeof deviceRegistrationResponseSchema
>;

// Schema for API response
export const customerApiResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.array(userSchema),
    error: z.undefined(),
  }),
  z.object({
    success: z.literal(false),
    data: z.undefined(),
    error: z.string(),
  }),
]);

export type CustomerApiResponse = z.infer<typeof customerApiResponseSchema>;

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

// Schema for customer update request
export const customerUpdateSchema = z.object({
  userId: z.string(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  emailId: z.string().email().optional(),
  phoneNo: z.string().optional(),
  address: z.string().min(1).optional(),
});

export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;

// Schema for customer update response
export const customerUpdateResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    // data: customerProfileSchema,
    message: z.string(),
    error: z.undefined(),
  }),
  z.object({
    success: z.literal(false),
    // data: z.undefined(),
    message: z.undefined(),
    error: z.string(),
  }),
]);

export type CustomerUpdateResponse = z.infer<
  typeof customerUpdateResponseSchema
>;

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

export type CustomerDeleteResponse = z.infer<
  typeof customerDeleteResponseSchema
>;

export interface Device {
  deviceId: string;
  serialNo: string;
  deviceType: string;
  manufacturingDate: string;
  warrantyEndDate: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export const deviceSchema = z.object({
  deviceId: z.string(),
  serialNo: z.string(),
  deviceType: z.string(),
  manufacturingDate: z.string(),
  warrantyEndDate: z.string(),
  customerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const deviceListResponseSchema = z.object({
  success: z.literal(true).or(z.literal(false)),
  devices: z.array(deviceSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type DeviceListResponse = z.infer<typeof deviceListResponseSchema>;
