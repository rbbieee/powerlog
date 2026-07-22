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
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Log Workout
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Add your sets for today's session.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-panel p-6">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                Session Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Push day, felt strong today"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 placeholder-zinc-600"
              />
            </div>

            <div className="space-y-4">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="glass-panel p-5 transition-all"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                      Set {set.setNumber}
                    </p>
                    {sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(index)}
                        className="text-xs font-medium text-zinc-500 transition-colors hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <select
                    required
                    value={set.exerciseId}
                    onChange={(e) => updateSet(index, "exerciseId", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 appearance-none"
                  >
                    <option value="" disabled className="text-zinc-500">Select exercise</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1 ml-1">Weight</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        placeholder="kg"
                        value={set.weight}
                        onChange={(e) => updateSet(index, "weight", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 placeholder-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1 ml-1">Reps</label>
                      <input
                        type="number"
                        required
                        placeholder="#"
                        value={set.reps}
                        onChange={(e) => updateSet(index, "reps", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 placeholder-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1 ml-1">RPE</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="1-10"
                        value={set.rpe}
                        onChange={(e) => updateSet(index, "rpe", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-red-500 focus:bg-zinc-900 placeholder-zinc-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSet}
              className="w-full rounded-xl border border-dashed border-white/20 bg-zinc-900/30 py-4 text-sm font-medium text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 hover:bg-zinc-900/50"
            >
              + Add another set
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-red-600 py-4 font-medium text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all hover:bg-red-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Workout"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}