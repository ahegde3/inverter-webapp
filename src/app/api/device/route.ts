import { NextRequest, NextResponse } from "next/server";
import {
  deviceRegistrationSchema,
  deviceRegistrationResponseSchema,
  type DeviceRegistrationResponse,
  deviceListResponseSchema,
  type DeviceListResponse,
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
        ":sk": "METADATA",
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

    // Generate unique device ID
    const deviceId = generateDeviceId();
    const currentTimestamp = Math.floor(Date.now() / 1000).toString();

    // Create device record
    const deviceRecord = {
      PK: `DEVICE#${deviceId}`,
      SK: "METADATA",
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

export async function GET(
  request: NextRequest
): Promise<NextResponse<DeviceListResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    if (!customerId) {
      const errorResponse = {
        success: false as const,
        devices: undefined,
        error: "Customer ID is required",
      };
      const validatedErrorResponse =
        deviceListResponseSchema.parse(errorResponse);
      return NextResponse.json(validatedErrorResponse, { status: 400 });
    }

    // Fetch all devices for the customer
    const deviceScanCommand = new ScanCommand({
      TableName: "Inverter-db",
      FilterExpression:
        "begins_with(PK, :pk) AND SK = :sk AND customerId = :customerId",
      ExpressionAttributeValues: {
        ":pk": "DEVICE#",
        ":sk": "METADATA",
        ":customerId": customerId,
      },
    });

    const deviceScanResult = await ddb.send(deviceScanCommand);

    if (!deviceScanResult.Items || deviceScanResult.Items.length === 0) {
      const response = {
        success: true as const,
        devices: [],
        message: "No devices found for this customer",
      };
      const validatedResponse = deviceListResponseSchema.parse(response);
      return NextResponse.json(validatedResponse);
    }

    const devices = deviceScanResult.Items.map((item) => ({
      deviceId: item.deviceId,
      serialNo: item.serialNo,
      deviceType: item.deviceType,
      manufacturingDate: item.manufacturingDate,
      warrantyStartDate: item.warrantyStartDate,
      warrantyEndDate: item.warrantyEndDate,
      customerId: item.customerId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const successResponse = {
      success: true as const,
      devices,
      message: "Devices retrieved successfully",
    };

    const validatedResponse = deviceListResponseSchema.parse(successResponse);
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching devices:", error);

    const errorResponse = {
      success: false as const,
      devices: undefined,
      error: "Internal server error occurred while fetching devices",
    };

    const validatedErrorResponse =
      deviceListResponseSchema.parse(errorResponse);
    return NextResponse.json(validatedErrorResponse, { status: 500 });
  }
}
