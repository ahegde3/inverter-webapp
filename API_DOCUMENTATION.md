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
