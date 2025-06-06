import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.SECRET_KEY || "your-secret";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  return;
  const body = await request.json();
  const { emailId } = body;

  // 🔐 1. Check if user exists
  const user = await findUserByEmail(emailId); // Replace with your DB logic
  if (!user)
    return NextResponse.json({ message: "User not found", status: 404 });

  // 🪙 2. Generate token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  // 📧 3. Send reset email
  const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

  await sendResetEmail(emailId, resetLink);

  return NextResponse.json({ message: "Reset link sent!", status: 200 });
}

// Simulated DB function (replace with actual implementation)
async function findUserByEmail(email: string) {
  // Simulate DB lookup
  return { id: "123", email };
}

// Send email using nodemailer
async function sendResetEmail(to: string, resetLink: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_APP_PASSWORD, // Use App Password here
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Password Reset Link",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });
}
