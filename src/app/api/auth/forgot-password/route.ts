import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  updateUserPassword,
  encryptPassword,
} from "@/lib/services/user.service";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { z } from "zod";

const JWT_SECRET = process.env.SECRET_KEY || "your-secret";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailId } = body;

    // 🔐 1. Check if user exists
    const user = await findUserByEmail(emailId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🪙 2. Generate token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 📧 3. Send reset email
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    await sendResetEmail(emailId, resetLink);

    return NextResponse.json({ message: "Reset link sent!" }, { status: 200 });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // 🔍 1. Validate password format
    const passwordValidation = passwordSchema.safeParse(newPassword);
    if (!passwordValidation.success) {
      return NextResponse.json(
        {
          message: "Invalid password format",
          errors: passwordValidation.error.errors,
        },
        { status: 400 }
      );
    }

    // 🎫 2. Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error: unknown) {
        console.log(error)
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 🔒 3. Hash the new password
    const hashedPassword = encryptPassword(newPassword);

    // 💾 4. Update password in database
    await updateUserPassword(decodedToken.userId, hashedPassword);

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Send email using nodemailer
async function sendResetEmail(to: string, resetLink: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_APP_PASSWORD,
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
