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

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4 px-2 md:px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Current Generation</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.2 <span className="text-sm sm:text-base md:text-lg font-normal">kW</span>
          </CardTitle>
          <CardAction>
            <MdOutlineElectricBolt className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Peak today 4.2 kW <IconTrendingUp className="size-2 sm:size-3 md:size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Visitors for the last 6 months */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Photovoltaic Output</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            38.7 <span className="text-sm sm:text-base md:text-lg font-normal">kWh</span>
          </CardTitle>
          <CardAction>
            <FiSun className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Down 2% this period <IconTrendingDown className="size-2 sm:size-3 md:size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Acquisition needs attention */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Transferred to Grid</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12.3 <span className="text-sm sm:text-base md:text-lg font-normal">kWh</span>
          </CardTitle>
          <CardAction>
            <MdElectricalServices className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Going up this period by 2% <IconTrendingUp className="size-2 sm:size-3 md:size-4" />
          </div>
          {/* <div className="text-muted-foreground">Engagement exceed targets</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Load Consumption</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24.8 <span className="text-sm sm:text-base md:text-lg font-normal">kWh</span>
          </CardTitle>
          <CardAction>
            <IoHome className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            performance increase by 4.5% <IconTrendingUp className="size-2 sm:size-3 md:size-4" />
          </div>
          {/* <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card col-span-2 sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2 md:pb-3">
          <CardDescription className="text-[10px] sm:text-xs md:text-sm">Solar Revenue</CardDescription>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $ 3.67
          </CardTitle>
          <CardAction>
            <TbReportMoney className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs md:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 md:gap-2 font-medium">
            Revenue up by 1% <IconTrendingUp className="size-2 sm:size-3 md:size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Visitors for the last 6 months */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
