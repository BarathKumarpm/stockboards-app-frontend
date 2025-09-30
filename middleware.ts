// middleware.ts (in root directory)

import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    loginPage: "/auth/signin",
    publicPaths: [
      "/auth/signin",
      "/api/auth/:path*",
      "/",
    ],
  })
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}