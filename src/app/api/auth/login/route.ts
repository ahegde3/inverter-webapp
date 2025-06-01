import { NextRequest, NextResponse } from "next/server";
import { encryptPassword, findUserByEmail } from "@/lib/services/user.service";
import { loginRequestSchema, type LoginResponse } from "@/lib/schemas/auth";
import { userSchema } from "@/lib/schema";

// Configure route for static export
export const dynamic = "force-static";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = loginRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          message: "Validation failed: " + result.error.message,
        } as LoginResponse,
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const encryptedPassword: string = encryptPassword(password);

    // Find user
    const user = await findUserByEmail({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
          message: "Login failed",
        } as LoginResponse,
        { status: 401 }
      );
    }

    // TODO: Add proper password comparison here using bcrypt or similar
    if (user.password !== encryptedPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
          message: "Login failed",
        } as LoginResponse,
        { status: 401 }
      );
    }

    // Generate JWT token (mock for now)
    const token = `mock_jwt_token_${user.userId}_${Date.now()}`;

    // Remove password from response using type-safe omit
    const userWithoutPassword = userSchema.omit({ password: true }).parse(user);

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: `Welcome back, ${user.firstName}!`,
    } as LoginResponse);
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred during login",
        message: "Login failed",
      } as LoginResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST for login",
      message: "Method not allowed",
    } as LoginResponse,
    { status: 405 }
  );
}
