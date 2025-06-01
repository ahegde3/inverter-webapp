import { useState } from "react";
import type {
  CustomerUpdateRequest,
  CustomerUpdateResponse,
  CustomerData,
} from "@/types/customer";
import type { CustomerProfile } from "@/lib/schema";

interface UseCustomerUpdateReturn {
  updateCustomer: (id: string, data: CustomerUpdateRequest) => Promise<CustomerData | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCustomerUpdate(): UseCustomerUpdateReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateCustomer = async (
    id: string,
    data: CustomerUpdateRequest
  ): Promise<CustomerData | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!id) {
        throw new Error("Customer ID is required");
      }

      const response = await fetch(`/api/customer/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as {
        success: boolean;
        data?: CustomerProfile;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.success === false 
            ? result.error 
            : `HTTP error! status: ${response.status}`
        );
      }

      if (result.success && result.data) {
        setSuccess(true);
        // Map the API response to CustomerData format
        const mappedCustomer: CustomerData = {
          id: id, // Use the provided ID since API response doesn't include it
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          emailId: result.data.email, // Map 'email' from CustomerProfile to 'emailId' in CustomerData
          address: result.data.address,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        };
        return mappedCustomer;
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err) {
      const errorMessage = 
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error updating customer:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCustomer,
    loading,
    error,
    success,
  };
} 