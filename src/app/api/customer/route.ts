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
import {
  getUsersByRole,
  deleteUserById,
  updateUserById,
} from "@/lib/services/user.service";

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

    const response = await updateUserById(validationResult.data);
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
