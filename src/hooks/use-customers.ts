import { useState, useEffect, useCallback } from "react";
import type {
  CustomerData,
  CustomerApiResponse,
  CustomerErrorResponse,
} from "@/types/customer";

interface UseCustomersOptions {
  search?: string;
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
}

export function useCustomers(
  options: UseCustomersOptions = {}
): UseCustomersReturn {
  // Destructure options to avoid dependency issues
  const { search, page, limit, sortBy, sortOrder } = options;

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

      const response = await fetch(`/api/customers?${params.toString()}`);
      const data: CustomerApiResponse = await response.json();
      console.log(data);

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
  }, [search, page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    pagination,
    refetch: fetchCustomers,
  };
}
