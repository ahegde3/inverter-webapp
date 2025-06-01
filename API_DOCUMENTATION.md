# API Documentation

## Customers API

### GET /api/customers

Retrieves a list of customers with optional filtering, pagination, and sorting.

#### Query Parameters

| Parameter   | Type   | Default     | Description                                                                    |
| ----------- | ------ | ----------- | ------------------------------------------------------------------------------ |
| `search`    | string | -           | Search customers by first name, last name, email, or address                   |
| `page`      | number | 1           | Page number for pagination (minimum: 1)                                        |
| `limit`     | number | 10          | Number of items per page (minimum: 1, maximum: 100)                            |
| `sortBy`    | string | "firstName" | Field to sort by (firstName, lastName, emailId, address, createdAt, updatedAt) |
| `sortOrder` | string | "asc"       | Sort order ("asc" or "desc")                                                   |

#### Example Requests

```bash
# Get all customers (default pagination)
GET /api/customers

# Search for customers
GET /api/customers?search=john

# Paginated results
GET /api/customers?page=2&limit=5

# Sorted results
GET /api/customers?sortBy=lastName&sortOrder=desc

# Combined parameters
GET /api/customers?search=smith&page=1&limit=10&sortBy=emailId&sortOrder=asc
```

#### Response Format

**Success Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "emailId": "john.doe@example.com",
      "address": "123 Main St, New York, NY 10001",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCustomers": 7,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "query": {
    "search": null,
    "sortBy": "firstName",
    "sortOrder": "asc"
  }
}
```

**Error Response (400)**

```json
{
  "success": false,
  "error": "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100."
}
```

**Error Response (500)**

```json
{
  "success": false,
  "error": "Internal server error occurred while fetching customers."
}
```

#### Response Fields

| Field                        | Type           | Description                                 |
| ---------------------------- | -------------- | ------------------------------------------- |
| `success`                    | boolean        | Indicates if the request was successful     |
| `data`                       | CustomerData[] | Array of customer objects                   |
| `pagination.page`            | number         | Current page number                         |
| `pagination.limit`           | number         | Number of items per page                    |
| `pagination.totalCustomers`  | number         | Total number of customers (after filtering) |
| `pagination.totalPages`      | number         | Total number of pages                       |
| `pagination.hasNextPage`     | boolean        | Whether there is a next page                |
| `pagination.hasPreviousPage` | boolean        | Whether there is a previous page            |
| `query.search`               | string\|null   | Applied search query                        |
| `query.sortBy`               | string         | Field used for sorting                      |
| `query.sortOrder`            | string         | Sort order applied                          |

#### Customer Data Fields

| Field       | Type   | Description                                       |
| ----------- | ------ | ------------------------------------------------- |
| `id`        | string | Unique customer identifier                        |
| `firstName` | string | Customer's first name                             |
| `lastName`  | string | Customer's last name                              |
| `emailId`   | string | Customer's email address                          |
| `address`   | string | Customer's address                                |
| `createdAt` | string | ISO 8601 timestamp when customer was created      |
| `updatedAt` | string | ISO 8601 timestamp when customer was last updated |

#### HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

#### Usage Examples

##### JavaScript/TypeScript

```typescript
// Fetch all customers
const response = await fetch("/api/customers");
const result = await response.json();

if (result.success) {
  console.log("Customers:", result.data);
  console.log("Total:", result.pagination.totalCustomers);
} else {
  console.error("Error:", result.error);
}

// Search with filters
const searchResponse = await fetch(
  "/api/customers?search=john&sortBy=lastName&sortOrder=desc"
);
const searchResult = await searchResponse.json();
```

##### cURL

```bash
# Basic request
curl "http://localhost:3000/api/customers"

# With search and pagination
curl "http://localhost:3000/api/customers?search=doe&page=1&limit=5"

# With sorting
curl "http://localhost:3000/api/customers?sortBy=emailId&sortOrder=desc"
```

#### Notes

- The API uses mock data for demonstration purposes
- In a production environment, this would connect to a real database
- All timestamps are in ISO 8601 format (UTC)
- Search is case-insensitive and matches partial strings
- The `id` field is a string to accommodate various ID formats (UUID, sequential, etc.)

### PATCH /api/customer/{id}

Updates an existing customer's information.

#### Path Parameters

| Parameter | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| `id`      | string | Yes      | Customer's userId (numeric ID, e.g., "1")     |

#### Request Body

| Field        | Type   | Required | Description                           |
| ------------ | ------ | -------- | ------------------------------------- |
| `first_name` | string | No       | Customer's first name                 |
| `last_name`  | string | No       | Customer's last name                  |
| `email`      | string | No       | Customer's email address              |
| `address`    | string | No       | Customer's address                    |
| `role`       | string | No       | Customer role (must be "CUSTOMER")    |

#### Example Requests

```bash
# Update customer name and email using userId
PATCH /api/customer/1
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com"
}

# Update customer address using userId
PATCH /api/customer/1
Content-Type: application/json

{
  "address": "456 Oak Street, New York, NY 10002"
}

# Update multiple fields using userId
PATCH /api/customer/1
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "address": "123 Main St",
  "role": "CUSTOMER"
}
```

#### Response Format

**Success Response (200)**

```json
{
  "success": true,
  "data": {
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "address": "456 Oak Street, New York, NY 10002",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  },
  "message": "Customer 1 updated successfully."
}
```

**Error Response (400) - Invalid ID**

```json
{
  "success": false,
  "error": "Invalid customer ID provided."
}
```

**Error Response (400) - Validation Error**

```json
{
  "success": false,
  "error": "Validation error: Invalid email format"
}
```

**Error Response (404) - Customer Not Found**

```json
{
  "success": false,
  "error": "Customer with ID 1 not found."
}
```

**Error Response (500) - Server Error**

```json
{
  "success": false,
  "error": "Internal server error occurred while updating customer."
}
```

#### Response Fields

| Field     | Type    | Description                              |
| --------- | ------- | ---------------------------------------- |
| `success` | boolean | Indicates if the request was successful  |
| `data`    | object  | Updated customer data (success only)     |
| `message` | string  | Success message (success only)           |
| `error`   | string  | Error message (error only)               |

#### Updated Customer Data Fields

| Field       | Type   | Description                                       |
| ----------- | ------ | ------------------------------------------------- |
| `email`     | string | Customer's email address                          |
| `firstName` | string | Customer's first name                             |
| `lastName`  | string | Customer's last name                              |
| `address`   | string | Customer's address                                |
| `createdAt` | string | ISO 8601 timestamp when customer was created     |
| `updatedAt` | string | ISO 8601 timestamp when customer was last updated|

#### HTTP Status Codes

- `200 OK` - Customer updated successfully
- `400 Bad Request` - Invalid request data or customer ID
- `404 Not Found` - Customer not found
- `500 Internal Server Error` - Server error

#### Usage Examples

##### JavaScript/TypeScript

```typescript
// Update customer information using userId
const updateCustomer = async (userId: string, updates: CustomerUpdateRequest) => {
  try {
    const response = await fetch(`/api/customer/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Customer updated:", result.data);
      console.log("Success message:", result.message);
      return result.data;
    } else {
      console.error("Update failed:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Example usage with userId
updateCustomer("1", {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane@example.com"
});
```

##### cURL

```bash
# Update customer name using userId
curl -X PATCH "http://localhost:3000/api/customer/1" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe"
  }'

# Update customer email and address using userId
curl -X PATCH "http://localhost:3000/api/customer/1" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "address": "456 Oak Street, New York, NY 10002"
  }'
```

#### Notes

- The `id` parameter should be the customer's `userId` (numeric ID like "1"), not the email
- The endpoint will first find the customer by `userId`, then use the found email to perform the update
- All fields in the request body are optional - you can update just the fields you need
- The `updatedAt` timestamp is automatically set to the current Unix timestamp when any field is updated
- Field validation is performed on all provided fields
- The customer must exist before it can be updated
- Timestamps are stored as Unix timestamps and converted to ISO 8601 format in responses
