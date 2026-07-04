import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/db"
import { registerRateLimiter } from "@/lib/rateLimiter"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? "unknown"

  try {
    await registerRateLimiter.consume(ip)
  } catch {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  })

  return NextResponse.json(
    { id: user.id, email: user.email },
    { status: 201 }
  )
}