import { getAll } from "@vercel/edge-config";

export const isBlacklistedDomain = async ({
  domain,
  apexDomain,
}: {
  domain: string;
  apexDomain: string;
}): Promise<boolean | "whitelisted"> => {
  if (!process.env.NEXT_PUBLIC_IS_ZLICX || !process.env.EDGE_CONFIG) {
    return false;
  }

  if (!domain) {
    return false;
  }

  try {
    const {
      domains: blacklistedDomains,
      terms: blacklistedTerms,
      whitelistedDomains,
    } = await getAll(["domains", "terms", "whitelistedDomains"]);

    const blacklistedTermsRegex = new RegExp(
      blacklistedTerms
        .map((term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|"),
    );

    const isBlacklisted =
      blacklistedDomains.includes(domain) || blacklistedTermsRegex.test(domain);

    if (isBlacklisted) {
      return true;
    }

    if (whitelistedDomains.includes(apexDomain)) {
      return "whitelisted";
    }

    return false;
  } catch (e) {
    return false;
  }
};
