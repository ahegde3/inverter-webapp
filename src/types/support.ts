import { z } from "zod";

export const SupportTicketSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),
});

export type SupportTicketInput = z.infer<typeof SupportTicketSchema>;

export interface SupportTicketResponse {
  ticket_id: string;
  status: "submitted" | "in_progress" | "resolved" | "closed";
  message: string;
}

export interface SupportTicketErrorResponse {
  success: false;
  error: string;
}

export type SupportTicketApiResponse =
  | {
      success: true;
      data: SupportTicketResponse;
    }
  | SupportTicketErrorResponse;

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
