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

## Device Registration API

### POST /api/device

Register a new device in the system.

#### Request Body

| Field               | Type   | Required | Description                                    |
| ------------------- | ------ | -------- | ---------------------------------------------- |
| `serialNo`          | string | Yes      | Unique serial number of the device             |
| `device_type`       | string | Yes      | Type of device (e.g., "INVERTER")             |
| `manufacturing_data`| string | Yes      | Manufacturing date of the device              |
| `waranty_end_date`  | string | Yes      | Warranty end date for the device              |
| `customerId`        | string | Yes      | ID of the customer registering the device     |

#### Example Request

```bash
POST /api/device
Content-Type: application/json

{
  "serialNo": "B455674",
  "device_type": "INVERTER",
  "manufacturing_data": "20 Aug 2024",
  "waranty_end_date": "20 Aug 2025",
  "customerId": "1234"
}
```

#### Response Format

**Success Response (201)**

```json
{
  "success": true,
  "deviceId": "A1234",
  "message": "Registration successful"
}
```

**Error Response (400)**

```json
{
  "success": false,
  "error": "Validation error: serialNo is required"
}
```

**Error Response (404)**

```json
{
  "success": false,
  "error": "Customer with ID 1234 not found."
}
```

**Error Response (409)**

```json
{
  "success": false,
  "error": "Device with serial number B455674 is already registered."
}
```

**Error Response (500)**

```json
{
  "success": false,
  "error": "Internal server error occurred while registering device."
}
```

#### HTTP Status Codes

- `201 Created` - Device successfully registered
- `400 Bad Request` - Invalid request body or validation error
- `404 Not Found` - Customer not found
- `409 Conflict` - Device with serial number already exists
- `500 Internal Server Error` - Server error

#### Usage Examples

##### JavaScript/TypeScript

```typescript
// Register a new device
const deviceData = {
  serialNo: "B455674",
  device_type: "INVERTER",
  manufacturing_data: "20 Aug 2024",
  waranty_end_date: "20 Aug 2025",
  customerId: "1234"
};

const response = await fetch("/api/device", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(deviceData),
});

const result = await response.json();

if (result.success) {
  console.log("Device registered with ID:", result.deviceId);
  console.log("Message:", result.message);
} else {
  console.error("Registration failed:", result.error);
}
```

##### cURL

```bash
curl -X POST "http://localhost:3000/api/device" \
  -H "Content-Type: application/json" \
  -d '{
    "serialNo": "B455674",
    "device_type": "INVERTER",
    "manufacturing_data": "20 Aug 2024",
    "waranty_end_date": "20 Aug 2025",
    "customerId": "1234"
  }'
```

#### Notes

- Each device must have a unique serial number
- The customer must exist in the system before registering a device
- Device IDs are automatically generated with the format "A" + timestamp + random characters
- All request fields are required and must be non-empty strings
- The system stores devices in DynamoDB with the partition key format `DEVICE#{deviceId}`
