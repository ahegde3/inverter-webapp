import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

// Create a safe action client with proper middleware configuration
export const { action } = createSafeActionClient({
  // Optional: Add middleware for handling errors, logging, etc.
  middleware: [],

  // Optional: Configure how errors are handled
  handleReturnedServerError: (err) => {
    console.error("Server error in action:", err);
    return {
      serverError: "An unexpected error occurred",
    };
  },

  // Optional: Configure how validation errors are handled
  handleServerErrorLog: (err) => {
    console.error("Validation error in action:", err);
  },
});
