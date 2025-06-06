import { Suspense } from "react";
import ResetPassword from "@/components/ui/ResetPassword";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-[400px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}
