import { withWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import z from "@/lib/zod";
import { ZLICX_DOMAINS_ARRAY } from "@zlicx/utils";
import { NextResponse } from "next/server";

// GET /api/domains/default - get default domains
export const GET = withWorkspace(async ({ workspace }) => {
  const defaultDomains = await prisma.defaultDomains.findUnique({
    where: {
      projectId: workspace.id,
    },
    select: {
      zlicx: true,
    },
  });

  if (!defaultDomains) {
    return NextResponse.json([]);
  }

  const defaultDomainsArray = Object.keys(defaultDomains)
    .filter((key) => defaultDomains[key])
    .map((domain) =>
      ZLICX_DOMAINS_ARRAY.find((d) => d.replace(".", "") === domain),
    );

  return NextResponse.json(defaultDomainsArray);
});

const updateDefaultDomainsSchema = z.object({
  defaultDomains: z.array(z.enum(ZLICX_DOMAINS_ARRAY as [string, ...string[]])),
});

// PUT /api/domains/default - edit default domains
export const PUT = withWorkspace(async ({ req, workspace }) => {
  const { defaultDomains } = await updateDefaultDomainsSchema.parseAsync(
    await req.json(),
  );

  const response = await prisma.defaultDomains.update({
    where: {
      projectId: workspace.id,
    },
    data: {
      zlicx: defaultDomains.includes("zli.cx"),
    },
  });

  return NextResponse.json(response);
});
