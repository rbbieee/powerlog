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
  push: "text-orange-500",
  pull: "text-sky-400",
  legs: "text-emerald-400",
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
    <div className="min-h-screen bg-zinc-950">
      <header className="flex items-center justify-between px-8 py-5 md:px-16">
        <p className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange-600">
          POWERLOG
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/workouts/new"
            className="rounded bg-orange-600 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
          >
            + Log workout
          </Link>
          <Link
            href="/calculator"
            className="text-sm text-zinc-500 transition hover:text-zinc-200"
          >
            Calculator
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-zinc-500 transition hover:text-zinc-200"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="px-8 pb-16 md:px-16">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <h1 className="font-(family-name:--font-bebas) text-5xl text-zinc-50">
            YOUR WORKOUTS
          </h1>
          {!loading && workouts.length > 0 && (
            <p className="font-(family-name:--font-dm-mono) mt-1 text-sm text-zinc-600">
              {workouts.length} session{workouts.length !== 1 ? "s" : ""} logged · {totalVolume.toLocaleString()}kg total volume
            </p>
          )}
        </div>

        {loading && (
          <p className="text-zinc-500">Loading...</p>
        )}

        {!loading && workouts.length === 0 && (
          <div className="rounded border border-dashed border-zinc-800 px-8 py-16">
            <p className="text-zinc-500">
              No workouts yet. Log your first one to get started.
            </p>
          </div>
        )}

        {workouts.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <VolumeChart workouts={workouts} />
            <OneRMChart workouts={workouts} />
          </div>
        )}

        {prs.length > 0 && (
          <div className="mb-8">
            <p className="font-(family-name:--font-dm-mono) mb-3 text-xs uppercase tracking-widest text-zinc-600">
              Current PRs
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {prs.map((pr) => (
                <div
                  key={pr.exerciseName}
                  className="rounded border border-zinc-800 bg-zinc-900/40 px-4 py-3"
                >
                  <p className="text-sm text-zinc-400">{pr.exerciseName}</p>
                  <p className="font-(family-name:--font-bebas) mt-1 text-3xl text-zinc-50">
                    {pr.estimatedOneRepMax}kg
                  </p>
                  <p className="font-(family-name:--font-dm-mono) text-xs text-zinc-600">
                    Est. 1RM · {pr.weight}kg × {pr.reps}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="font-(family-name:--font-dm-mono) mb-3 text-xs uppercase tracking-widest text-zinc-600">
            Session history
          </p>
          <div className="space-y-2">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-start justify-between rounded border border-zinc-800 bg-zinc-900/40 px-4 py-3 transition hover:border-zinc-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-(family-name:--font-dm-mono) text-xs uppercase tracking-wide text-zinc-500">
                      {new Date(workout.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {workout.note && (
                      <span className="rounded border border-orange-900 bg-orange-950/50 px-2 py-0.5 text-xs font-semibold text-orange-400">
                        {workout.note}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {workout.sets.map((set) => (
                      <p key={set.id} className="font-(family-name:--font-dm-mono) text-xs text-zinc-500">
                        <span className={categoryColor[set.exercise.category] || "text-zinc-600"}>
                          ●
                        </span>{" "}
                        {set.exercise.name} {set.weight}kg×{set.reps}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3 pt-0.5">
                  <Link
                    href={`/workouts/${workout.id}/edit`}
                    className="text-xs text-zinc-600 hover:text-orange-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-xs text-zinc-600 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}