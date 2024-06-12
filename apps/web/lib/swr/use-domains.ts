import { DomainProps } from "@/lib/types";
import {
  SHORT_DOMAIN,
  ZLICX_DOMAINS,
  ZLICX_WORKSPACE_ID,
  fetcher,
} from "@zlicx/utils";
import useSWR from "swr";
import useDefaultDomains from "./use-default-domains";
import useWorkspace from "./use-workspace";

export default function useDomains({
  id: workspaceId,
  domain,
}: { id?: string; domain?: string } = {}) {
  let id: string | undefined = undefined;
  if (workspaceId) {
    id = workspaceId;
  } else {
    const { id: paramsId } = useWorkspace();
    id = paramsId;
  }

  const { data, error, mutate } = useSWR<DomainProps[]>(
    id && `/api/domains?workspaceId=${id}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );
  const { defaultDomains: workspaceDefaultDomains } = useDefaultDomains();

  const allWorkspaceDomains = data || [];
  const activeWorkspaceDomains = data?.filter((domain) => !domain.archived);
  const archivedWorkspaceDomains = data?.filter((domain) => domain.archived);

  const activeDefaultDomains =
    (workspaceDefaultDomains &&
      ZLICX_DOMAINS.filter((d) => workspaceDefaultDomains?.includes(d.slug))) ||
    ZLICX_DOMAINS;

  const allDomains = [
    ...allWorkspaceDomains,
    ...(id === `ws_${ZLICX_WORKSPACE_ID}` ? [] : ZLICX_DOMAINS),
  ];
  const allActiveDomains = [
    ...(activeWorkspaceDomains || []),
    ...(id === `ws_${ZLICX_WORKSPACE_ID}` ? [] : activeDefaultDomains),
  ];

  const primaryDomain =
    activeWorkspaceDomains && activeWorkspaceDomains.length > 0
      ? activeWorkspaceDomains.find((domain) => domain.primary)?.slug ||
        activeWorkspaceDomains[0].slug
      : SHORT_DOMAIN;

  const verified = domain
    ? // If a domain is passed, check if it's verified
      allDomains.find((d) => d.slug === domain)?.verified
    : // If no domain is passed, check if any of the workspace domains are verified
      activeWorkspaceDomains?.some((d) => d.verified);

  return {
    activeWorkspaceDomains, // active workspace domains
    archivedWorkspaceDomains, // archived workspace domains
    activeDefaultDomains, // active default Zlicx domains
    allWorkspaceDomains, // all workspace domains (active + archived)
    allActiveDomains, // all active domains (active workspace domains + active default Zlicx domains)
    allDomains, // all domains (all workspace domains + all default Zlicx domains)
    primaryDomain,
    verified,
    loading: !data && !error,
    mutate,
    error,
  };
}
