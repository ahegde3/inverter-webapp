"use client";
import { useState } from "react";
import CustomerListComponent from "./CustomerListComponent";
import Navbar from "@/components/ui/Navbar";
import Dashboard from "./Dashboard";
import { TABS, TabName } from "@/types/navigation";

const TAB_COMPONENTS: Record<TabName, React.ReactNode> = {
  Dashboard: <Dashboard />,
  Customers: <CustomerListComponent />,
  Settings: <Dashboard />, // TODO: Replace with actual Settings component
};

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<TabName>(TABS[0]);

  return (
    <div>
      <Navbar
        tabList={TABS}
        onTabChange={setCurrentTab}
        currentTab={currentTab}
      />
      <div className="flex flex-col lg:flex-row lg:p-5 gap-4 lg:gap-0">
        <div className="flex-1 min-w-0">{TAB_COMPONENTS[currentTab]}</div>
      </div>
    </div>
  );
}
