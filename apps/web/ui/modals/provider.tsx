"use client";

import useWorkspace from "@/lib/swr/use-workspace";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { SimpleLinkProps } from "@/lib/types";
import { useAcceptInviteModal } from "@/ui/modals/accept-invite-modal";
import { useAddEditDomainModal } from "@/ui/modals/add-edit-domain-modal";
import { useAddEditLinkModal } from "@/ui/modals/add-edit-link-modal";
import { useAddWorkspaceModal } from "@/ui/modals/add-workspace-modal";
import { useCompleteSetupModal } from "@/ui/modals/complete-setup-modal";
import { useImportBitlyModal } from "@/ui/modals/import-bitly-modal";
import { useImportShortModal } from "@/ui/modals/import-short-modal";
import { useUpgradePlanModal } from "@/ui/modals/upgrade-plan-modal";
import { useCookies } from "@zlicx/ui";
import { DEFAULT_LINK_PROPS, getUrlFromString } from "@zlicx/utils";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useAddEditTagModal } from "./add-edit-tag-modal";
import { useImportRebrandlyModal } from "./import-rebrandly-modal";

export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
  setShowCompleteSetupModal: Dispatch<SetStateAction<boolean>>;
  setShowAddEditDomainModal: Dispatch<SetStateAction<boolean>>;
  setShowAddEditLinkModal: Dispatch<SetStateAction<boolean>>;
  setShowAddEditTagModal: Dispatch<SetStateAction<boolean>>;
  setShowUpgradePlanModal: Dispatch<SetStateAction<boolean>>;
  setShowImportBitlyModal: Dispatch<SetStateAction<boolean>>;
  setShowImportShortModal: Dispatch<SetStateAction<boolean>>;
  setShowImportRebrandlyModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowAddWorkspaceModal: () => {},
  setShowCompleteSetupModal: () => {},
  setShowAddEditDomainModal: () => {},
  setShowAddEditLinkModal: () => {},
  setShowAddEditTagModal: () => {},
  setShowUpgradePlanModal: () => {},
  setShowImportBitlyModal: () => {},
  setShowImportShortModal: () => {},
  setShowImportRebrandlyModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const newLinkValues = useMemo(() => {
    const newLink = searchParams.get("newLink");
    if (newLink && getUrlFromString(newLink)) {
      return {
        url: getUrlFromString(newLink),
        domain: searchParams.get("newLinkDomain"),
      };
    } else {
      return null;
    }
  }, [searchParams]);

  const { AddWorkspaceModal, setShowAddWorkspaceModal } =
    useAddWorkspaceModal();
  const { CompleteSetupModal, setShowCompleteSetupModal } =
    useCompleteSetupModal();
  const { AcceptInviteModal, setShowAcceptInviteModal } =
    useAcceptInviteModal();
  const { setShowAddEditDomainModal, AddEditDomainModal } =
    useAddEditDomainModal();
  const { setShowAddEditLinkModal, AddEditLinkModal } = useAddEditLinkModal(
    newLinkValues?.url
      ? {
          duplicateProps: {
            ...DEFAULT_LINK_PROPS,
            domain: newLinkValues.domain,
            url: newLinkValues.url,
          },
        }
      : {},
  );
  const { setShowAddEditTagModal, AddEditTagModal } = useAddEditTagModal();
  const { setShowUpgradePlanModal, UpgradePlanModal } = useUpgradePlanModal();
  const { setShowImportBitlyModal, ImportBitlyModal } = useImportBitlyModal();
  const { setShowImportShortModal, ImportShortModal } = useImportShortModal();
  const { setShowImportRebrandlyModal, ImportRebrandlyModal } =
    useImportRebrandlyModal();

  const [hashes, setHashes] = useCookies<SimpleLinkProps[]>("hashes__ZLICX", [], {
    domain: !!process.env.NEXT_PUBLIC_VERCEL_URL ? ".zlicx.com" : undefined,
  });

  const { id, error } = useWorkspace();

  useEffect(() => {
    if (hashes.length > 0 && id) {
      toast.promise(
        fetch(`/api/links/sync?workspaceId=${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hashes),
        }).then(async (res) => {
          if (res.status === 200) {
            await mutate(
              (key) => typeof key === "string" && key.startsWith("/api/links"),
              undefined,
              { revalidate: true },
            );
            setHashes([]);
          }
        }),
        {
          loading: "Importing links...",
          success: "Links imported successfully!",
          error: "Something went wrong while importing links.",
        },
      );
    }
  }, [hashes, id]);

  // handle invite and oauth modals
  useEffect(() => {
    if (error && (error.status === 409 || error.status === 410)) {
      setShowAcceptInviteModal(true);
    }
  }, [error]);

  // handle ?newWorkspace and ?newLink query params
  useEffect(() => {
    if (searchParams.has("newWorkspace")) {
      setShowAddWorkspaceModal(true);
    }
    if (searchParams.has("newLink")) {
      setShowAddEditLinkModal(true);
    }
  }, []);

  const { data: session, update } = useSession();
  const { workspaces } = useWorkspaces();

  // if user has workspaces but no defaultWorkspace, refresh to get defaultWorkspace
  useEffect(() => {
    if (
      workspaces &&
      workspaces.length > 0 &&
      session?.user &&
      !session.user["defaultWorkspace"]
    ) {
      fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defaultWorkspace: workspaces[0].slug,
        }),
      }).then(() => update());
    }
  }, [session]);

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal,
        setShowCompleteSetupModal,
        setShowAddEditDomainModal,
        setShowAddEditLinkModal,
        setShowAddEditTagModal,
        setShowUpgradePlanModal,
        setShowImportBitlyModal,
        setShowImportShortModal,
        setShowImportRebrandlyModal,
      }}
    >
      <AddWorkspaceModal />
      <AcceptInviteModal />
      <CompleteSetupModal />
      <AddEditDomainModal />
      <AddEditLinkModal />
      <AddEditTagModal />
      <UpgradePlanModal />
      <ImportBitlyModal />
      <ImportShortModal />
      <ImportRebrandlyModal />
      {children}
    </ModalContext.Provider>
  );
}
