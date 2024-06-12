import { openApiErrorResponses } from "@/lib/openapi/responses";
import z from "@/lib/zod";
import { DomainSchema } from "@/lib/zod/schemas/domains";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { workspaceParamsSchema } from "../request";

export const listDomains: ZodOpenApiOperationObject = {
  operationId: "listDomains",
  "x-speakeasy-name-override": "list",
  summary: "Retrieve a list of domains",
  description:
    "Retrieve a list of domains associated with the authenticated workspace.",
  requestParams: {
    query: workspaceParamsSchema,
  },
  responses: {
    "200": {
      description: "The domains were retrieved.",
      content: {
        "application/json": {
          schema: z.array(DomainSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Domains"],
  security: [{ token: [] }],
};
