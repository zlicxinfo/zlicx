import { getAnalytics } from "@/lib/analytics/get-analytics";
import { withSession } from "@/lib/auth";
import { analyticsQuerySchema } from "@/lib/zod/schemas/analytics";
import { ZLICX_WORKSPACE_ID } from "@zlicx/utils";
import { NextResponse } from "next/server";

// GET /api/analytics/demo
export const GET = withSession(async ({ searchParams }) => {
  const parsedParams = analyticsQuerySchema.parse(searchParams);

  const response = await getAnalytics({
    ...parsedParams,
    isDemo: true,
    workspaceId: ZLICX_WORKSPACE_ID,
  });

  return NextResponse.json(response);
});
