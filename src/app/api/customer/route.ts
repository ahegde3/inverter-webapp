import { NextRequest, NextResponse } from "next/server";
import {
  customerApiResponseSchema,
  type CustomerApiResponse,
  // customerProfileSchema,
  customerUpdateSchema,
  // type CustomerUpdate,
  customerUpdateResponseSchema,
  customerDeleteResponseSchema,
  type CustomerProfile,
  type CustomerDeleteResponse,
  type CustomerUpdateResponse,
} from "@/lib/schema";
import { getUsersByRole } from "@/lib/services/user.service";
import {
  UpdateCommand,
  DeleteCommand,
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

    const customer = scanResult.Items[0];

    // Build update expression dynamically based on provided fields
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, string | number> = {};

    // Map request fields to database fields
    const fieldMappings: Record<string, string> = {
      first_name: "firstName",
      last_name: "lastName",
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

    // Always update the updatedAt field with current timestamp
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = Math.floor(
      Date.now() / 1000
    ).toString(); // Unix timestamp as string

    if (updateExpressions.length === 1) {
      // Only updatedAt was added, meaning no actual fields to update
      const errorResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: "No valid fields provided for update.",
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // Perform the update using the found customer's PK and SK
    console.log("Updating customer:", customer.PK);
    const updateCommand = new UpdateCommand({
      TableName: "Inverter-db",
      Key: {
        PK: customer.PK,
        SK: customer.SK,
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    });

    try {
      const updateResult = await ddb.send(updateCommand);
      console.log("Update result:", updateResult);

      if (!updateResult.Attributes) {
        throw new Error("Update operation did not return updated attributes");
      }

      // Transform the DynamoDB response to match our schema
      const updatedCustomer: CustomerProfile = {
        email: updateResult.Attributes.email,
        firstName: updateResult.Attributes.firstName,
        lastName: updateResult.Attributes.lastName,
        address: updateResult.Attributes.address,
        createdAt: new Date(
          parseInt(updateResult.Attributes.createdAt) * 1000
        ).toISOString(),
        updatedAt: new Date(
          parseInt(updateResult.Attributes.updatedAt) * 1000
        ).toISOString(),
      };

      const successResponse = {
        success: true,
        data: updatedCustomer,
        message: "Customer updated successfully",
        error: undefined,
      };

      const validatedSuccessResponse =
        customerUpdateResponseSchema.parse(successResponse);

      return NextResponse.json(validatedSuccessResponse, { status: 200 });
    } catch (error) {
      // Check if the error is a ConditionalCheckFailedException
      if (
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
      ) {
        const errorResponse = {
          success: false,
          data: undefined,
          message: undefined,
          error: `Customer with email ${emailId} not found or was deleted concurrently.`,
        };

        const validatedErrorResponse =
          customerUpdateResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 404 });
      }
      throw error; // Re-throw other errors to be caught by the outer catch block
    }
  } catch (error) {
    console.error("Error updating customer:", error);

    const errorResponse = {
      success: false,
      data: undefined,
      message: undefined,
      error: "Internal server error occurred while updating customer.",
    };

    const validatedErrorResponse =
      customerUpdateResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<CustomerDeleteResponse>> {
  try {
    console.log("Received request to delete customer");
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("customer_id");

    // Validate the customer ID
    if (!userId || typeof userId !== "string") {
      const errorResponse: CustomerDeleteResponse = {
        success: false,
        user_id: undefined,
        message: undefined,
        error: "Invalid customer ID provided.",
      };

      const validatedErrorResponse =
        customerDeleteResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // First find the customer using userId filter
    console.log("Searching for customer with userId:", userId);
    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression:
        "begins_with(PK, :pk) AND SK = :sk AND #userId = :userId",
      ExpressionAttributeValues: {
        ":pk": "USER#",
        ":sk": "PROFILE",
        ":userId": userId, // Convert to number since userId might be stored as number
      },
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
    });

    console.log("Scan command:", JSON.stringify(scanCommand.input, null, 2));
    const scanResult = await ddb.send(scanCommand);
    console.log("Scan result:", JSON.stringify(scanResult, null, 2));

    if (!scanResult.Items || scanResult.Items.length === 0) {
      // Let's try without the PK prefix to debug
      throw new Error("User not found");
    }

    const customer = scanResult.Items[0];

    // Now delete using the PK and SK from the found item
    const deleteCommand = new DeleteCommand({
      TableName: "Inverter-db",
      Key: {
        PK: customer.PK,
        SK: customer.SK,
      },
      ReturnValues: "ALL_OLD",
      ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    });

    try {
      const deleteResult = await ddb.send(deleteCommand);
      console.log("Delete result:", deleteResult);

      if (!deleteResult.Attributes) {
        throw new Error("Delete operation did not return deleted attributes");
      }

      const successResponse: CustomerDeleteResponse = {
        success: true,
        user_id: userId,
        message: "Customer deleted successfully",
        error: undefined,
      };

      const validatedSuccessResponse =
        customerDeleteResponseSchema.parse(successResponse);

      return NextResponse.json(validatedSuccessResponse, { status: 200 });
    } catch (error) {
      // Check if the error is a ConditionalCheckFailedException
      if (
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
      ) {
        const errorResponse: CustomerDeleteResponse = {
          success: false,
          user_id: undefined,
          message: undefined,
          error: `Customer with ID ${userId} not found or was deleted concurrently.`,
        };

        const validatedErrorResponse =
          customerDeleteResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 404 });
      }
      throw error; // Re-throw other errors to be caught by the outer catch block
    }
  } catch (error) {
    console.error("Error deleting customer:", error);

    const errorResponse: CustomerDeleteResponse = {
      success: false,
      user_id: undefined,
      message: undefined,
      error: "Internal server error occurred while deleting customer.",
    };

    const validatedErrorResponse =
      customerDeleteResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
