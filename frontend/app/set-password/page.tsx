import { Suspense } from "react";
import SetPasswordPage from "components/SetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordPage />
    </Suspense>
  );
}
