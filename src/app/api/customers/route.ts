import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import {
  customerApiResponseSchema,
  type CustomerApiResponse,
} from "@/lib/schema";

export async function GET(): Promise<NextResponse<CustomerApiResponse>> {
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

    const response = {
      success: true as const,
      data: data.Items || [],
      error: undefined,
    } as const;

    // Validate response with Zod schema
    const validatedResponse = customerApiResponseSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching customers:", error);

    const errorResponse = {
      success: false as const,
      data: undefined,
      error: "Internal server error occurred while fetching customers.",
    } as const;

    // Validate error response
    const validatedErrorResponse =
      customerApiResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
