import { Project } from "@prisma/client";
import { expect, test } from "vitest";
import { IntegrationHarness } from "../utils/integration";

test("should not create workspace with slug in use", async (ctx) => {
  const h = new IntegrationHarness(ctx);
  const { workspace, http } = await h.init();

  // Create another workspace with the same slug
  const { status, data: error } = await http.post<Project>({
    path: "/workspaces",
    body: {
      name: "Zlicx Workspace",
      slug: workspace.slug,
    },
  });

  expect(status).toEqual(409);
  expect(error).toStrictEqual({
    error: {
      code: "conflict",
      message: "Slug is already in use.",
      doc_url: "https://zlicx.com/docs/api-reference/errors#conflict",
    },
  });
});
