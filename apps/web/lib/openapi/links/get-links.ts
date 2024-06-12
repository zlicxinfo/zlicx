import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { getLinksQuerySchema, LinkSchema } from "@/lib/zod/schemas/links";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { workspaceParamsSchema } from "../request";

export const getLinks: ZodOpenApiOperationObject = {
  operationId: "getLinks",
  "x-speakeasy-name-override": "list",
  summary: "Retrieve a list of links",
  description:
    "Retrieve a list of links for the authenticated workspace. The list will be paginated and the provided query parameters allow filtering the returned links.",
  requestParams: {
    query: workspaceParamsSchema.merge(getLinksQuerySchema),
  },
  responses: {
    "200": {
      description: "A list of links",
      content: {
        "application/json": {
          schema: z.array(LinkSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Links"],
  security: [{ token: [] }],
};
