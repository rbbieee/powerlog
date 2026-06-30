"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
            PowerLog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-50">
            Create your account
          </h1>
        </div>

        {error && (
          <p className="rounded border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-400">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-orange-600 px-3 py-2 font-semibold text-zinc-950 transition hover:bg-orange-500 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  )
}