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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Generation</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.2 kW
          </CardTitle>
          <CardAction>
            <MdOutlineElectricBolt />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peak today 4.2 kW <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Visitors for the last 6 months */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Photovoltaic Output</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            38.7 kWh
          </CardTitle>
          <CardAction>
            <FiSun />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 2% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Acquisition needs attention */}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Transferred to Grid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12.3 kWh
          </CardTitle>
          <CardAction>
            <MdElectricalServices />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Going up this period by 2% <IconTrendingUp className="size-4" />
          </div>
          {/* <div className="text-muted-foreground">Engagement exceed targets</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Load Consumption</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24.8 kWh
          </CardTitle>
          <CardAction>
            <IoHome />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            performance increase by 4.5% <IconTrendingUp className="size-4" />
          </div>
          {/* <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Solar Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $ 3.67
          </CardTitle>
          <CardAction>
            <TbReportMoney />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue up by 1% <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {/* Visitors for the last 6 months */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
