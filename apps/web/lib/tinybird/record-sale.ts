import { saleEventSchemaTB } from "../zod/schemas/sales";
import { tb } from "./client";

export const recordSale = tb.buildIngestEndpoint({
  datasource: "zlicx_sale_events",
  event: saleEventSchemaTB,
});
