// Test file for customer update endpoint
// This is for manual testing during development

import type { CustomerUpdateRequest } from "@/types/customer";

const testCustomerUpdate = async () => {
  const customerId = "1"; // This should be the userId (numeric ID), not email
  const updateData: CustomerUpdateRequest = {
    first_name: "Jane",
    last_name: "Doe", 
    email: "jane.updated@example.com",
    address: "123 Updated Street, New City, NY 10001",
    role: "CUSTOMER"
  };

  try {
    console.log("Testing customer update endpoint...");
    console.log("Customer ID (userId):", customerId);
    console.log("Update data:", updateData);

    const response = await fetch(`/api/customer/${customerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", result);

    if (result.success) {
      console.log("✅ Customer updated successfully!");
      console.log("Updated customer:", result.data);
      console.log("Message:", result.message);
    } else {
      console.log("❌ Update failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Test with partial update (only updating address)
const testPartialUpdate = async () => {
  const customerId = "1";
  const updateData: CustomerUpdateRequest = {
    address: "456 Partial Update Ave, Test City, CA 90210"
  };

  try {
    console.log("Testing partial customer update...");
    console.log("Customer ID (userId):", customerId);
    console.log("Partial update data:", updateData);

    const response = await fetch(`/api/customer/${customerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    console.log("Partial update response status:", response.status);
    console.log("Partial update response data:", result);

    if (result.success) {
      console.log("✅ Customer partially updated successfully!");
      console.log("Updated customer:", result.data);
    } else {
      console.log("❌ Partial update failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Partial update test failed with error:", error);
  }
};

// Export for potential use in other test files
export { testCustomerUpdate, testPartialUpdate };

// Uncomment to run tests (for browser console testing)
// testCustomerUpdate();
// testPartialUpdate(); 