import { NextRequest, NextResponse } from "next/server";

// Configure route for dynamic handling since we're processing query parameters
export const dynamic = "force-dynamic";

// Mock dashboard data - using first 3 entries from data.json for testing
const dashboardData = [
  {
    id: 1,
    header: "Cover page",
    type: "Cover page",
    status: "In Process",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Table of contents",
    type: "Table of contents",
    status: "Done",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Executive summary",
    type: "Narrative",
    status: "Done",
    target: "10",
    limit: "13",
    reviewer: "Eddie Lake",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    // Validate required customer_id parameter
    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          error: "customer_id query parameter is required.",
        },
        { status: 400 }
      );
    }

    // Validate customer_id format (should be a number or string that can be converted to number)
    if (isNaN(Number(customerId))) {
      return NextResponse.json(
        {
          success: false,
          error: "customer_id must be a valid number.",
        },
        { status: 400 }
      );
    }

    // In a real application, you would fetch customer-specific dashboard data
    // For now, we're returning the same mock data for any valid customer_id
    const customerDashboardData = {
      customerId: customerId,
      dashboardItems: dashboardData,
      metadata: {
        totalItems: dashboardData.length,
        lastUpdated: new Date().toISOString(),
      },
    };

    // Return successful response
    return NextResponse.json({
      success: true,
      data: customerDashboardData,
      message: `Dashboard data retrieved for customer ${customerId}`,
    });
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Internal server error occurred while fetching customer dashboard.",
      },
      { status: 500 }
    );
  }
}
