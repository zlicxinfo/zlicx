import { SINGULAR_ANALYTICS_ENDPOINTS } from "@/lib/analytics/constants";
import { useRouterStuff } from "@zlicx/ui";
import { COUNTRIES } from "@zlicx/utils";
import { useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { AnalyticsLoadingSpinner } from "./analytics-loading-spinner";
import BarList from "./bar-list";
import { useAnalyticsFilterOption } from "./utils";

export default function Locations() {
  const { queryParams } = useRouterStuff();

  const [tab, setTab] = useState<"countries" | "cities">("countries");
  const data = useAnalyticsFilterOption(tab);
  const singularTabName = SINGULAR_ANALYTICS_ENDPOINTS[tab];

  return (
    <AnalyticsCard
      tabs={[
        { id: "countries", label: "Countries" },
        { id: "cities", label: "Cities" },
      ]}
      selectedTabId={tab}
      onSelectTab={setTab}
      expandLimit={8}
      hasMore={(data?.length ?? 0) > 8}
    >
      {({ limit, setShowModal }) =>
        data ? (
          data.length > 0 ? (
            <BarList
              tab={singularTabName}
              data={
                data?.map((d) => ({
                  icon: (
                    <img
                      alt={d.country}
                      src={`https://flag.vercel.app/m/${d.country}.svg`}
                      className="h-3 w-5"
                    />
                  ),
                  title: tab === "countries" ? COUNTRIES[d.country] : d.city,
                  href: queryParams({
                    set: {
                      [singularTabName]: d[singularTabName],
                    },
                    getNewPath: true,
                  }) as string,
                  value: d.count || 0,
                })) || []
              }
              maxValue={(data && data[0]?.count) || 0}
              barBackground="bg-blue-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:border-blue-500"
              setShowModal={setShowModal}
              {...(limit && { limit })}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-gray-600">No data available</p>
            </div>
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <AnalyticsLoadingSpinner />
          </div>
        )
      }
    </AnalyticsCard>
  );
}
