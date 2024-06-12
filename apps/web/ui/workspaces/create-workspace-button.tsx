"use client";

import useWorkspaces from "@/lib/swr/use-workspaces";
import { ModalContext } from "@/ui/modals/provider";
import { Button } from "@zlicx/ui";
import { TooltipContent } from "@zlicx/ui/src/tooltip";
import { FREE_WORKSPACES_LIMIT } from "@zlicx/utils";
import { useContext } from "react";

export default function CreateWorkspaceButton() {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);
  const { freeWorkspaces, exceedingFreeWorkspaces } = useWorkspaces();

  return (
    <div>
      <Button
        text="Create workspace"
        disabledTooltip={
          exceedingFreeWorkspaces ? (
            <TooltipContent
              title={`You can only create up to ${FREE_WORKSPACES_LIMIT} free workspaces. Additional workspaces require a paid plan.`}
              cta="Upgrade to Pro"
              href={
                freeWorkspaces
                  ? `/${freeWorkspaces[0].slug}/settings/billing?upgrade=pro`
                  : "https://zlicx.com/pricing"
              }
            />
          ) : undefined
        }
        className="flex-shrink-0 truncate"
        onClick={() => setShowAddWorkspaceModal(true)}
      />
    </div>
  );
}
