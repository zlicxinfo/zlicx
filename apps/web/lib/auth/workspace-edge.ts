import {
  ZlicxApiError,
  exceededLimitError,
  handleAndReturnErrorResponse,
} from "@/lib/api/errors";
import { PlanProps, WorkspaceProps } from "@/lib/types";
import { ratelimit } from "@/lib/upstash";
import { waitUntil } from "@vercel/functions";
import { API_DOMAIN, getSearchParams } from "@zlicx/utils";
import { StreamingTextResponse } from "ai";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { isBetaTester } from "../edge-config";
import { prismaEdge } from "../prisma/edge";
import { hashToken } from "./hash-token";
import type { Session } from "./utils";

interface WithWorkspaceEdgeHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    workspace,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    workspace: WorkspaceProps;
  }): Promise<Response | StreamingTextResponse>;
}

export const withWorkspaceEdge = (
  handler: WithWorkspaceEdgeHandler,
  {
    requiredPlan = [
      "free",
      "pro",
      "business",
      "business plus",
      "business max",
      "business extra",
      "enterprise",
    ], // if the action needs a specific plan
    requiredRole = ["owner", "member"],
    needNotExceededClicks, // if the action needs the user to not have exceeded their clicks usage
    needNotExceededLinks, // if the action needs the user to not have exceeded their links usage
    needNotExceededAI, // if the action needs the user to not have exceeded their AI usage
    allowSelf, // special case for removing yourself from a workspace
    betaFeature, // if the action is a beta feature
  }: {
    requiredPlan?: Array<PlanProps>;
    requiredRole?: Array<"owner" | "member">;
    needNotExceededClicks?: boolean;
    needNotExceededLinks?: boolean;
    needNotExceededAI?: boolean;
    allowSelf?: boolean;
    betaFeature?: boolean;
  } = {},
) => {
  return async (
    req: Request,
    { params = {} }: { params: Record<string, string> | undefined },
  ) => {
    const searchParams = getSearchParams(req.url);

    let apiKey: string | undefined = undefined;
    let headers = {};

    try {
      const authorizationHeader = req.headers.get("Authorization");
      if (authorizationHeader) {
        if (!authorizationHeader.includes("Bearer ")) {
          throw new ZlicxApiError({
            code: "bad_request",
            message:
              "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://zli.cx/auth",
          });
        }
        apiKey = authorizationHeader.replace("Bearer ", "");
      }

      let session: Session | undefined;
      let workspaceId: string | undefined;
      let workspaceSlug: string | undefined;

      const idOrSlug =
        params?.idOrSlug ||
        searchParams.workspaceId ||
        params?.slug ||
        searchParams.projectSlug;

      // if there's no workspace ID or slug
      if (!idOrSlug) {
        throw new ZlicxApiError({
          code: "not_found",
          message:
            "Workspace id not found. Did you forget to include a `workspaceId` query parameter? Learn more: https://zli.cx/id",
        });
      }

      if (idOrSlug.startsWith("ws_")) {
        workspaceId = idOrSlug.replace("ws_", "");
      } else {
        workspaceSlug = idOrSlug;
      }

      if (apiKey) {
        const hashedKey = await hashToken(apiKey);

        const token = await prismaEdge.token.findUnique({
          where: {
            hashedKey,
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
        if (!token) {
          throw new ZlicxApiError({
            code: "unauthorized",
            message: "Unauthorized: Invalid API key.",
          });
        }

        const { success, limit, reset, remaining } = await ratelimit(
          600,
          "1 m",
        ).limit(apiKey);
        headers = {
          "Retry-After": reset.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        };

        if (!success) {
          throw new ZlicxApiError({
            code: "rate_limit_exceeded",
            message: "Too many requests.",
          });
        }
        waitUntil(
          prismaEdge.token.update({
            where: {
              hashedKey,
            },
            data: {
              lastUsed: new Date(),
            },
          }),
        );
        session = {
          user: {
            id: token.user.id,
            name: token.user.name || "",
            email: token.user.email || "",
          },
        };
      } else {
        session = (await getToken({
          req: req as NextRequest,
          secret: process.env.NEXTAUTH_SECRET,
        })) as unknown as Session;

        if (!session?.user?.id) {
          throw new ZlicxApiError({
            code: "unauthorized",
            message: "Unauthorized: Login required.",
          });
        }
      }

      const workspace = (await prismaEdge.project.findUnique({
        where: {
          id: workspaceId || undefined,
          slug: workspaceSlug || undefined,
        },
        include: {
          users: {
            where: {
              userId: session.user.id,
            },
            select: {
              role: true,
            },
          },
          domains: {
            select: {
              slug: true,
              primary: true,
            },
          },
        },
      })) as WorkspaceProps;

      if (!workspace || !workspace.users) {
        // workspace doesn't exist
        throw new ZlicxApiError({
          code: "not_found",
          message: "Workspace not found.",
        });
      }

      // beta feature checks
      if (betaFeature) {
        const betaTester = await isBetaTester(workspace.id);
        if (!betaTester) {
          throw new ZlicxApiError({
            code: "forbidden",
            message: "Unauthorized: Beta feature.",
          });
        }
      }

      // workspace exists but user is not part of it
      if (workspace.users.length === 0) {
        const pendingInvites = await prismaEdge.projectInvite.findUnique({
          where: {
            email_projectId: {
              email: session.user.email,
              projectId: workspace.id,
            },
          },
          select: {
            expires: true,
          },
        });
        if (!pendingInvites) {
          throw new ZlicxApiError({
            code: "not_found",
            message: "Workspace not found.",
          });
        } else if (pendingInvites.expires < new Date()) {
          throw new ZlicxApiError({
            code: "invite_expired",
            message: "Workspace invite expired.",
          });
        } else {
          throw new ZlicxApiError({
            code: "invite_pending",
            message: "Workspace invite pending.",
          });
        }
      }

      // workspace role checks
      if (
        !requiredRole.includes(workspace.users[0].role) &&
        !(allowSelf && searchParams.userId === session.user.id)
      ) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: "Unauthorized: Insufficient permissions.",
        });
      }

      // clicks usage overage checks
      if (needNotExceededClicks && workspace.usage > workspace.usageLimit) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: exceededLimitError({
            plan: workspace.plan,
            limit: workspace.usageLimit,
            type: "clicks",
          }),
        });
      }

      // links usage overage checks
      if (
        needNotExceededLinks &&
        workspace.linksUsage > workspace.linksLimit &&
        (workspace.plan === "free" || workspace.plan === "pro")
      ) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: exceededLimitError({
            plan: workspace.plan,
            limit: workspace.linksLimit,
            type: "links",
          }),
        });
      }

      // AI usage overage checks
      if (needNotExceededAI && workspace.aiUsage > workspace.aiLimit) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: exceededLimitError({
            plan: workspace.plan,
            limit: workspace.aiLimit,
            type: "AI",
          }),
        });
      }

      // plan checks
      if (!requiredPlan.includes(workspace.plan)) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: "Unauthorized: Need higher plan.",
        });
      }

      // analytics API checks
      const url = new URL(req.url || "", API_DOMAIN);
      if (
        workspace.plan === "free" &&
        apiKey &&
        url.pathname.includes("/analytics")
      ) {
        throw new ZlicxApiError({
          code: "forbidden",
          message: "Analytics API is only available on paid plans.",
        });
      }

      return await handler({
        req,
        params,
        searchParams,
        headers,
        session,
        workspace,
      });
    } catch (error) {
      return handleAndReturnErrorResponse(error, headers);
    }
  };
};
