import CustomerListComponent from "./CustomerListComponent";
import Dashboard from "./Dashboard";

export default function DashboardTab() {
  return (
    <div className="flex flex-col lg:flex-row lg:p-5 gap-4 lg:gap-0">
      <div className="lg:flex-shrink-0">
        <CustomerListComponent />
      </div>
      <div className="flex-1 min-w-0">
        <Dashboard />
      </div>
    </div>
  );
}
