import type { CustomerData } from "@/types/customer";

// Mock customer data - in a real app, this would come from a database
export const customerDataList: CustomerData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    emailId: "john.doe@example.com",
    address: "123 Main St, New York, NY 10001",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    emailId: "jane.smith@example.com",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    emailId: "mike.johnson@example.com",
    address: "789 Pine Rd, Chicago, IL 60601",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    emailId: "sarah.williams@example.com",
    address: "321 Elm St, Houston, TX 77001",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    emailId: "david.brown@example.com",
    address: "654 Maple Dr, Phoenix, AZ 85001",
    createdAt: "2024-01-19T11:30:00Z",
    updatedAt: "2024-01-19T11:30:00Z",
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
    emailId: "emily.davis@example.com",
    address: "987 Cedar Ln, Philadelphia, PA 19101",
    createdAt: "2024-01-20T13:25:00Z",
    updatedAt: "2024-01-20T13:25:00Z",
  },
  {
    id: "7",
    firstName: "Robert",
    lastName: "Wilson",
    emailId: "robert.wilson@example.com",
    address: "147 Birch St, San Antonio, TX 78201",
    createdAt: "2024-01-21T08:40:00Z",
    updatedAt: "2024-01-21T08:40:00Z",
  },
];

interface FilterCustomersOptions {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function filterCustomers(options: FilterCustomersOptions = {}) {
  const {
    search,
    page = 1,
    limit = 10,
    sortBy = "firstName",
    sortOrder = "asc",
  } = options;

  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 100) {
    throw new Error(
      "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100."
    );
  }

  let filteredCustomers = [...customerDataList];

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(searchLower) ||
        customer.lastName.toLowerCase().includes(searchLower) ||
        customer.emailId.toLowerCase().includes(searchLower) ||
        customer.address.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filteredCustomers.sort((a, b) => {
    const aValue = a[sortBy as keyof CustomerData] || "";
    const bValue = b[sortBy as keyof CustomerData] || "";

    if (sortOrder === "desc") {
      return bValue.toString().localeCompare(aValue.toString());
    }
    return aValue.toString().localeCompare(bValue.toString());
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Calculate pagination metadata
  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    success: true,
    data: paginatedCustomers,
    pagination: {
      page,
      limit,
      totalCustomers,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
    query: {
      search: search || null,
      sortBy,
      sortOrder,
    },
  };
}
