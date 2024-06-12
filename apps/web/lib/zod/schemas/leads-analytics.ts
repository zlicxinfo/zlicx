import z from "@/lib/zod";
import { COUNTRY_CODES } from "@zlicx/utils";

export const leadAnalyticsResponse = {
  count: z
    .object({
      leads: z.number().describe("The total number of leads"),
    })
    .openapi({ ref: "LeadsCount", title: "LeadsCount" }),

  timeseries: z
    .object({
      start: z.string().describe("The starting timestamp of the interval"),
      leads: z.number().describe("The number of leads in the interval"),
    })
    .openapi({ ref: "LeadsTimeseries" }),

  countries: z
    .object({
      country: z
        .enum(COUNTRY_CODES)
        .describe("The 2-letter country code: https://zli.cx/geo"),
      leads: z.number().describe("The number of leads from this country"),
    })
    .openapi({ ref: "LeadsCountries" }),

  cities: z
    .object({
      city: z.string().describe("The name of the city"),
      country: z
        .enum(COUNTRY_CODES)
        .describe("The 2-letter country code of the city: https://zli.cx/geo"),
      leads: z.number().describe("The number of leads from this city"),
    })
    .openapi({ ref: "LeadsCities" }),

  devices: z
    .object({
      device: z.string().describe("The name of the device"),
      leads: z.number().describe("The number of leads from this device"),
    })
    .openapi({ ref: "LeadsDevices" }),

  browsers: z
    .object({
      browser: z.string().describe("The name of the browser"),
      leads: z.number().describe("The number of leads from this browser"),
    })
    .openapi({ ref: "LeadsBrowsers" }),

  os: z
    .object({
      os: z.string().describe("The name of the OS"),
      leads: z.number().describe("The number of leads from this OS"),
    })
    .openapi({ ref: "LeadsOS" }),

  referers: z
    .object({
      referer: z
        .string()
        .describe(
          "The name of the referer. If unknown, this will be `(direct)`",
        ),
      leads: z.number().describe("The number of leads from this referer"),
    })
    .openapi({ ref: "LeadsReferers" }),

  top_links: z
    .object({
      link: z
        .string()
        .describe("The unique ID of the short link")
        .openapi({ deprecated: true }),
      id: z.string().describe("The unique ID of the short link"),
      domain: z.string().describe("The domain of the short link"),
      key: z.string().describe("The key of the short link"),
      shortLink: z.string().describe("The short link URL"),
      url: z.string().describe("The destination URL of the short link"),
      createdAt: z
        .string()
        .describe("The creation timestamp of the short link"),
      leads: z.number().describe("The number of leads from this link"),
    })
    .openapi({ ref: "LeadsTopLinks" }),

  top_urls: z
    .object({
      url: z.string().describe("The destination URL"),
      leads: z.number().describe("The number of leads from this URL"),
    })
    .openapi({ ref: "LeadsTopUrls" }),

  trigger: z
    .object({
      trigger: z
        .enum(["link", "qr"])
        .describe("The type of trigger method: link click or QR scan"),
      leads: z
        .number()
        .describe("The number of leads from this trigger method."),
    })
    .openapi({ ref: "LeadsTrigger" }),
} as const;
