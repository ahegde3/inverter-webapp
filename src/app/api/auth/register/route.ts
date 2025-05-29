import { NextResponse } from "next/server";
import { action } from "@/lib/safe-action";
import { UserRegistrationSchema, type AuthApiResponse } from "@/types/auth";
import { nanoid } from "nanoid";

// Helper function to generate user ID
function generateUserId() {
  return `USR${nanoid(10).toUpperCase()}`;
}

// Create registration action with validation
const registerUserAction = action(
  UserRegistrationSchema,
  async (data): Promise<AuthApiResponse> => {
    try {
      // Here you would typically:
      // 1. Check if email already exists
      // 2. Hash the password if you're adding password later
      // 3. Save to your database
      const userId = generateUserId();

      // Use the validated data
      console.log("Registering user:", {
        ...data,
        id: userId,
      });

      return {
        success: true,
        data: {
          id: userId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          address: data.address,
          role: data.role,
          created_at: new Date().toISOString(),
        },
        message: "User registered successfully",
      };
    } catch (err: unknown) {
      console.error("Error registering user:", err);
      return {
        success: false,
        error: "Failed to register user. Please try again.",
      };
    }
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = UserRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const result = await registerUserAction(validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
