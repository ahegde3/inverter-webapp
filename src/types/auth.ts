import { z } from "zod";

export const UserRole = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const UserRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  emailId: z.string().email("Invalid email address"),
  phoneNo: z.string().optional(),
  address: z.string().min(1, "Address is required").max(200).optional(),
  password: z.string().optional(),
  dateOfBirth: z.string().optional(),
  state: z.string().optional(),

  role: z
    .enum([
      UserRole.CUSTOMER,
      UserRole.ADMIN,
      UserRole.TECHNICIAN,
      UserRole.SUPER_ADMIN,
    ])
    .default(UserRole.CUSTOMER),
});

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;

export interface UserResponse {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  role: string;
  created_at: string;
}

export interface AuthSuccessResponse {
  success: true;
  userId: string;
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
}

export type AuthApiResponse = AuthSuccessResponse | AuthErrorResponse;
