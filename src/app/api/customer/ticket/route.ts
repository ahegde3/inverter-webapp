import { NextRequest, NextResponse } from "next/server";
import {
  ticketCreateSchema,
  ticketResponseSchema,
  type TicketResponse,
} from "@/lib/schema/ticket";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";

// Generate a unique ticket ID
function generateTicketId(): string {
  const prefix = "TKT";
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomPart}`.toUpperCase();
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<TicketResponse>> {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = ticketCreateSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse = {
        success: false,
        error: `Validation error: ${validationResult.error.message}`,
      };

      const validatedErrorResponse = ticketResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    const { customerId, deviceId, message } = validationResult.data;

    // // Verify that the customer exists
    // console.log("Verifying customer with customerId:", customerId);
    // const customerScanCommand = new ScanCommand({
    //   TableName: "Inverter-db",
    //   FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
    //   ExpressionAttributeValues: {
    //     ":pk": `USER#${emailId}`,
    //     ":sk": "PROFILE",
    //   },
    // });

    // const customerScanResult = await ddb.send(customerScanCommand);
    // const customerExists = customerScanResult.Items?.some(
    //   (item) => item.userId === customerId
    // );

    // if (!customerExists) {
    //   const errorResponse = {
    //     success: false,
    //     error: `Customer with ID ${customerId} not found.`,
    //   };

    //   const validatedErrorResponse = ticketResponseSchema.parse(errorResponse);
    //   return NextResponse.json(validatedErrorResponse, { status: 404 });
    // }

    // // Verify that the device exists and belongs to the customer
    // console.log("Verifying device with deviceId:", deviceId);
    // const deviceScanCommand = new ScanCommand({
    //   TableName: "Inverter-db",
    //   FilterExpression:
    //     "begins_with(PK, :pk) AND SK = :sk AND deviceId = :deviceId",
    //   ExpressionAttributeValues: {
    //     ":pk": "DEVICE#",
    //     ":sk": "PROFILE",
    //     ":deviceId": deviceId,
    //   },
    // });

    // const deviceScanResult = await ddb.send(deviceScanCommand);

    // if (!deviceScanResult.Items || deviceScanResult.Items.length === 0) {
    //   const errorResponse = {
    //     success: false,
    //     error: `Device with ID ${deviceId} not found.`,
    //   };

    //   const validatedErrorResponse = ticketResponseSchema.parse(errorResponse);
    //   return NextResponse.json(validatedErrorResponse, { status: 404 });
    // }

    // const device = deviceScanResult.Items[0];
    // if (device.customerId !== customerId) {
    //   const errorResponse = {
    //     success: false,
    //     error: `Device ${deviceId} does not belong to customer ${customerId}.`,
    //   };

    //   const validatedErrorResponse = ticketResponseSchema.parse(errorResponse);
    //   return NextResponse.json(validatedErrorResponse, { status: 403 });
    // }

    // Generate unique ticket ID and timestamp
    const ticketId = generateTicketId();
    const currentTimestamp = new Date().toISOString();

    // Create ticket record
    const ticketRecord = {
      PK: `TICKET#${ticketId}`,
      SK: "DETAILS",
      ticketId,
      customerId,
      deviceId,
      message,
      status: "OPEN",
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    console.log("Creating ticket record:", ticketRecord);

    const putCommand = new PutCommand({
      TableName: "Inverter-db",
      Item: ticketRecord,
      ConditionExpression: "attribute_not_exists(PK)",
    });

    await ddb.send(putCommand);

    console.log("Ticket created successfully with ID:", ticketId);

    const successResponse = {
      success: true,
      ticketId,
      message: "Support ticket created successfully",
    };

    const validatedSuccessResponse =
      ticketResponseSchema.parse(successResponse);

    return NextResponse.json(validatedSuccessResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating support ticket:", error);

    const errorResponse = {
      success: false,
      error: "Internal server error occurred while creating support ticket.",
    };

    const validatedErrorResponse = ticketResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
