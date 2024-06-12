import { getAnalytics } from "@/lib/analytics/get-analytics";
import { validDateRangeForPlan } from "@/lib/analytics/utils";
import { withWorkspace } from "@/lib/auth";
import { getDomainViaEdge } from "@/lib/planetscale";
import {
  analyticsPathParamsSchema,
  analyticsQuerySchema,
} from "@/lib/zod/schemas/analytics";
import { NextResponse } from "next/server";

// GET /api/analytics – get analytics
export const GET = withWorkspace(
  async ({ params, searchParams, workspace, link }) => {
    const { eventType: oldEvent, endpoint: oldType } =
      analyticsPathParamsSchema.parse(params);
    const parsedParams = analyticsQuerySchema.parse(searchParams);

    let { event, groupBy, domain, key, interval, start, end } = parsedParams;

    event = oldEvent || event;
    groupBy = oldType || groupBy;

    validDateRangeForPlan({
      plan: workspace.plan,
      interval,
      start,
      end,
      throwError: true,
    });

    const linkId = link
      ? link.id
      : domain && key === "_root"
        ? await getDomainViaEdge(domain).then((d) => d?.id)
        : null;

    // Identify the request is from deprecated endpoint
    // (/api/analytics/clicks)
    // (/api/analytics/clicks/count)
    const isDeprecatedEndpoint =
      oldEvent && oldEvent === "clicks" && (!oldType || oldType === "count");

    const response = await getAnalytics({
      ...parsedParams,
      event,
      groupBy,
      ...(linkId && { linkId }),
      workspaceId: workspace.id,
      isDeprecatedEndpoint,
    });

    return NextResponse.json(response);
  },
  {
    needNotExceededClicks: true,
  },
);
