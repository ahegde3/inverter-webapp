import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";

export async function GET() {
  try {
    const data = await ddb.send(
      new ScanCommand({
        TableName: "Inverter-db",
        FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": "CUSTOMER#",
          ":sk": "PROFILE",
        },
      })
    );
    // Return response with data and metadata
    return NextResponse.json({
      success: true,
      data: data,
      // pagination: {
      //   page,
      //   limit,
      //   totalCustomers,
      //   totalPages,
      //   hasNextPage,
      //   hasPreviousPage,
      // },
      // query: {
      //   search: search || null,
      //   sortBy,
      //   sortOrder,
      // },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while fetching customers.",
      },
      { status: 500 }
    );
  }
}
