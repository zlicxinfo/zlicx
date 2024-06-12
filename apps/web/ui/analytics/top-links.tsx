import { useRouterStuff } from "@zlicx/ui";
import { getApexDomain } from "@zlicx/utils";
import { useContext, useState } from "react";
import { AnalyticsContext } from ".";
import LinkLogo from "../links/link-logo";
import { AnalyticsCard } from "./analytics-card";
import { AnalyticsLoadingSpinner } from "./analytics-loading-spinner";
import BarList from "./bar-list";
import { useAnalyticsFilterOption } from "./utils";

export default function TopLinks() {
  const { queryParams } = useRouterStuff();

  const [selectedTabId, setSelectedTabId] = useState<"links" | "domains">(
    "links",
  );
  const { domain, key } = useContext(AnalyticsContext);
  const showUrls = domain && key;

  const data = useAnalyticsFilterOption({
    groupBy: `top_${showUrls ? "urls" : "links"}`,
    root: selectedTabId === "domains" ? "true" : "false",
  });

  return (
    <AnalyticsCard
      tabs={
        showUrls
          ? [{ id: "urls", label: "URLs" }]
          : [
              { id: "links", label: "Links" },
              { id: "domains", label: "Domains" },
            ]
      }
      expandLimit={8}
      hasMore={(data?.length ?? 0) > 8}
      selectedTabId={showUrls ? "urls" : selectedTabId}
      onSelectTab={(tabId: "links" | "domains") =>
        showUrls ? null : setSelectedTabId(tabId)
      }
    >
      {({ limit, setShowModal }) =>
        data ? (
          data.length > 0 ? (
            <BarList
              tab={showUrls ? "url" : "link"}
              data={
                data?.map((d) => ({
                  icon: (
                    <LinkLogo
                      apexDomain={getApexDomain(d.url)}
                      className="h-5 w-5 sm:h-5 sm:w-5"
                    />
                  ),
                  title:
                    !showUrls && d["shortLink"]
                      ? d["shortLink"].replace(/^https?:\/\//, "")
                      : d.url,
                  href: queryParams({
                    set: {
                      ...(!showUrls
                        ? { domain: d.domain, key: d.key || "_root" }
                        : {
                            url: d.url,
                          }),
                    },
                    getNewPath: true,
                  }) as string,
                  value: d.count || 0,
                  ...(!showUrls && { linkData: d }),
                })) || []
              }
              maxValue={(data && data[0]?.count) || 0}
              barBackground="bg-orange-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:border-orange-500"
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
