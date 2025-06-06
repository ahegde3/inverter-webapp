import { useState, useEffect, useCallback } from "react";
import type {
  CustomerData,
  CustomerApiResponse,
  CustomerErrorResponse,
} from "@/types/customer";
import { customerUpdateSchema } from "@/lib/schema";
import { UserRegistrationSchema } from "@/types/auth";

interface UseCustomersOptions {
  search?: string;
  setSelectedCustomerDetail?: (customer: CustomerData | null) => void;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UseCustomersReturn {
  customers: CustomerData[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalCustomers: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  refetch: () => void;
  deleteCustomer: (customerId: string) => Promise<void>;
  editCustomerData: (body: object) => Promise<void>;
  addNewCustomer: (body: object) => Promise<void>;
}

export function useCustomers(
  options: UseCustomersOptions = {}
): UseCustomersReturn {
  // Destructure options to avoid dependency issues
  const {
    search,
    page,
    limit,
    sortBy,
    sortOrder,
    setSelectedCustomerDetail = () => {},
  } = options;

  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<UseCustomersReturn["pagination"]>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const response = await fetch(`/api/customer?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? (data as CustomerErrorResponse).error
            : "Failed to fetch customers"
        );
      }

      if ("success" in data && data.success) {
        console.log(data.data);
        setCustomers(data.data);
        setSelectedCustomerDetail(data.data[0]);
        setPagination(data.pagination);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, sortBy, sortOrder, setSelectedCustomerDetail]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const deleteCustomer = async (customerId: string): Promise<void> => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/customer?customer_id=${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: CustomerApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? (data as CustomerErrorResponse).error
            : "Failed to delete customer"
        );
      }

      if ("success" in data && data.success) {
        // Refetch customers to update the list
        await fetchCustomers();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error deleting customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const editCustomerData = async (body: object) => {
    const validationResult = customerUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      throw new Error(
        validationResult.error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ")
      );
    }
    const customerId = validationResult.data.userId;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/customer?customer_id=${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data: CustomerApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? (data as CustomerErrorResponse).error
            : "Failed to update customer"
        );
      }

      if ("success" in data && data.success) {
        // Refetch customers to update the list
        await fetchCustomers();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error deleting customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNewCustomer = async (body: object) => {
    const validationResult = UserRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      throw new Error(
        validationResult.error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ")
      );
    }

    try {
      setLoading(true);
      setError(null);
      console.log(validationResult.data);
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data: CustomerApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? (data as CustomerErrorResponse).error
            : "Failed to update customer"
        );
      }

      if ("success" in data && data.success) {
        // Refetch customers to update the list
        await fetchCustomers();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error deleting customer:", err);
    } finally {
      setLoading(false);
    }
  };
  return {
    customers,
    loading,
    error,
    pagination,
    refetch: fetchCustomers,
    deleteCustomer,
    editCustomerData,
    addNewCustomer,
  };
}
