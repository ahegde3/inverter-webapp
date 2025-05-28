import { useState, useEffect } from "react";
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
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<UseCustomersReturn["pagination"]>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.search) params.append("search", options.search);
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.sortOrder) params.append("sortOrder", options.sortOrder);

      const response = await fetch(`/api/customers?${params.toString()}`);
      const data: CustomerApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? (data as CustomerErrorResponse).error
            : "Failed to fetch customers"
        );
      }

      if ("success" in data && data.success) {
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
  };

  useEffect(() => {
    fetchCustomers();
  }, [
    options.search,
    options.page,
    options.limit,
    options.sortBy,
    options.sortOrder,
  ]);

  return {
    customers,
    loading,
    error,
    pagination,
    refetch: fetchCustomers,
  };
}
