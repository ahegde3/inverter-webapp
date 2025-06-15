export interface CustomerData {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNo: string;
  dateOfBirth: string;
  state: string;
  city: string;
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
