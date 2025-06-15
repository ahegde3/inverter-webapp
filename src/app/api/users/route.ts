import { NextRequest, NextResponse } from "next/server";
import { getUsersByRole } from "@/lib/services/user.service";
import { userSchema } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: "Role parameter is required",
        },
        { status: 400 }
      );
    }

    const users = await getUsersByRole(role);

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
} 