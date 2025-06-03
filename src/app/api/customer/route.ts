import { NextRequest, NextResponse } from "next/server";
import {
  customerApiResponseSchema,
  type CustomerApiResponse,
  // customerProfileSchema,
  customerUpdateSchema,
  // type CustomerUpdate,
  customerUpdateResponseSchema,
  customerDeleteResponseSchema,
  type CustomerDeleteResponse,
  type CustomerUpdateResponse,
} from "@/lib/schema";
import { getUsersByRole, deleteUserById } from "@/lib/services/user.service";
import {
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";

export async function GET(): Promise<NextResponse<CustomerApiResponse>> {
  try {
    const users = await getUsersByRole("CUSTOMER");

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

export async function PATCH(
  request: NextRequest
): Promise<NextResponse<CustomerUpdateResponse>> {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = customerUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: `Validation error: ${validationResult.error.message}`,
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    const { emailId, ...updateData } = validationResult.data;

    if (!emailId) {
      const errorResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: "userId is required for updating a customer",
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // First find the customer using emailId filter
    console.log("Searching for customer with emailId:", emailId);
    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#${emailId}`,
        ":sk": "PROFILE",
      },
    });

    const scanResult = await ddb.send(scanCommand);
    console.log("Scan result:", scanResult);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      const errorResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: `Customer with emailId ${emailId} not found.`,
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 404 });
    }

    // const customer = scanResult.Items[0];

    // Build update expression dynamically based on provided fields
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number> = {};

    // Map request fields to database fields
    const fieldMappings: Record<string, string> = {
      firstName: "firstName",
      lastName: "lastName",
      emailId: "email",
      address: "address",
    };

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = fieldMappings[key];
        if (dbField) {
          const attrName = `#${dbField}`;
          const attrValue = `:${dbField}`;

          updateExpressions.push(`${attrName} = ${attrValue}`);
          expressionAttributeNames[attrName] = dbField;
          expressionAttributeValues[attrValue] = value;
        }
      }
    });

    const updateExpression = `SET ${updateExpressions.join(", ")}`;

    const updateCommand = new UpdateCommand({
      TableName: "Inverter-db",
      Key: {
        PK: `USER#${emailId}`,
        SK: "PROFILE",
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const updateResult = await ddb.send(updateCommand);
    console.log("Update result:", updateResult);

    const response: CustomerUpdateResponse = {
      success: true,
      message: "Customer updated successfully",
      error: undefined,
    };

    // Validate response with Zod schema
    const validatedResponse = customerUpdateResponseSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error updating customer:", error);

    const errorResponse = {
      success: false,
      message: undefined,
      error: "Internal server error occurred while updating customer",
    };

    // Validate error response
    const validatedErrorResponse =
      customerUpdateResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<CustomerDeleteResponse>> {
  try {
    const customerId = request.nextUrl.searchParams.get("customer_id");

    if (!customerId) {
      const errorResponse = {
        success: false,
        user_id: undefined,
        message: undefined,
        error: "customerId is required for deleting a customer",
      };

      const validatedErrorResponse =
        customerDeleteResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    const response = await deleteUserById(customerId);

    // Validate response with Zod schema
    const validatedResponse = customerDeleteResponseSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error deleting customer:", error);

    const errorResponse = {
      success: false,
      user_id: undefined,
      message: undefined,
      error: "Internal server error occurred while deleting customer",
    };

    // Validate error response
    const validatedErrorResponse =
      customerDeleteResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
