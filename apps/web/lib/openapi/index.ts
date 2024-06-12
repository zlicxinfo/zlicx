import { openApiErrorResponses } from "@/lib/openapi/responses";
import { DomainSchema } from "@/lib/zod/schemas/domains";
import { LinkSchema } from "@/lib/zod/schemas/links";
import { TagSchema } from "@/lib/zod/schemas/tags";
import { WorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { API_DOMAIN } from "@zlicx/utils";
import { createDocument } from "zod-openapi";
import { analyticsPath } from "./analytics";
import { domainsPaths } from "./domains";
import { linksPaths } from "./links";
import { metatagsPath } from "./metatags";
import { qrCodePaths } from "./qr";
import { tagsPaths } from "./tags";
import { trackPaths } from "./track";
import { workspacesPaths } from "./workspaces";

export const document = createDocument({
  openapi: "3.0.3",
  info: {
    title: "Zlicx.com API",
    description:
      "Zlicx is link management infrastructure for companies to create marketing campaigns, link sharing features, and referral programs.",
    version: "0.0.1",
    contact: {
      name: "zlicx.com Support",
      email: "support@zlicx.com",
      url: "https://zlicx.com/api",
    },
    license: {
      name: "AGPL-3.0 license",
      url: "https://github.com/zlicx/zlicx/blob/main/LICENSE.md",
    },
  },
  servers: [
    {
      url: API_DOMAIN,
      description: "Production API",
    },
  ],
  paths: {
    ...linksPaths,
    ...qrCodePaths,
    ...analyticsPath,
    ...workspacesPaths,
    ...tagsPaths,
    ...domainsPaths,
    ...trackPaths,
    ...metatagsPath,
  },
  components: {
    schemas: {
      LinkSchema,
      WorkspaceSchema,
      TagSchema,
      DomainSchema,
    },
    securitySchemes: {
      token: {
        type: "http",
        description: "Default authentication mechanism",
        scheme: "bearer",
        "x-speakeasy-example": "ZLICX_API_KEY",
      },
    },
    responses: {
      ...openApiErrorResponses,
    },
  },
  "x-speakeasy-globals": {
    parameters: [
      {
        "x-speakeasy-globals-hidden": true,
        name: "workspaceId",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        "x-speakeasy-globals-hidden": true,
        name: "projectSlug",
        in: "query",
        deprecated: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
});
