"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
            PowerLog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-50">
            Log a workout
          </h1>
        </div>

        {error && (
          <p className="rounded border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-400">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Push day, felt strong today"
            className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
          />
        </div>

        <div className="space-y-4">
          {sets.map((set, index) => (
            <div
              key={index}
              className="space-y-3 rounded border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-400">
                  Set {set.setNumber}
                </p>
                {sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <select
                required
                value={set.exerciseId}
                onChange={(e) => updateSet(index, "exerciseId", e.target.value)}
                className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
              >
                <option value="">Select exercise</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="Weight (kg)"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
                />
                <input
                  type="number"
                  required
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
                />
                <input
                  type="number"
                  step="0.5"
                  placeholder="RPE"
                  value={set.rpe}
                  onChange={(e) => updateSet(index, "rpe", e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-orange-600"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSet}
          className="w-full rounded border border-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:border-orange-600 hover:text-orange-500"
        >
          + Add another set
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-orange-600 px-3 py-2 font-semibold text-zinc-950 transition hover:bg-orange-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save workout"}
        </button>
      </form>
    </div>
  )
}