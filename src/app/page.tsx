import { Suspense } from "react";
import { DeckController } from "@/components/deck/DeckController";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="grid h-dvh place-items-center bg-ink text-cream/50">
          Carregando deck…
        </div>
      }
    >
      <DeckController />
    </Suspense>
  );
}
