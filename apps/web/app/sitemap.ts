import { SHORT_DOMAIN } from "@zlicx/utils";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  let domain = headersList.get("host") as string;

  if (domain === "zlicx.localhost:8888" || domain.endsWith(".vercel.app")) {
    // for local development and preview URLs
    domain = SHORT_DOMAIN;
  }

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ];
}
