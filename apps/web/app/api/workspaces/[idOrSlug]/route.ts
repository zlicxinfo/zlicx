import { ZlicxApiError } from "@/lib/api/errors";
import { deleteWorkspace } from "@/lib/api/workspaces";
import { withWorkspace } from "@/lib/auth";
import { isBetaTester, isReservedKey } from "@/lib/edge-config";
import { prisma } from "@/lib/prisma";
import z from "@/lib/zod";
import { WorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import slugify from "@sindresorhus/slugify";
import { DEFAULT_REDIRECTS, trim, validSlugRegex } from "@zlicx/utils";
import { NextResponse } from "next/server";

const updateWorkspaceSchema = z.object({
  name: z.preprocess(trim, z.string().min(1).max(32)).optional(),
  slug: z
    .preprocess(
      trim,
      z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(48, "Slug must be less than 48 characters")
        .transform((v) => slugify(v))
        .refine((v) => validSlugRegex.test(v), {
          message: "Invalid slug format",
        })
        .refine(
          async (v) => !((await isReservedKey(v)) || DEFAULT_REDIRECTS[v]),
          {
            message: "Cannot use reserved slugs",
          },
        ),
    )
    .optional(),
});

// GET /api/workspaces/[idOrSlug] – get a specific workspace by id or slug
export const GET = withWorkspace(async ({ workspace, headers }) => {
  const betaTester = await isBetaTester(workspace.id);

  return NextResponse.json(
    WorkspaceSchema.parse({
      ...workspace,
      id: `ws_${workspace.id}`,
      betaTester,
    }),
    { headers },
  );
});

// PATCH /api/workspaces/[idOrSlug] – update a specific workspace by id or slug
export const PATCH = withWorkspace(
  async ({ req, workspace }) => {
    try {
      const { name, slug } = await updateWorkspaceSchema.parseAsync(
        await req.json(),
      );

      const response = await prisma.project.update({
        where: {
          slug: workspace.slug,
        },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
        },
      });

      if (slug !== workspace.slug) {
        await prisma.user.updateMany({
          where: {
            defaultWorkspace: workspace.slug,
          },
          data: {
            defaultWorkspace: slug,
          },
        });
      }

      return NextResponse.json(response);
    } catch (error) {
      if (error.code === "P2002") {
        throw new ZlicxApiError({
          code: "conflict",
          message: "Workspace slug already exists.",
        });
      }

      throw error;
    }
  },
  {
    requiredRole: ["owner"],
  },
);

export const PUT = PATCH;

// DELETE /api/workspaces/[idOrSlug] – delete a specific project
export const DELETE = withWorkspace(
  async ({ workspace }) => {
    await deleteWorkspace(workspace);

    return NextResponse.json(workspace);
  },
  {
    requiredRole: ["owner"],
  },
);
