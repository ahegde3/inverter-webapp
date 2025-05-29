import { z } from "zod";

export const UserRole = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
} as const;

export const UserRegistrationSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required").max(200),
  role: z
    .enum([UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN])
    .default(UserRole.CUSTOMER),
});

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  role: keyof typeof UserRole;
  created_at: string;
}

export interface AuthSuccessResponse {
  success: true;
  data: UserResponse;
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
}

export type AuthApiResponse = AuthSuccessResponse | AuthErrorResponse;
