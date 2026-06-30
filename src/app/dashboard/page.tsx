"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
              PowerLog
            </p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-50">
              Your workouts
            </h1>
          </div>
          <Link
            href="/workouts/new"
            className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-500"
          >
            + Log workout
          </Link>
        </div>

        {loading && (
          <p className="text-zinc-500">Loading...</p>
        )}

        {!loading && workouts.length === 0 && (
          <p className="text-zinc-500">
            No workouts yet. Log your first one to get started.
          </p>
        )}

        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="rounded border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  {new Date(workout.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {workout.note && (
                  <p className="text-sm font-medium text-orange-500">
                    {workout.note}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                {workout.sets.map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <p className="text-zinc-300">{set.exercise.name}</p>
                    <p className="text-zinc-500">
                      {set.weight}kg × {set.reps}
                      {set.rpe && ` @ RPE ${set.rpe}`}
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