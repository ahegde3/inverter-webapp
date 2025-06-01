import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { z } from "zod";
import { userSchema, type User } from "@/lib/schema";

// Configure route for static export
export const dynamic = "force-static";

// Encryption key - should match the frontend key
const ENCRYPTION_KEY = process.env.SECRET_KEY || "123456";

//Simple XOR encryption function
const encryptPassword = (password: string): string => {
  try {
    let encrypted = "";
    for (let i = 0; i < password.length; i++) {
      const passwordChar = password.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(passwordChar ^ keyChar);
    }
    // Base64 encode the encrypted string
    return btoa(encrypted);
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw new Error("Password encryption failed");
  }
};

// Login request schema
const loginRequestSchema = z.object({
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

type LoginResponse = z.infer<typeof loginResponseSchema>;

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

async function findUserByEmail({
  email,
}: {
  email: string;
}): Promise<User | null> {
  if (!email) return null;

  const params = {
    TableName: "Inverter-db",
    KeyConditionExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: {
      ":pk": `USER#${email}`,
      ":sk": "PROFILE",
    },
    Limit: 1,
  };

  const result = await ddb.send(new QueryCommand(params));

  if (!result.Items || result.Items.length === 0) return null;

  // Validate the DynamoDB response against our schema
  const userResult = userSchema.safeParse(result.Items[0]);
  if (!userResult.success) {
    console.error("Invalid user data from DynamoDB:", userResult.error);
    return null;
  }

  return userResult.data;
}
