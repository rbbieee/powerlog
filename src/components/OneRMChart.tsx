"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { estimateOneRepMax } from "@/lib/oneRepMax"

type WorkoutSet = {
  weight: number
  reps: number
  exercise: {
    name: string
  }
}

type Workout = {
  date: string
  sets: WorkoutSet[]
}

type Props = {
  workouts: Workout[]
}

const COLORS = ["#c2410c", "#0ea5e9", "#10b981", "#a855f7", "#f59e0b"]

export default function OneRMChart({ workouts }: Props) {
  const exerciseNames = Array.from(
    new Set(workouts.flatMap((w) => w.sets.map((s) => s.exercise.name)))
  )

  const data = workouts
    .slice()
    .reverse()
    .map((workout) => {
      const point: Record<string, string | number> = {
        date: new Date(workout.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }

      for (const name of exerciseNames) {
        const relevantSets = workout.sets.filter((s) => s.exercise.name === name)
        if (relevantSets.length > 0) {
          const best = Math.max(
            ...relevantSets.map((s) => estimateOneRepMax(s.weight, s.reps))
          )
          point[name] = best
        }
      }

      return point
    })

  if (data.length < 2) return null

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-600">
        Estimated 1RM progress
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#52525b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#52525b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={45}
            tickFormatter={(v) => `${v}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "6px",
              color: "#e4e4e7",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value)}kg`, "Est. 1RM"]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#52525b" }}
          />
          {exerciseNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS[index % COLORS.length] }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}