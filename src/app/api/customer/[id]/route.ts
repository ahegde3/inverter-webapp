import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import {
  customerUpdateSchema,
  customerUpdateResponseSchema,
  customerDeleteResponseSchema,
  type CustomerUpdateResponse,
  type CustomerUpdate,
  type CustomerDeleteResponse,
} from "@/lib/schema";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<CustomerUpdateResponse>> {
  try {
    console.log("Received request to update customer");
    const { id } = params;

    // Validate the customer ID
    if (!id || typeof id !== "string") {
      const errorResponse: CustomerUpdateResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: "Invalid customer ID provided.",
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    console.log("Request body:", body);
    const validationResult = customerUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse: CustomerUpdateResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: `Validation error: ${validationResult.error.message}`,
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    const updateData: CustomerUpdate = validationResult.data;

    // First, find the customer by userId to get the email (which is used in PK)
    console.log("Searching for customer with userId:", id);
    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk AND userId = :userId",
      ExpressionAttributeValues: {
        ":pk": "CUSTOMER#",
        ":sk": "PROFILE",
        ":userId": parseInt(id), // Convert to number since userId is stored as Number in DynamoDB
      },
    });

    const scanResult = await ddb.send(scanCommand);
    console.log("Scan result:", scanResult);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      const errorResponse: CustomerUpdateResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: `Customer with ID ${id} not found.`,
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 404 });
    }

    const existingCustomer = scanResult.Items[0];
    console.log("Found customer:", existingCustomer);

    // Extract the email from the existing customer to build the correct PK
    const customerEmail = existingCustomer.email;
    if (!customerEmail) {
      throw new Error("Customer email not found in database record");
    }

    // Build update expression dynamically based on provided fields
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Map request fields to database fields
    const fieldMappings: Record<keyof CustomerUpdate, string> = {
      first_name: "firstName",
      last_name: "lastName",
      email: "email",
      address: "address",
      role: "role", // This might be stored differently in your DB
    };

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = fieldMappings[key as keyof CustomerUpdate];
        const attrName = `#${dbField}`;
        const attrValue = `:${dbField}`;

        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = dbField;
        expressionAttributeValues[attrValue] = value;
      }
    });

    // Always update the updatedAt field with current timestamp
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = Math.floor(Date.now() / 1000).toString(); // Unix timestamp as string

    if (updateExpressions.length === 1) {
      // Only updatedAt was added, meaning no actual fields to update
      const errorResponse: CustomerUpdateResponse = {
        success: false,
        data: undefined,
        message: undefined,
        error: "No valid fields provided for update.",
      };

      const validatedErrorResponse =
        customerUpdateResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // Perform the update using the email-based PK
    console.log("Updating customer with PK:", `CUSTOMER#${customerEmail}`);
    const updateCommand = new UpdateCommand({
      TableName: "Inverter-db",
      Key: {
        PK: `CUSTOMER#${customerEmail}`,
        SK: "PROFILE",
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const updateResult = await ddb.send(updateCommand);
    console.log("Update result:", updateResult);

    if (!updateResult.Attributes) {
      throw new Error("Update operation did not return updated attributes");
    }

    // Transform the DynamoDB response to match our schema
    const updatedCustomer = {
      email: updateResult.Attributes.email,
      firstName: updateResult.Attributes.firstName,
      lastName: updateResult.Attributes.lastName,
      address: updateResult.Attributes.address,
      createdAt: new Date(parseInt(updateResult.Attributes.createdAt) * 1000).toISOString(),
      updatedAt: new Date(parseInt(updateResult.Attributes.updatedAt) * 1000).toISOString(),
    };

    const successResponse: CustomerUpdateResponse = {
      success: true,
      data: updatedCustomer,
      message: `Customer ${id} updated successfully.`,
      error: undefined,
    };

    const validatedSuccessResponse =
      customerUpdateResponseSchema.parse(successResponse);

    return NextResponse.json(validatedSuccessResponse, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);

    const errorResponse: CustomerUpdateResponse = {
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
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<CustomerDeleteResponse>> {
  try {
    console.log("Received request to delete customer");
    const { id } = params;

    // Validate the customer ID
    if (!id || typeof id !== "string") {
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

    // First, find the customer by userId to get the email (which is used in PK)
    console.log("Searching for customer with userId:", id);
    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk AND userId = :userId",
      ExpressionAttributeValues: {
        ":pk": "CUSTOMER#",
        ":sk": "PROFILE",
        ":userId": parseInt(id), // Convert to number since userId is stored as Number in DynamoDB
      },
    });

    const scanResult = await ddb.send(scanCommand);
    console.log("Scan result:", scanResult);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      const errorResponse: CustomerDeleteResponse = {
        success: false,
        user_id: undefined,
        message: undefined,
        error: `Customer with ID ${id} not found.`,
      };

      const validatedErrorResponse =
        customerDeleteResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 404 });
    }

    const existingCustomer = scanResult.Items[0];
    console.log("Found customer:", existingCustomer);

    // Extract the email from the existing customer to build the correct PK
    const customerEmail = existingCustomer.email;
    if (!customerEmail) {
      throw new Error("Customer email not found in database record");
    }

    // Perform the delete using the email-based PK
    console.log("Deleting customer with PK:", `CUSTOMER#${customerEmail}`);
    const deleteCommand = new DeleteCommand({
      TableName: "Inverter-db",
      Key: {
        PK: `CUSTOMER#${customerEmail}`,
        SK: "PROFILE",
      },
      ReturnValues: "ALL_OLD",
    });

    const deleteResult = await ddb.send(deleteCommand);
    console.log("Delete result:", deleteResult);

    if (!deleteResult.Attributes) {
      // The item might not have existed, but the delete operation succeeded
      console.log("Item was already deleted or did not exist");
    }

    const successResponse: CustomerDeleteResponse = {
      success: true,
      user_id: id,
      message: "Customer deleted successfully",
      error: undefined,
    };

    const validatedSuccessResponse =
      customerDeleteResponseSchema.parse(successResponse);

    return NextResponse.json(validatedSuccessResponse, { status: 200 });
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