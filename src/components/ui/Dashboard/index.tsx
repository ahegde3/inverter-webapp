import { Component as ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, BarChart3, Home, Smartphone, Settings } from "lucide-react";
import data from "./data.json";

// import data from "./data.json";

export default function Dashboard() {
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
            <button className="lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-semibold">SolarSync</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col pb-16 lg:pb-0">
          <div className="@container/main flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 py-2 md:py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="flex flex-col gap-4 px-2 md:px-4 lg:px-6">
                <div className="w-full">
                  <ChartAreaInteractive />
                </div>
                <div className="w-full overflow-x-auto">
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center gap-1 p-2 text-primary">
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Trends</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">Devices</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
