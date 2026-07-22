"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStrengthLevel, getDOTSScore } from "@/lib/strengthStandards"

type PR = {
  exerciseName: string
  estimatedOneRepMax: number
}

type Result = {
  total: number
  bench: number
  squat: number
  deadlift: number
  level: string
  dots: number
}

const levelColor: Record<string, string> = {
  Unknown: "text-zinc-500",
  Beginner: "text-zinc-300",
  Novice: "text-emerald-400",
  Intermediate: "text-blue-400",
  Advanced: "text-rose-400",
  Elite: "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
}

export default function CalculatorPage() {
  const router = useRouter()
  const [prs, setPrs] = useState<PR[]>([])
  const [bodyweight, setBodyweight] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/prs")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPrs(data)
        }
        setLoading(false)
      })
  }, [router])

  const getBenchPR = () =>
    prs.find((pr) => pr.exerciseName.toLowerCase().includes("bench"))?.estimatedOneRepMax ?? 0

  const getSquatPR = () =>
    prs.find((pr) => pr.exerciseName.toLowerCase().includes("squat") && !pr.exerciseName.toLowerCase().includes("romanian"))?.estimatedOneRepMax ?? 0

  const getDeadliftPR = () =>
    prs.find((pr) => pr.exerciseName.toLowerCase().includes("deadlift") && !pr.exerciseName.toLowerCase().includes("romanian"))?.estimatedOneRepMax ?? 0

  const handleCalculate = () => {
    const bw = parseFloat(bodyweight)
    if (!bw || bw <= 0) return

    const bench = getBenchPR()
    const squat = getSquatPR()
    const deadlift = getDeadliftPR()
    const total = bench + squat + deadlift

    if (total === 0) return

    const level = getStrengthLevel(total, bw, gender)
    const dots = getDOTSScore(total, bw, gender)

    setResult({ total, bench, squat, deadlift, level, dots })
  }

  return (
    <div className="flex min-h-screen flex-col bg-black selection:bg-red-500/30">
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/dashboard">
            <p className="font-semibold text-lg tracking-tight text-white flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
              PowerLog
            </p>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Strength Calculator
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Calculate your strength level and DOTS score based on your recorded PRs.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin"></div>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              <div className="glass-panel p-5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Your Best Lifts
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-zinc-300">Bench Press</p>
                    <p className="font-mono text-white bg-zinc-800/50 px-2.5 py-1 rounded-md">
                      {getBenchPR() > 0 ? `${getBenchPR()} kg` : "—"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-zinc-300">Squat</p>
                    <p className="font-mono text-white bg-zinc-800/50 px-2.5 py-1 rounded-md">
                      {getSquatPR() > 0 ? `${getSquatPR()} kg` : "—"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-zinc-300">Deadlift</p>
                    <p className="font-mono text-white bg-zinc-800/50 px-2.5 py-1 rounded-md">
                      {getDeadliftPR() > 0 ? `${getDeadliftPR()} kg` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    Bodyweight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    placeholder="e.g. 83"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 placeholder-zinc-600"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={!bodyweight || getBenchPR() + getSquatPR() + getDeadliftPR() === 0}
                  className="w-full rounded-xl bg-red-600 py-3.5 font-medium text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all hover:bg-red-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:pointer-events-none disabled:opacity-50"
                >
                  Calculate Level
                </button>
              </div>

              {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="glass-panel p-6 text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Classification
                    </p>
                    <p className={`mt-3 text-5xl font-bold tracking-tight ${levelColor[result.level]}`}>
                      {result.level}
                    </p>
                    <div className="mt-4 flex justify-center gap-4 text-sm font-medium">
                      <span className="bg-zinc-800/50 text-white px-3 py-1.5 rounded-lg border border-white/5">
                        Total: <span className="font-mono text-red-400">{result.total}kg</span>
                      </span>
                      <span className="bg-zinc-800/50 text-white px-3 py-1.5 rounded-lg border border-white/5">
                        DOTS: <span className="font-mono text-red-400">{result.dots}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}