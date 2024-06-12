import { prisma } from "@/lib/prisma";
import { validDomainRegex } from "@zlicx/utils";

export const validateDomain = async (domain: string) => {
  if (!domain || typeof domain !== "string") {
    return "Missing domain";
  }
  const validDomain =
    validDomainRegex.test(domain) &&
    // make sure the domain doesn't contain zlicx.com/zli.cx/zli.cx
    !/^(zlicx\.com|.*\.zlicx\.com.|zli\.cx|.*\.zli\.cx|d\.to|.*\.d\.to)$/i.test(
      domain,
    );

  if (!validDomain) {
    return "Invalid domain";
  }
  const exists = await domainExists(domain);
  if (exists) {
    return "Domain is already in use.";
  }
  return true;
};

export const domainExists = async (domain: string) => {
  const response = await prisma.domain.findUnique({
    where: {
      slug: domain,
    },
    select: {
      slug: true,
    },
  });
  return !!response;
};

export interface CustomResponse extends Response {
  json: () => Promise<any>;
  error?: { code: string; projectId: string; message: string };
}
