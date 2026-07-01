export function epley(weight: number, reps: number): number {
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

export function brzycki(weight: number, reps: number): number {
  if (reps === 1) return weight
  if (reps >= 37) return 0
  return weight * (36 / (37 - reps))
}

export function estimateOneRepMax(weight: number, reps: number): number {
  const e = epley(weight, reps)
  const b = brzycki(weight, reps)
  const estimate = Math.min(e, b)
  return Math.round(estimate * 10) / 10
}