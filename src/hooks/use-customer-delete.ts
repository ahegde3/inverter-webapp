import { useState } from "react";
import type { CustomerDeleteResponse } from "@/lib/schema";

interface UseCustomerDeleteReturn {
  deleteCustomer: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCustomerDelete(): UseCustomerDeleteReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!id) {
        throw new Error("Customer ID is required");
      }

      const response = await fetch(`/api/customer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: CustomerDeleteResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.success === false 
            ? result.error 
            : `HTTP error! status: ${response.status}`
        );
      }

      if (result.success) {
        setSuccess(true);
        return true;
      } else {
        throw new Error(result.error || "Delete failed");
      }
    } catch (err) {
      const errorMessage = 
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error deleting customer:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCustomer,
    loading,
    error,
    success,
  };
} 