// middleware.ts (in root directory)

import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    loginPage: "/",
    isReturnToCurrentPage: true,
  })
}

export const config = {
  matcher: [
    // Only protect /dashboard and its sub-routes
    "/dashboard/:path*",
  ],
}