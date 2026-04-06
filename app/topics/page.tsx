export const dynamic = "force-dynamic";

import { Suspense } from "react";
import TopicsClient from "./TopicsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Уншиж байна...</div>}>
      <TopicsClient />
    </Suspense>
  );
}
