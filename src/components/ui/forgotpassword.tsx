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
import { toast } from "@/lib/toast";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordPage({
  onBackToLogin,
}: ForgotPasswordPageProps) {
  const [emailId, setEmailId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailId) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Password reset email sent successfully
      toast.success({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });
      onBackToLogin();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again."
      );
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
              <Label htmlFor="email">Email Id</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </CardContent>
          <Button
            type="button"
            variant="link"
            className="text-sm text-gray-600 px-6 h-auto"
            onClick={onBackToLogin}
            // disabled={isLoading}
          >
            Sign in?
          </Button>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
