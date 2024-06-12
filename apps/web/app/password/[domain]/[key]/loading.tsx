import { Background, LoadingSpinner } from "@zlicx/ui";

export default function Loading() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
      <Background />
    </main>
  );
}
