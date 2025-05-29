import { NextRequest, NextResponse } from "next/server";

// Configure route for static export
export const dynamic = "force-static";

// Encryption key - should match the frontend key
const ENCRYPTION_KEY = "AceInverterSecureKey2024";

// Simple XOR decryption function (inverse of the frontend encryption)
const decryptPassword = (encryptedPassword: string): string => {
  try {
    // Base64 decode first
    const encrypted = atob(encryptedPassword);

    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      const encryptedChar = encrypted.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(encryptedChar ^ keyChar);
    }
    return decrypted;
  } catch (error) {
    console.error("Error decrypting password:", error);
    throw new Error("Password decryption failed");
  }
};

// Mock user credentials - in a real app, this would come from a database
const validUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  {
    id: "2",
    username: "john.doe",
    password: "password123",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
  },
  {
    id: "3",
    username: "jane.smith",
    password: "password123",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
  },
];

interface LoginRequest {
  username: string;
  password: string; // This will be the encrypted password from frontend
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string;
  };
  message: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();
    const { username, password } = body;
    console.log({ username, password });
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required.",
          message: "Login failed",
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Decrypt the password
    //let decryptedPassword: string;
    // try {
    //  // decryptedPassword = decryptPassword(encryptedPassword);
    //   console.log("Password decrypted successfully");
    // } catch (error) {
    //   console.error("Password decryption failed:", error);
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Invalid password format.",
    //       message: "Login failed"
    //     } as LoginResponse,
    //     { status: 400 }
    //   );
    // }

    // Validate credentials using decrypted password
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password.",
          message: "Login failed",
        } as LoginResponse,
        { status: 401 }
      );
    }

    // Generate a mock JWT token (in real app, use proper JWT library)
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log(
      `Successful login for user: ${user.username} (${user.firstName} ${user.lastName})`
    );

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: token,
      },
      message: `Welcome back, ${user.firstName}!`,
    } as LoginResponse);
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred during login.",
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
      error: "Method not allowed. Use POST for login.",
      message: "Method not allowed",
    },
    { status: 405 }
  );
}
