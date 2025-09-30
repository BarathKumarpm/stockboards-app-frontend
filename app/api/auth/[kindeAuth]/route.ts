// app/api/auth/[kindeAuth]/route.ts

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server"
import type { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kindeAuth: string }> }
) {
  const { kindeAuth } = await params
  return handleAuth(request, kindeAuth)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ kindeAuth: string }> }
) {
  const { kindeAuth } = await params
  return handleAuth(request, kindeAuth)
}