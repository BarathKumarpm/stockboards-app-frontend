// app/auth/signup/page.tsx
"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserPlus } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-gray-500 mb-8 text-center">
          Start managing your inventory with StockBoards.
        </p>

        <RegisterLink postLoginRedirectURL="/auth/company-email-auth">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
            Sign Up
            <UserPlus className="w-5 h-5" />
          </button>
        </RegisterLink>

        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/signin" // Correctly points to Sign In
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}