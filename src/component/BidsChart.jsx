"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { formatPrice } from "../lib/utils";

export const description = "An interactive bar chart";

const chartConfig = {
  bidAmount: {
    label: "Bid Amount",
  },
  userBids: {
    label: "Your Bids",
    color: "hsl(var(--chart-1))",
  },
  allUserBids: {
    label: "All User Bids",
    color: "hsl(var(--chart-1))",
  },
};

export default function Component({ userBids = [] , allUserBids = [] }) {

  const [activeChart, setActiveChart] = React.useState(
    userBids.length ? "userBids" : "allUserBids"
  );

  const total = React.useMemo(
    () => ({
      userBids: userBids.length,
      allUserBids: allUserBids.length,
    }),
    [userBids, allUserBids]
  );

  const chartData = activeChart === "userBids" ? userBids : allUserBids;
  const dataKey = activeChart === "userBids" ? "bid_time" : "bidTime";

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total User Bids</CardTitle>
          <CardDescription>
            Showing {activeChart === "userBids" ? "user" : "all users'"} bids for this car.
          </CardDescription>
        </div>

        <div className="flex">
          {/* If userBids are available, show both buttons; otherwise, show only "All User Bids" */}
          {userBids.length > 0 ? (
            ["userBids", "allUserBids"].map((key) => {
              const chart = key;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key].toLocaleString()}
                  </span>
                </button>
              );
            })
          ) : (
            <button
              data-active={activeChart === "allUserBids"}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:px-8 sm:py-6"
              onClick={() => setActiveChart("allUserBids")}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig["allUserBids"].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total["allUserBids"].toLocaleString()}
              </span>
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => formatPrice(value)} // Format price or use raw value
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <XAxis
              dataKey={dataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="bidAmount"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="bidAmount" fill={`var(--color-${activeChart})`} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

