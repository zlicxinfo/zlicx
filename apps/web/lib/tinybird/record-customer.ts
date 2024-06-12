import { customersMetadataSchema } from "../zod/schemas/customers";
import { tb } from "./client";

export const recordCustomer = tb.buildIngestEndpoint({
  datasource: "zlicx_customers_metadata",
  event: customersMetadataSchema,
});
