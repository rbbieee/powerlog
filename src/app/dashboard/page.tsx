"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import VolumeChart from "@/components/VolumeChart"
import OneRMChart from "@/components/OneRMChart"

type Set = {
  id: string
  setNumber: number
  weight: number
  reps: number
  rpe: number | null
  exercise: {
    name: string
    category: string
  }
}

type Workout = {
  id: string
  date: string
  note: string | null
  sets: Set[]
}

type PR = {
  exerciseName: string
  category: string
  weight: number
  reps: number
  estimatedOneRepMax: number
  date: string
}

const categoryColor: Record<string, string> = {
  push: "text-red-400",
  pull: "text-rose-400",
  legs: "text-zinc-300",
}

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [prs, setPrs] = useState<PR[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/workouts")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setWorkouts(data)
        }
        setLoading(false)
      })

    fetch("/api/prs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPrs(data)
        }
      })
  }, [router])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this workout? This cannot be undone.")
    if (!confirmed) return

    const response = await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setWorkouts(workouts.filter((workout) => workout.id !== id))
    }
  }

  const totalVolume = workouts.reduce(
    (sum, w) => sum + w.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  )

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30 pb-16">
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <p className="font-semibold text-lg tracking-tight text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            PowerLog
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/workouts/new"
              className="rounded-full bg-red-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all hover:bg-red-500 hover:scale-[1.02]"
            >
              + Log workout
            </Link>
            <Link
              href="/calculator"
              className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Calculator
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-red-400"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-12 max-w-7xl mx-auto mt-12">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          {!loading && workouts.length > 0 && (
            <p className="mt-3 text-sm text-zinc-400 font-medium">
              {workouts.length} session{workouts.length !== 1 ? "s" : ""} logged · <span className="text-zinc-200">{totalVolume.toLocaleString()}kg</span> total volume
            </p>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin"></div>
          </div>
        )}

        {!loading && workouts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 px-8 py-20 text-center">
            <p className="text-zinc-400 text-lg mb-4">
              No workouts yet. Log your first one to get started.
            </p>
            <Link
              href="/workouts/new"
              className="inline-block rounded-full bg-red-600/10 border border-red-500/30 px-6 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              Log Workout
            </Link>
          </div>
        )}

        {workouts.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="glass-panel p-6">
              <VolumeChart workouts={workouts} />
            </div>
            <div className="glass-panel p-6">
              <OneRMChart workouts={workouts} />
            </div>
          </div>
        )}

        {prs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Current PRs
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {prs.map((pr) => (
                <div
                  key={pr.exerciseName}
                  className="glass-panel p-5 transition-transform hover:-translate-y-1"
                >
                  <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{pr.exerciseName}</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-white">
                    {pr.estimatedOneRepMax}<span className="text-xl text-zinc-500 ml-1">kg</span>
                  </p>
                  <p className="mt-3 text-xs font-medium text-zinc-500 bg-zinc-800/50 inline-block px-2.5 py-1 rounded-md">
                    Est. 1RM · {pr.weight}kg × {pr.reps}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {workouts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Session History
            </h2>
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="glass-panel p-5 sm:p-6 transition-all hover:bg-white/[0.03]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-zinc-300">
                          {new Date(workout.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {workout.note && (
                          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                            {workout.note}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        {workout.sets.map((set) => (
                          <p key={set.id} className="text-sm text-zinc-400 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${categoryColor[set.exercise.category] || "bg-zinc-600"}`}></span>
                            <span className="font-medium text-zinc-300">{set.exercise.name}</span>
                            <span className="text-zinc-500 font-mono">{set.weight}kg × {set.reps}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:border-l sm:border-white/10 sm:pl-4">
                      <Link
                        href={`/workouts/${workout.id}/edit`}
                        className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="text-sm font-medium text-zinc-500 transition-colors hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}