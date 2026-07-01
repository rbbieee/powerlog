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
  Beginner: "text-sky-400",
  Novice: "text-emerald-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-orange-400",
  Elite: "text-red-400",
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
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="font-mono text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
          >
            ← Dashboard
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            PowerLog
          </p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-50">
            Strength calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Based on your current PRs from your workout history
          </p>
        </div>

        {loading && (
          <p className="text-zinc-500">Loading your PRs...</p>
        )}

        {!loading && (
          <div className="space-y-6">
            <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-600">
                Your current PRs
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p className="text-zinc-400">Bench Press</p>
                  <p className="font-mono text-zinc-50">
                    {getBenchPR() > 0 ? `${getBenchPR()}kg` : "No data"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-zinc-400">Squat</p>
                  <p className="font-mono text-zinc-50">
                    {getSquatPR() > 0 ? `${getSquatPR()}kg` : "No data"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-zinc-400">Deadlift</p>
                  <p className="font-mono text-zinc-50">
                    {getDeadliftPR() > 0 ? `${getDeadliftPR()}kg` : "No data"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female")}
                  className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400">
                  Bodyweight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  placeholder="e.g. 83"
                  className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-zinc-50 outline-none focus:border-orange-600"
                />
              </div>

              <button
                onClick={handleCalculate}
                disabled={!bodyweight || getBenchPR() + getSquatPR() + getDeadliftPR() === 0}
                className="w-full rounded bg-orange-600 px-3 py-2 font-semibold text-zinc-950 transition hover:bg-orange-500 disabled:opacity-40"
              >
                Calculate level
              </button>
            </div>

            {result && (
              <div className="space-y-3">
                <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
                    Your level
                  </p>
                  <p className={`mt-2 text-4xl font-bold ${levelColor[result.level]}`}>
                    {result.level}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Total {result.total}kg — DOTS {result.dots}
                  </p>
                </div>

                <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-3">
                    Breakdown
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-zinc-400">Bench Press</p>
                      <p className="font-mono text-zinc-50">{result.bench}kg</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-zinc-400">Squat</p>
                      <p className="font-mono text-zinc-50">{result.squat}kg</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-zinc-400">Deadlift</p>
                      <p className="font-mono text-zinc-50">{result.deadlift}kg</p>
                    </div>
                    <div className="flex justify-between border-t border-zinc-800 pt-2">
                      <p className="text-zinc-400">Total</p>
                      <p className="font-mono text-zinc-50">{result.total}kg</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}