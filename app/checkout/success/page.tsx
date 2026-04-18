import { Suspense } from "react";
import OrderSuccessContent from "./order-success-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}