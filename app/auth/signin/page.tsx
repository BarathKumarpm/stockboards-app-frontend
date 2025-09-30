// app/auth/signin/page.tsx
"use client";

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// NOTE: Ensure this path is correct for your project
import StockBoardsLogo from "@/public/stock-boards-logo.png";

// Define the next step URL for successful authentication
const NEXT_AUTH_STAGE_URL = "/auth/company-email-auth";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column: Branding (unchanged) */}
      <div className="hidden lg:flex w-5/12 bg-blue-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500 opacity-90"></div>
        <div className="relative text-white z-10 text-center">
            <Image
              src={StockBoardsLogo}
              alt="StockBoards Logo"
              width={64}
              height={64}
              className="mx-auto mb-4"
              priority
            />
            <h2 className="text-4xl font-extrabold mb-3">StockBoards</h2>
            <p className="text-blue-200 text-lg">
              Simplify inventory. Multiply profits.
            </p>
            {/* ... other branding list items ... */}
        </div>
      </div>

      {/* Right Column: Auth Action Buttons */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500 mb-8">
            Select a method to continue to your inventory dashboard.
          </p>

          <div className="space-y-4">
            {/* 1. Primary Sign In Button (Redirects to Kinde's Hosted Email/Password Page) */}
            <LoginLink 
                postLoginRedirectURL={NEXT_AUTH_STAGE_URL}
            >
              <button 
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-blue-500/30"
              >
                Sign In with Email/Password
                <ArrowRight className="w-5 h-5" />
              </button>
            </LoginLink>
          </div>

          {/* Divider and Social Login Buttons */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                    Or use a social provider
                </span>
            </div>
          </div>
          <div className="space-y-4">
              {/* 2. Google Social Login Button (Direct OAuth) */}
              <LoginLink 
                postLoginRedirectURL={NEXT_AUTH_STAGE_URL}
                authUrlParams={{ 
                    connection_id: "google",
                    is_external: "true" // CRITICAL: Skips Kinde's hosted page
                }}
              >
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:shadow-sm"
                >
                    {/* Placeholder for Google Logo */}
                    Continue with Google
                </button>
              </LoginLink>

              {/* 3. Microsoft Social Login Button (Direct OAuth) */}
              <LoginLink 
                postLoginRedirectURL={NEXT_AUTH_STAGE_URL}
                authUrlParams={{ 
                    connection_id: "microsoft",
                    is_external: "true" // CRITICAL: Skips Kinde's hosted page
                }}
              >
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 transition-all duration-200 hover:shadow-sm"
                >
                    {/* Placeholder for Microsoft Logo */}
                    Continue with Microsoft
                </button>
              </LoginLink>
            </div>

          {/* 4. Link to Register (Redirects to Kinde's Hosted Sign Up Page) */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              No account?{" "}
              <RegisterLink
                postLoginRedirectURL={NEXT_AUTH_STAGE_URL}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline underline-offset-2"
              >
                Create one
              </RegisterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}