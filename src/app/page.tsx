"use client";

import { useState } from "react";
import LoginPage from "../components/ui/login";
import ForgotPasswordPage from "@/components/ui/forgotpassword";

export default function Home() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return showForgotPassword ? (
    <ForgotPasswordPage onBackToLogin={toggleForgotPassword} />
  ) : (
    <LoginPage onForgotPasswordClick={toggleForgotPassword} />
  );
}
