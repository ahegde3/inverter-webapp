import { NextRequest, NextResponse } from "next/server";
import {
  deviceRegistrationSchema,
  deviceRegistrationResponseSchema,
  type DeviceRegistrationResponse,
} from "@/lib/schema";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/dynamo";

// Generate a unique device ID
function generateDeviceId(): string {
  const prefix = "A";
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomPart}`.toUpperCase();
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<DeviceRegistrationResponse>> {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = deviceRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse = {
        success: false as const,
        deviceId: undefined,
        message: undefined,
        error: `Validation error: ${validationResult.error.message}`,
      };

      const validatedErrorResponse =
        deviceRegistrationResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    const {
      serialNo,
      device_type,
      manufacturing_data,
      waranty_end_date,
      customerId,
    } = validationResult.data;

    // Check if device with this serial number already exists
    console.log("Checking for existing device with serialNo:", serialNo);
    const scanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression:
        "begins_with(PK, :pk) AND SK = :sk AND serialNo = :serialNo",
      ExpressionAttributeValues: {
        ":pk": "DEVICE#",
        ":sk": "PROFILE",
        ":serialNo": serialNo,
      },
    });

    const scanResult = await ddb.send(scanCommand);
    console.log("Scan result:", scanResult);

    if (scanResult.Items && scanResult.Items.length > 0) {
      const errorResponse = {
        success: false as const,
        deviceId: undefined,
        message: undefined,
        error: `Device with serial number ${serialNo} is already registered.`,
      };

      const validatedErrorResponse =
        deviceRegistrationResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 409 });
    }

    // Verify that the customer exists
    console.log("Verifying customer with customerId:", customerId);
    const customerScanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#`,
        ":sk": "PROFILE",
      },
    });

    const customerScanResult = await ddb.send(customerScanCommand);
    const customerExists = customerScanResult.Items?.some(
      (item) => item.userId === customerId || item.email === customerId
    );

    if (!customerExists) {
      const errorResponse = {
        success: false as const,
        deviceId: undefined,
        message: undefined,
        error: `Customer with ID ${customerId} not found.`,
      };

      const validatedErrorResponse =
        deviceRegistrationResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 404 });
    }

    // Generate unique device ID
    const deviceId = generateDeviceId();
    const currentTimestamp = Math.floor(Date.now() / 1000).toString();

    // Create device record
    const deviceRecord = {
      PK: `DEVICE#${deviceId}`,
      SK: "PROFILE",
      deviceId,
      serialNo,
      deviceType: device_type,
      manufacturingDate: manufacturing_data,
      warrantyEndDate: waranty_end_date,
      customerId,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    console.log("Creating device record:", deviceRecord);

    const putCommand = new PutCommand({
      TableName: "Inverter-db",
      Item: deviceRecord,
      ConditionExpression: "attribute_not_exists(PK)",
    });

    await ddb.send(putCommand);

    console.log("Device registered successfully with ID:", deviceId);

    const successResponse = {
      success: true as const,
      deviceId,
      message: "Registration successful",
      error: undefined,
    };

    const validatedSuccessResponse =
      deviceRegistrationResponseSchema.parse(successResponse);

    return NextResponse.json(validatedSuccessResponse, { status: 201 });
  } catch (error) {
    console.error("Error registering device:", error);

    const errorResponse = {
      success: false as const,
      deviceId: undefined,
      message: undefined,
      error: "Internal server error occurred while registering device.",
    };

    const validatedErrorResponse =
      deviceRegistrationResponseSchema.parse(errorResponse);

    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
