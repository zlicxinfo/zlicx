import { cn } from "@zlicx/utils";
import { Link2 } from "lucide-react";
import LinkLogo from "../links/link-logo";

export default function RefererIcon({
  display,
  className,
}: {
  display: string;
  className?: string;
}) {
  return display === "(direct)" ? (
    <Link2 className={cn("h-4 w-4", className)} />
  ) : (
    <LinkLogo
      apexDomain={display}
      className={cn("h-4 w-4 sm:h-4 sm:w-4", className)}
    />
  );
}
