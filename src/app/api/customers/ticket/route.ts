import { NextResponse } from "next/server";
import { action } from "@/lib/safe-action";
import {
  SupportTicketSchema,
  type SupportTicketApiResponse,
} from "@/types/support";
import { nanoid } from "nanoid";
import { z } from "zod";

// Helper function to generate ticket ID
function generateTicketId() {
  return `TCKT${nanoid(6).toUpperCase()}`;
}

// Create ticket action with validation
const createTicketAction = action(
  SupportTicketSchema,
  async (
    data: z.infer<typeof SupportTicketSchema>
  ): Promise<SupportTicketApiResponse> => {
    try {
      // Here you would typically save to your database
      const ticketId = generateTicketId();

      // Use the message from the validated data
      console.log("Creating ticket with message:", data.message);

      return {
        success: true,
        data: {
          ticket_id: ticketId,
          status: "submitted",
          message: "Your ticket has been received.",
        },
      };
    } catch (err: unknown) {
      console.error("Error creating ticket:", err);
      return {
        success: false,
        error: "Failed to create support ticket. Please try again.",
      };
    }
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = SupportTicketSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const result = await createTicketAction(validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
