import HelpPortal from "@/ui/layout/help";
import { Background } from "@zlicx/ui";
import { ReactNode } from "react";
import Providers from "./providers";

export const runtime = "edge";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <HelpPortal />
      <Background />
      <div className="relative z-10 flex h-screen w-screen justify-center">
        {children}
      </div>
    </Providers>
  );
}
