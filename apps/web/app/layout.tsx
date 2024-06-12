import { inter, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import { Analytics as ZlicxAnalytics } from "@zlicx/analytics/react";
import { TooltipProvider } from "@zlicx/ui/src/tooltip";
import { cn, constructMetadata } from "@zlicx/utils";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(satoshi.variable, inter.variable)}>
      <body>
        <TooltipProvider>
          <Toaster closeButton className="pointer-events-auto" />
          {children}
          <ZlicxAnalytics
            cookieOptions={{
              domain: process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
                : undefined,
            }}
          />
          <VercelAnalytics />
          <SpeedInsights />
        </TooltipProvider>
      </body>
    </html>
  );
}
