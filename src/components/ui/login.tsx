"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { LoginResponseSchema } from "@/lib/schema";

interface LoginPageProps {
  onForgotPasswordClick: () => void;
}

export default function LoginPage({ onForgotPasswordClick }: LoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callLoginAPI = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: password, // Send encrypted password
        }),
      });

      const data: LoginResponseSchema = await response.json();

      if (data.success && data.data && data.data.user.role.includes("ADMIN")) {
        console.log("Login successful:", data);

        // Set token in an HTTP-only cookie
        document.cookie = `token=${data.data.token}; path=/; max-age=86400; samesite=strict; secure`;

        // Store user data in localStorage (but not the token)
        localStorage.setItem("userData", JSON.stringify(data.data.user));

        return data;
      } else {
        throw new Error(!data.success ? data.error : "Login failed");
      }
    } catch (error) {
      console.error("Error calling login API:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate input fields
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      console.log("Login attempt with username:", email);
      console.log("Password will be encrypted before sending");

      // Call the login API with encrypted password
      const loginResponse = await callLoginAPI(email, password);

      console.log("Login API response:", loginResponse);

      // Redirect to home page after successful login
      router.push("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">VKP Inverter</CardTitle>
          <CardDescription className="text-center">
            Please log in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="link"
                className="text-sm text-gray-600 p-0 h-auto"
                onClick={onForgotPasswordClick}
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </div>

            {/* Demo credentials info */}
            {/* <div className="p-3 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              <div className="font-medium mb-1">Demo Credentials:</div>
              <div>Admin: admin / admin123</div>
              <div>User: john.doe / password123</div>
              <div>User: jane.smith / password123</div>
              <div className="mt-1 text-green-600">
                🔒 Passwords are encrypted before sending
              </div>
            </div> */}
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
