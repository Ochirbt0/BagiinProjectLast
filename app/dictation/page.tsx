"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import DictationClient from "./DictationClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Уншиж байна...</div>}>
      <DictationClient />
    </Suspense>
  );
}
