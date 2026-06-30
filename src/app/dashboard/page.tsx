"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

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

const categoryColor: Record<string, string> = {
  push: "text-orange-500",
  pull: "text-sky-400",
  legs: "text-emerald-400",
}

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
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
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              PowerLog
            </p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-50">
              Your workouts
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/workouts/new"
              className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
            >
              + Log workout
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              Log out
            </button>
          </div>
        </div>

        {!loading && workouts.length > 0 && (
          <p className="mb-8 font-mono text-sm text-zinc-600">
            {workouts.length} session{workouts.length !== 1 ? "s" : ""} logged · {totalVolume.toLocaleString()}kg total volume
          </p>
        )}

        {loading && (
          <p className="mt-8 text-zinc-500">Loading...</p>
        )}

        {!loading && workouts.length === 0 && (
          <div className="mt-8 rounded border border-dashed border-zinc-800 px-6 py-10 text-center">
            <p className="text-zinc-500">
              No workouts yet. Log your first one to get started.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="rounded border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-zinc-700"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">
                  {new Date(workout.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-3">
                  {workout.note && (
                    <span className="rounded border border-orange-900 bg-orange-950/50 px-2 py-0.5 text-xs font-semibold text-orange-400">
                      {workout.note}
                    </span>
                  )}
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

              <div className="space-y-1.5">
                {workout.sets.map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <p className="text-zinc-300">
                      <span className={categoryColor[set.exercise.category] || "text-zinc-500"}>
                        ●
                      </span>{" "}
                      {set.exercise.name}
                    </p>
                    <p className="font-mono text-zinc-400">
                      {set.weight}kg <span className="text-zinc-600">×</span> {set.reps}
                      {set.rpe && <span className="text-zinc-600"> @{set.rpe}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}