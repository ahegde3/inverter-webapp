import { useState } from "react";
import CustomerListComponent from "./CustomerListComponent";
import Dashboard from "./Dashboard";
import type { CustomerData } from "@/types/customer";

export default function DashboardTab() {
  const [selectedCustomerDetail, setSelectedCustomerDetail] =
    useState<CustomerData | null>(null);

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
          <Dashboard selectedCustomerDetail={selectedCustomerDetail}/>
        </div>
      )}
    </div>
  );
}
