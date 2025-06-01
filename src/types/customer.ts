export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  success: boolean;
  data: CustomerData[];
  pagination: {
    page: number;
    limit: number;
    totalCustomers: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  query: {
    search: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

export interface CustomerErrorResponse {
  success: false;
  error: string;
}

export type CustomerApiResponse = CustomerResponse | CustomerErrorResponse;

// Types for customer update
export interface CustomerUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  role?: "CUSTOMER";
}

export interface CustomerUpdateSuccessResponse {
  success: true;
  data: CustomerData;
  message: string;
}

export interface CustomerUpdateErrorResponse {
  success: false;
  error: string;
}

export type CustomerUpdateResponse = CustomerUpdateSuccessResponse | CustomerUpdateErrorResponse;
