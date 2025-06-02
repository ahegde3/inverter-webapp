import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { MdOutlineElectricBolt } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { MdElectricalServices } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import data from "@/components/ui/Dashboard/data.json";

export function SectionCards() {
  // Get the latest solar customer data
  const solarCustomer = data.solarCustomers[0];
  const latestDayData = solarCustomer.dailyData[solarCustomer.dailyData.length - 1];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4 px-2 md:px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Current Generation</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestDayData.currentGeneration} <span className="text-sm sm:text-base md:text-lg font-normal">{latestDayData.unit}</span>
          </CardTitle>
          <CardAction>
            <MdOutlineElectricBolt className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Latest: {latestDayData.day}
          </div>
          <div className="text-muted-foreground">
            {latestDayData.date}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Photovoltaic Output</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestDayData.photovoltaicOutput} <span className="text-sm sm:text-base md:text-lg font-normal">{latestDayData.unit}</span>
          </CardTitle>
          <CardAction>
            <FiSun className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Solar panel output
          </div>
          <div className="text-muted-foreground">
            {latestDayData.date}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Transferred to Grid</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestDayData.transferredToGrid} <span className="text-sm sm:text-base md:text-lg font-normal">{latestDayData.unit}</span>
          </CardTitle>
          <CardAction>
            <MdElectricalServices className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Energy fed to grid
          </div>
          <div className="text-muted-foreground">
            {latestDayData.date}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Load Consumption</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(latestDayData.photovoltaicOutput - latestDayData.transferredToGrid).toFixed(1)} <span className="text-sm sm:text-base md:text-lg font-normal">{latestDayData.unit}</span>
          </CardTitle>
          <CardAction>
            <IoHome className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Home energy usage
          </div>
          <div className="text-muted-foreground">
            {latestDayData.date}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card col-span-2 sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Solar Revenue</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹ {latestDayData.solarRevenue.toLocaleString('en-IN')}
          </CardTitle>
          <CardAction>
            <TbReportMoney className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Daily earnings
          </div>
          <div className="text-muted-foreground">
            {latestDayData.date}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
