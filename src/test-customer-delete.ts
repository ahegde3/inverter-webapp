// Test file for customer delete endpoint
// This is for manual testing during development

const testCustomerDelete = async () => {
  const customerId = "1"; // This should be the userId (numeric ID), not email

  try {
    console.log("Testing customer delete endpoint...");
    console.log("Customer ID (userId):", customerId);

    const response = await fetch(`/api/customer/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", result);

    if (result.success) {
      console.log("✅ Customer deleted successfully!");
      console.log("Deleted customer ID:", result.user_id);
      console.log("Message:", result.message);
    } else {
      console.log("❌ Delete failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Test with invalid customer ID
const testDeleteInvalidCustomer = async () => {
  const customerId = "999"; // Non-existent customer ID

  try {
    console.log("Testing delete with invalid customer ID...");
    console.log("Invalid Customer ID:", customerId);

    const response = await fetch(`/api/customer/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    console.log("Invalid ID response status:", response.status);
    console.log("Invalid ID response data:", result);

    if (!result.success) {
      console.log("✅ Correctly handled invalid customer ID");
      console.log("Error message:", result.error);
    } else {
      console.log("❌ Should have failed for invalid customer ID");
    }
  } catch (error) {
    console.error("❌ Invalid ID test failed with error:", error);
  }
};

// Export functions for use in browser console or testing
export { testCustomerDelete, testDeleteInvalidCustomer };

// Auto-run tests in development (uncomment to use)
// console.log("=== Customer Delete API Tests ===");
// testCustomerDelete();
// setTimeout(() => testDeleteInvalidCustomer(), 2000); 