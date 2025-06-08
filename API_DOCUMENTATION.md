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

## Support Ticket API

### GET /api/customer/ticket

Retrieves all support tickets from the system.

#### Example Request

```bash
GET /api/customer/ticket
```

#### Response Format

**Success Response (200)**

```json
{
  "success": true,
  "tickets": [
    {
      "ticketId": "TKT1ABC23DEF",
      "customerId": "CUST001",
      "deviceId": "DEV001",
      "message": "Device not starting properly",
      "status": "OPEN",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "PK": "TICKET#TKT1ABC23DEF",
      "SK": "DETAILS"
    }
  ]
}
```

**Error Response (500)**

```json
{
  "success": false,
  "error": "Failed to fetch tickets from database"
}
```

### POST /api/customer/ticket

Creates a new support ticket.

#### Request Body

| Field        | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| `customerId` | string | Yes      | ID of the customer creating the ticket         |
| `deviceId`   | string | Yes      | ID of the device the ticket is about           |
| `emailId`    | string | Yes      | Customer's email address                       |
| `message`    | string | Yes      | Description of the issue (max 1000 characters) |

#### Example Request

```bash
POST /api/customer/ticket
Content-Type: application/json

{
  "customerId": "CUST001",
  "deviceId": "DEV001", 
  "emailId": "customer@example.com",
  "message": "Device is not starting properly after the latest update"
}
```

#### Response Format

**Success Response (201)**

```json
{
  "success": true,
  "ticketId": "TKT1ABC23DEF",
  "message": "Support ticket created successfully"
}
```

**Error Response (400)**

```json
{
  "success": false,
  "error": "Validation error: Message is required"
}
```

**Error Response (500)**

```json
{
  "success": false,
  "error": "Internal server error occurred while creating support ticket."
}
```

### PUT /api/customer/ticket

Updates an existing ticket. Supports both status-only updates and full ticket updates.

#### Request Body (Status Update Only)

| Field      | Type   | Required | Description                           |
| ---------- | ------ | -------- | ------------------------------------- |
| `ticketId` | string | Yes      | ID of the ticket to update            |
| `status`   | string | Yes      | New status: "OPEN", "IN_PROGRESS", "COMPLETED" |

#### Request Body (Full Update)

| Field        | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| `ticketId`   | string | Yes      | ID of the ticket to update                     |
| `customerId` | string | Yes      | Updated customer ID                            |
| `deviceId`   | string | Yes      | Updated device ID                              |
| `message`    | string | Yes      | Updated issue description (max 1000 characters) |
| `status`     | string | Yes      | Updated status: "OPEN", "IN_PROGRESS", "COMPLETED" |

#### Example Requests

##### Status Update Only

```bash
PUT /api/customer/ticket
Content-Type: application/json

{
  "ticketId": "TKT1ABC23DEF",
  "status": "IN_PROGRESS"
}
```

##### Full Ticket Update

```bash
PUT /api/customer/ticket
Content-Type: application/json

{
  "ticketId": "TKT1ABC23DEF",
  "customerId": "CUST001",
  "deviceId": "DEV001",
  "message": "Updated: Device is not starting properly. Customer reports intermittent power issues.",
  "status": "IN_PROGRESS"
}
```

#### Response Format

**Success Response - Status Update (200)**

```json
{
  "success": true,
  "message": "Ticket status updated successfully",
  "ticket": {
    "ticketId": "TKT1ABC23DEF",
    "status": "IN_PROGRESS",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

**Success Response - Full Update (200)**

```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "ticket": {
    "ticketId": "TKT1ABC23DEF",
    "customerId": "CUST001",
    "deviceId": "DEV001",
    "message": "Updated: Device is not starting properly. Customer reports intermittent power issues.",
    "status": "IN_PROGRESS",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

**Error Response (400)**

```json
{
  "success": false,
  "error": "Validation error: Ticket ID is required"
}
```

**Error Response (404)**

```json
{
  "success": false,
  "error": "Ticket not found"
}
```

**Error Response (500)**

```json
{
  "success": false,
  "error": "Failed to update ticket"
}
```

#### HTTP Status Codes

- `200 OK` - Ticket successfully retrieved/updated
- `201 Created` - Ticket successfully created
- `400 Bad Request` - Invalid request body or validation error
- `404 Not Found` - Ticket not found (for updates)
- `500 Internal Server Error` - Server error

#### Ticket Status Values

| Status        | Description                                          |
| ------------- | ---------------------------------------------------- |
| `OPEN`        | Ticket is newly created and waiting to be addressed |
| `IN_PROGRESS` | Ticket is being actively worked on                  |
| `COMPLETED`   | Ticket has been resolved and closed                 |

#### Usage Examples

##### JavaScript/TypeScript

```typescript
// Create a new ticket
const ticketData = {
  customerId: "CUST001",
  deviceId: "DEV001",
  emailId: "customer@example.com",
  message: "Device is not starting properly"
};

const createResponse = await fetch("/api/customer/ticket", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(ticketData),
});

const createResult = await createResponse.json();

// Get all tickets
const getResponse = await fetch("/api/customer/ticket");
const getResult = await getResponse.json();

// Update ticket status
const statusUpdate = {
  ticketId: "TKT1ABC23DEF",
  status: "IN_PROGRESS"
};

const statusResponse = await fetch("/api/customer/ticket", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(statusUpdate),
});

// Update complete ticket details
const fullUpdate = {
  ticketId: "TKT1ABC23DEF",
  customerId: "CUST001",
  deviceId: "DEV001", 
  message: "Updated issue description with more details",
  status: "IN_PROGRESS"
};

const fullResponse = await fetch("/api/customer/ticket", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(fullUpdate),
});
```

##### cURL

```bash
# Create a ticket
curl -X POST "http://localhost:3000/api/customer/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "deviceId": "DEV001",
    "emailId": "customer@example.com", 
    "message": "Device is not starting properly"
  }'

# Get all tickets
curl "http://localhost:3000/api/customer/ticket"

# Update ticket status only
curl -X PUT "http://localhost:3000/api/customer/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "TKT1ABC23DEF",
    "status": "IN_PROGRESS"
  }'

# Update complete ticket details  
curl -X PUT "http://localhost:3000/api/customer/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "TKT1ABC23DEF",
    "customerId": "CUST001",
    "deviceId": "DEV001",
    "message": "Updated issue description with more details",
    "status": "IN_PROGRESS"
  }'
```

#### Notes

- Ticket IDs are automatically generated with the format "TKT" + timestamp + random characters
- The API automatically determines between status-only updates and full updates based on the fields provided
- Status values are normalized and validated on both frontend and backend
- All tickets are stored in DynamoDB with the partition key format `TICKET#{ticketId}`
- Timestamps are in ISO 8601 format (UTC)
- The message field has a maximum length of 1000 characters
- When updating status only, other ticket fields remain unchanged
- When performing full updates, all fields (customerId, deviceId, message, status) must be provided
