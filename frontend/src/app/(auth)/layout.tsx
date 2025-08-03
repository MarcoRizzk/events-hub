import { ReactNode, Suspense } from "react";
import Loading from "@app/components/loading";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
