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

// Schema for individual ticket data structure
export const ticketSchema = z.object({
  ticketId: z.string(),
  customerId: z.string(),
  deviceId: z.string(),
  message: z.string(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  PK: z.string().optional(),
  SK: z.string().optional(),
});

// Schema for GET tickets response
export const ticketsGetResponseSchema = z.object({
  success: z.boolean(),
  tickets: z.array(ticketSchema).optional(),
  error: z.string().optional(),
});

// Schema for updating ticket status
export const ticketUpdateSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
});

// Schema for ticket update response
export const ticketUpdateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  ticket: z.object({
    ticketId: z.string(),
    status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
    updatedAt: z.string(),
  }).optional(),
  error: z.string().optional(),
});

// Schema for updating complete ticket details
export const ticketFullUpdateSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
});

// Schema for complete ticket update response
export const ticketFullUpdateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  ticket: z.object({
    ticketId: z.string(),
    customerId: z.string(),
    deviceId: z.string(),
    message: z.string(),
    status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
    updatedAt: z.string(),
  }).optional(),
  error: z.string().optional(),
});

export type TicketCreate = z.infer<typeof ticketCreateSchema>;
export type TicketResponse = z.infer<typeof ticketResponseSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type TicketsGetResponse = z.infer<typeof ticketsGetResponseSchema>;
export type TicketUpdate = z.infer<typeof ticketUpdateSchema>;
export type TicketUpdateResponse = z.infer<typeof ticketUpdateResponseSchema>;
export type TicketFullUpdate = z.infer<typeof ticketFullUpdateSchema>;
export type TicketFullUpdateResponse = z.infer<typeof ticketFullUpdateResponseSchema>;
