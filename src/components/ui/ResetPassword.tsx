"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { toast } from "@/lib/toast";
import { passwordSchema } from "@/lib/utils";
// import { toast } from "@/lib/toast";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    toast.error({
      title: "Invalid Reset Link",
      description: "The password reset link is invalid or has expired.",
    });
    // You might want to redirect to login page here
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error({
        title: "Password does not match",
      });
      return;
    }

    const passwordValidation = passwordSchema.safeParse(newPassword);
    if (!passwordValidation.success) {
      toast.error({
        title: "Password criteria failed",
        description:
          "Password must be at least 8 characters,t least one uppercase letter,t least one lowercase letter,at least one number,at least one special character",
      });
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Password reset email sent successfully
      if (response.status === 200)
        toast.success({
          title: "Reset Link Sent",
          description: "Password reset",
        });
    } catch (e) {
      console.log(e);
      toast.error({
        title: "Failed to update password",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your details to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
