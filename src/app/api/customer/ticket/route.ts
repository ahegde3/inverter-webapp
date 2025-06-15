import { NextRequest, NextResponse } from "next/server";
import {
  ticketCreateSchema,
  ticketResponseSchema,
  ticketsGetResponseSchema,
  ticketUpdateSchema,
  ticketUpdateResponseSchema,
  ticketFullUpdateSchema,
  ticketFullUpdateResponseSchema,
  type TicketResponse,
  type TicketsGetResponse,
  type TicketUpdateResponse,
  type TicketFullUpdateResponse,
} from "@/lib/schema/ticket";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

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

    const {
      customerId,
      deviceId,
      message,
      assignedTo = "",
      note = "",
    } = validationResult.data;


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
      assignedTo,
      note,
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

// GET method to fetch all tickets
export async function GET(): Promise<NextResponse<TicketsGetResponse>> {
  try {
    console.log("Fetching all tickets from database...");

    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": "TICKET#",
        ":sk": "DETAILS",
      },
    });

    const result = await ddb.send(scanCommand);
    const tickets = (result.Items || []) as DynamoDBTicket[];

    console.log(`Found ${tickets.length} tickets in database`);

    // Transform the data to match the frontend Ticket interface
    const transformedTickets = tickets.map((item: DynamoDBTicket) => {
      // Validate and normalize status
      let normalizedStatus = item.status?.trim().toUpperCase();

      // Map any variations to standard values
      switch (normalizedStatus) {
        case "OPEN":
        case "NEW":
        case "PENDING":
          normalizedStatus = "OPEN";
          break;
        case "IN_PROGRESS":
        case "IN-PROGRESS":
        case "INPROGRESS":
        case "PROCESSING":
        case "WORKING":
          normalizedStatus = "IN_PROGRESS";
          break;
        case "COMPLETED":
        case "COMPLETE":
        case "DONE":
        case "RESOLVED":
        case "CLOSED":
          normalizedStatus = "COMPLETED";
          break;
        default:
          console.warn(
            `Unknown status "${item.status}" for ticket ${item.ticketId}, defaulting to OPEN`
          );
          normalizedStatus = "OPEN";
      }
      console.log("item", item);
      return {
        ticketId: item.ticketId,
        customerId: item.customerId,
        deviceId: item.deviceId,
        message: item.message,
        assignedTo: item.assignedTo,
        note: item.note,
        status: normalizedStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        PK: item.PK,
        SK: item.SK,
      };
    });

    console.log(
      `Transformed ${transformedTickets.length} tickets with status distribution:`,
      transformedTickets.reduce((acc: Record<string, number>, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {})
    );

    const successResponse = {
      success: true,
      tickets: transformedTickets,
    };

    const validatedSuccessResponse =
      ticketsGetResponseSchema.parse(successResponse);
    return NextResponse.json(validatedSuccessResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);

    const errorResponse = {
      success: false,
      error: "Failed to fetch tickets from database",
    };

    const validatedErrorResponse =
      ticketsGetResponseSchema.parse(errorResponse);
    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}

// PUT method to update ticket (supports both status-only and full updates)
export async function PUT(
  request: NextRequest
): Promise<NextResponse<TicketUpdateResponse | TicketFullUpdateResponse>> {
  try {
    const body = await request.json();

    // Determine if this is a full update or status-only update
    const isFullUpdate = body.customerId || body.deviceId || body.message;

    if (isFullUpdate) {
      // Handle full ticket update
      const validationResult = ticketFullUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        const errorResponse = {
          success: false,
          error: `Validation error: ${validationResult.error.message}`,
        };

        const validatedErrorResponse =
          ticketFullUpdateResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 400 });
      }

      const { ticketId, customerId, deviceId, message, status } =
        validationResult.data;

      console.log(`Updating complete ticket details for ${ticketId}`);

      // Update the ticket in DynamoDB
      const updateCommand = new UpdateCommand({
        TableName: "Inverter-db",
        Key: {
          PK: `TICKET#${ticketId}`,
          SK: "DETAILS",
        },
        UpdateExpression:
          "SET customerId = :customerId, deviceId = :deviceId, message = :message, #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":customerId": customerId,
          ":deviceId": deviceId,
          ":message": message,
          ":status": status,
          ":updatedAt": new Date().toISOString(),
        },
        ConditionExpression: "attribute_exists(PK)",
        ReturnValues: "ALL_NEW",
      });

      const result = await ddb.send(updateCommand);

      if (!result.Attributes) {
        const errorResponse = {
          success: false,
          error: "Failed to update ticket",
        };

        const validatedErrorResponse =
          ticketFullUpdateResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 500 });
      }

      console.log(`Successfully updated ticket ${ticketId}`);

      const successResponse = {
        success: true,
        message: "Ticket updated successfully",
        ticket: {
          ticketId: result.Attributes.ticketId,
          customerId: result.Attributes.customerId,
          deviceId: result.Attributes.deviceId,
          message: result.Attributes.message,
          status: result.Attributes.status,
          updatedAt: result.Attributes.updatedAt,
        },
      };

      const validatedSuccessResponse =
        ticketFullUpdateResponseSchema.parse(successResponse);
      return NextResponse.json(validatedSuccessResponse, { status: 200 });
    } else {
      // Handle status-only update (backward compatibility)
      const validationResult = ticketUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        const errorResponse = {
          success: false,
          error: `Validation error: ${validationResult.error.message}`,
        };

        const validatedErrorResponse =
          ticketUpdateResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 400 });
      }

      const { ticketId, status } = validationResult.data;

      console.log(`Updating ticket ${ticketId} status to ${status}`);

      // Update the ticket status in DynamoDB
      const updateCommand = new UpdateCommand({
        TableName: "Inverter-db",
        Key: {
          PK: `TICKET#${ticketId}`,
          SK: "DETAILS",
        },
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": new Date().toISOString(),
        },
        ConditionExpression: "attribute_exists(PK)",
        ReturnValues: "ALL_NEW",
      });

      const result = await ddb.send(updateCommand);

      if (!result.Attributes) {
        const errorResponse = {
          success: false,
          error: "Failed to update ticket",
        };

        const validatedErrorResponse =
          ticketUpdateResponseSchema.parse(errorResponse);
        return NextResponse.json(validatedErrorResponse, { status: 500 });
      }

      console.log(
        `Successfully updated ticket ${ticketId} to status ${status}`
      );

      const successResponse = {
        success: true,
        message: "Ticket status updated successfully",
        ticket: {
          ticketId: result.Attributes.ticketId,
          status: result.Attributes.status,
          updatedAt: result.Attributes.updatedAt,
        },
      };

      const validatedSuccessResponse =
        ticketUpdateResponseSchema.parse(successResponse);
      return NextResponse.json(validatedSuccessResponse, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Error updating ticket:", error);

    let errorResponse;

    // Handle specific DynamoDB errors
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      errorResponse = {
        success: false,
        error: "Ticket not found",
      };
    } else {
      errorResponse = {
        success: false,
        error: "Failed to update ticket",
      };
    }

    const validatedErrorResponse =
      ticketUpdateResponseSchema.parse(errorResponse);
    return NextResponse.json(validatedErrorResponse, {
      status:
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
          ? 404
          : 500,
    });
  }
}

interface DynamoDBTicket {
  ticketId: string;
  customerId: string;
  assignedTo: string;
  note: string;
  deviceId: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  PK: string;
  SK: string;
}
