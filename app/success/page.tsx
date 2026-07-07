import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

/* =========================
   PAGE WRAPPER (Server Component)
   Suspense boundary requise par useSearchParams()
========================= */

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
