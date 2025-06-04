import { useState } from "react";
import CustomerListComponent from "./CustomerListComponent";
import Dashboard from "./Dashboard";

export default function DashboardTab() {
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  console.log("Customer data", selectedCustomerDetail);
  return (
    <div className="flex flex-col lg:flex-row lg:p-5 gap-4 lg:gap-0">
      <div className="lg:flex-shrink-0">
        <CustomerListComponent
          selectedCustomerDetail={selectedCustomerDetail}
          setSelectedCustomerDetail={setSelectedCustomerDetail}
        />
      </div>
      {selectedCustomerDetail && (
        <div className="flex-1 min-w-0">
          <Dashboard />
        </div>
      )}
    </div>
  );
}
