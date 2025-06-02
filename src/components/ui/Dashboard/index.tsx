"use client";

import { useState, useEffect } from "react";
import { Component as ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import data from "./data.json";
import { User } from "@/lib/schema";

// import data from "./data.json";

// Dashboard data interface based on our API response
interface DashboardItem {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    customerId: string;
    dashboardItems: DashboardItem[];
    metadata: {
      totalItems: number;
      lastUpdated: string;
    };
  };
  message: string;
}

interface DashboardState {
  data: DashboardItem[] | null;
  loading: boolean;
  error: string | null;
  customerId: string | null;
}

export default function Dashboard() {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
    customerId: null,
  });

  const callDashboardAPI = async (customerId: string) => {
    try {
      setDashboardState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        `/api/customer/dashboard?customer_id=${customerId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardResponse = await response.json();

      if (data.success) {
        console.log("Dashboard data retrieved successfully:", data);
        console.log("Dashboard items:", data.data.dashboardItems);

        // Store dashboard data in localStorage for persistence
        localStorage.setItem("dashboardData", JSON.stringify(data.data));
        localStorage.setItem("customerId", customerId);

        setDashboardState({
          data: data.data.dashboardItems,
          loading: false,
          error: null,
          customerId: customerId,
        });

        return data;
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error calling dashboard API:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load dashboard";
      setDashboardState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  useEffect(() => {
    // Call API when Dashboard component loads
    const loadDashboardData = async () => {
      try {
        // Check if we have stored customer ID from login
        const userData: User | null = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData")!)
          : null;

        if (!userData) return;

        const storedCustomerId = userData.userId;

        // If no stored customer ID, use default for demo
        const customerId = storedCustomerId || "123";

        console.log("Loading dashboard for customer:", customerId);
        await callDashboardAPI(customerId);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };

    loadDashboardData();
  }, []);

  // Loading state
  if (dashboardState.loading) {
    return (
      <div className="fixed ml-[50%] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            ⚠️ Error Loading Dashboard
          </div>
          <p className="text-gray-600">{dashboardState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" />   // add navbar here */}
      <SidebarInset>
        {/* Mobile-friendly Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-semibold">SolarSync</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              John Doe
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="flex flex-col gap-4 px-2 md:px-4 lg:px-6">
                <div className="w-full">
                  <ChartAreaInteractive />
                </div>
                <div className="w-full overflow-x-auto">
                  <DataTable data={data.projects} />
                </div>
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
