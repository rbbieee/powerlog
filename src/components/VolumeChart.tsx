"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type WorkoutSet = {
  weight: number
  reps: number
}

type Workout = {
  date: string
  sets: WorkoutSet[]
}

type ChartData = {
  date: string
  volume: number
}

type Props = {
  workouts: Workout[]
}

export default function VolumeChart({ workouts }: Props) {
  const data: ChartData[] = workouts
    .slice()
    .reverse()
    .map((workout) => ({
      date: new Date(workout.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
    }))

  if (data.length === 0) return null

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-600">
        Volume per session
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={20}>
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
            formatter={(value) => [`${Number(value)}kg`, "Volume"]}
          />
          <Bar dataKey="volume" fill="#c2410c" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}