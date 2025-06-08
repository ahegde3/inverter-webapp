import { Suspense } from "react";
import HomePage from "@/components/ui/HomePage";
import { LoadingSpinner } from "@/components/ui/LoadSpinner";

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  );
}
