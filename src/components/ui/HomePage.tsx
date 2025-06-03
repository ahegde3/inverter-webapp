"use client";
import { useState } from "react";
import CustomerListComponent from "./CustomerListComponent";
import Navbar from "@/components/ui/Navbar";
import DashboardTab from "@/components/ui/DashboardTab";
import { TABS, TabName } from "@/types/navigation";

const TAB_COMPONENTS: Record<TabName, React.ReactNode> = {
  Dashboard: <DashboardTab />,
  Customers: <CustomerListComponent />,
  Tickets: <DashboardTab />, // TODO: Replace with actual Settings component
};

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<TabName>("Dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        tabList={TABS}
        onTabChange={setCurrentTab}
        currentTab={currentTab}
      />
      <main className="flex-1">{TAB_COMPONENTS[currentTab]}</main>
    </div>
  );
}
