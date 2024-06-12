import { Background } from "@zlicx/ui";
import { constructMetadata } from "@zlicx/utils";
import { Suspense } from "react";
import WelcomePageClient from "./page-client";

export const runtime = "nodejs";

export const metadata = constructMetadata({
  title: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
});

export default function WelcomePage() {
  return (
    <>
      <Background />
      <Suspense>
        <WelcomePageClient />
      </Suspense>
    </>
  );
}
