"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex items-center justify-between px-8 py-5 md:px-16">
        <Link href="/">
          <p className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange-600">
            POWERLOG
          </p>
        </Link>
        <Link
          href="/login"
          className="text-sm text-zinc-500 transition hover:text-zinc-200"
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-(family-name:--font-bebas) text-5xl text-zinc-50">
            CREATE ACCOUNT
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Start tracking your lifts today.
          </p>

          {error && (
            <p className="mt-4 rounded border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-600">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-600">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-orange-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-orange-600 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-orange-500 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-400 hover:text-zinc-50">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}