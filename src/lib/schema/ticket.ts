import { z } from "zod";

export const ticketCreateSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  emailId: z.string(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),
});

export const ticketResponseSchema = z.object({
  success: z.boolean(),
  ticketId: z.string(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type TicketCreate = z.infer<typeof ticketCreateSchema>;
export type TicketResponse = z.infer<typeof ticketResponseSchema>;
