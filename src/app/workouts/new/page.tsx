"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Exercise = {
  id: string
  name: string
  category: string
}

type SetInput = {
  exerciseId: string
  setNumber: number
  weight: string
  reps: string
  rpe: string
}

export default function NewWorkoutPage() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [note, setNote] = useState("")
  const [sets, setSets] = useState<SetInput[]>([
    { exerciseId: "", setNumber: 1, weight: "", reps: "", rpe: "" },
  ])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => setExercises(data))
  }, [])

  const updateSet = (index: number, field: keyof SetInput, value: string) => {
    const newSets = [...sets]
    newSets[index] = { ...newSets[index], [field]: value }
    setSets(newSets)
  }

  const addSet = () => {
    setSets([
      ...sets,
      { exerciseId: "", setNumber: sets.length + 1, weight: "", reps: "", rpe: "" },
    ])
  }

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const payload = {
      note: note || null,
      sets: sets.map((set) => ({
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        weight: parseFloat(set.weight),
        reps: parseInt(set.reps),
        rpe: set.rpe ? parseFloat(set.rpe) : undefined,
      })),
    }

    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = await response.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex items-center justify-between px-8 py-5 md:px-16">
        <Link href="/dashboard">
          <p className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange-600">
            POWERLOG
          </p>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 transition hover:text-zinc-200"
        >
          ← Dashboard
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-(family-name:--font-bebas) text-5xl text-zinc-50">
            LOG A WORKOUT
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Add your sets for today's session.
          </p>

          {error && (
            <p className="mt-4 rounded border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-600">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Push day, felt strong today"
                className="mt-2 w-full rounded border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-orange-600"
              />
            </div>

            <div className="space-y-3">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="rounded border border-zinc-800 bg-zinc-900/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-(family-name:--font-dm-mono) text-xs uppercase tracking-widest text-zinc-600">
                      Set {set.setNumber}
                    </p>
                    {sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(index)}
                        className="text-xs text-zinc-600 hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <select
                    required
                    value={set.exerciseId}
                    onChange={(e) => updateSet(index, "exerciseId", e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none focus:border-orange-600"
                  >
                    <option value="">Select exercise</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.5"
                      required
                      placeholder="Weight (kg)"
                      value={set.weight}
                      onChange={(e) => updateSet(index, "weight", e.target.value)}
                      className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-zinc-50 outline-none focus:border-orange-600"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => updateSet(index, "reps", e.target.value)}
                      className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-zinc-50 outline-none focus:border-orange-600"
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="RPE"
                      value={set.rpe}
                      onChange={(e) => updateSet(index, "rpe", e.target.value)}
                      className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-zinc-50 outline-none focus:border-orange-600"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSet}
              className="w-full rounded border border-zinc-800 py-2.5 text-sm text-zinc-500 transition hover:border-orange-600 hover:text-orange-500"
            >
              + Add another set
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-orange-600 py-3 font-semibold text-zinc-950 transition hover:bg-orange-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save workout"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}