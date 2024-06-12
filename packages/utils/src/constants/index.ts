export * from "./cctlds";
export * from "./countries";
export * from "./domains";
export * from "./framer-motion";
export * from "./layout";
export * from "./localhost";
export * from "./middleware";
export * from "./misc";
export * from "./pricing";
export * from "./saml";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Zlicx.com";

export const SHORT_DOMAIN =
  process.env.NEXT_PUBLIC_APP_SHORT_DOMAIN || "zli.cx";

export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
  `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:8888";

export const APP_DOMAIN_WITH_NGROK =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:8888";

export const API_HOSTNAMES = new Set([
  `api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api.${SHORT_DOMAIN}`,
  "api.localhost:8888",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://api.localhost:8888";

export const ADMIN_HOSTNAMES = new Set([
  `admin.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "admin.localhost:8888",
]);

export const ZLICX_LOGO = "https://assets.zlicx.com/logo.png";
export const ZLICX_THUMBNAIL = "https://assets.zlicx.com/thumbnail.jpg";

export const ZLICX_WORKSPACE_ID = "cl7pj5kq4006835rbjlt2ofka";
export const LEGAL_WORKSPACE_ID = "clrflia0j0000vs7sqfhz9c7q";
export const LEGAL_USER_ID = "clqei1lgc0000vsnzi01pbf47";

export const ZLICX_DOMAINS = [
  {
    id: "clce1z7ch00j0rbstbjufva4j",
    slug: SHORT_DOMAIN,
    verified: true,
    primary: true,
    archived: false,
    publicStats: false,
    target: `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    type: "redirect",
    placeholder: "https://zlicx.com/help/article/what-is-zlicx",
    clicks: 0,
    allowedHostnames: [],
    projectId: ZLICX_WORKSPACE_ID,
  },
  ...(process.env.NEXT_PUBLIC_IS_ZLICX
    ? [
        {
          id: "clce1z7cs00y8rbstk4xtnj0k",
          slug: "zli.bz",
          verified: true,
          primary: false,
          archived: false,
          publicStats: false,
          target: "https://zlicx.com",
          type: "redirect",
          placeholder: "",
          clicks: 0,
          allowedHostnames: ["zli.cx", "zli.bz"],
          projectId: ZLICX_WORKSPACE_ID,
        },
      ]
    : []),
];

export const ZLICX_DOMAINS_ARRAY = ZLICX_DOMAINS.map((domain) => domain.slug);

export const ZLICX_DEMO_LINKS = [
  {
    id: "cltshzzpd0005126z3rd2lvo4",
    domain: "zli.cx",
    key: "try",
  },
];
