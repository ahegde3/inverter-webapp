import { NextResponse } from "next/server";
import {
  customerApiResponseSchema,
  type CustomerApiResponse,
} from "@/lib/schema";
import { getUsersByRole } from "@/lib/services/user.service";

export async function GET(): Promise<NextResponse<CustomerApiResponse>> {
  try {
    const users = await getUsersByRole("CUSTOMER");
    // const data = await ddb.send(
    //   new ScanCommand({
    //     TableName: "Inverter-db",
    //     FilterExpression: "begins_with(PK, :pk) AND SK = :sk AND #role = :role",
    //     ExpressionAttributeValues: {
    //       ":pk": "USER#",
    //       ":sk": "PROFILE",
    //       ":role": "CUSTOMER",
    //     },
    //     ExpressionAttributeNames: {
    //       "#role": "role",
    //     },
    //   })
    // );
    console.log("users", users);
    const response = {
      success: true as const,
      data: users,
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
