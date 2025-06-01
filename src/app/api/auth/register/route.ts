import { NextRequest } from "next/server";
import { UserRegistrationSchema, type AuthApiResponse } from "@/types/auth";
import { createUser, UserServiceError } from "@/lib/services/user.service";

// Configure route for static export
export const dynamic = "force-static";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = UserRegistrationSchema.parse(body);

    // Create user in DynamoDB
    const user = await createUser(validatedData);

    if (!user) throw new Error("User registration failed");

    const response: AuthApiResponse = {
      success: true,
      userId: user.userId,

      message: "User registered successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

    const errorResponse: AuthApiResponse = {
      success: false,
      error:
        error instanceof UserServiceError
          ? error.message
          : "Registration failed",
    };

    return Response.json(errorResponse, {
      status: error instanceof UserServiceError ? 400 : 500,
    });
  }
}
