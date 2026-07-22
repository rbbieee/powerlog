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
    <div className="flex min-h-screen flex-col bg-black selection:bg-red-500/30">
      <header className="flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <Link href="/">
          <p className="font-semibold text-lg tracking-tight text-white flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            PowerLog
          </p>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm glass-panel p-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Start tracking your lifts today.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-red-600 px-4 py-3.5 font-medium text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all hover:bg-red-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:pointer-events-none disabled:opacity-50 disabled:scale-100"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-white transition-colors hover:text-red-400">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}