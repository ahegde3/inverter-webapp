import { NextRequest, NextResponse } from "next/server";
import type { AuthApiResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    } as AuthApiResponse);

    // Clear the session token cookie
    response.cookies.delete("session-token");

    return response;
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred during logout",
      } as AuthApiResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST for logout",
    } as AuthApiResponse,
    { status: 405 }
  );
}
