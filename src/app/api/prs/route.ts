import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { estimateOneRepMax } from "@/lib/oneRepMax"

type PREntry = {
  exerciseName: string
  category: string
  weight: number
  reps: number
  estimatedOneRepMax: number
  date: Date
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const sets = await prisma.workoutSet.findMany({
    where: {
      workout: {
        userId: session.user.id,
      },
    },
    include: {
      exercise: true,
      workout: {
        select: {
          date: true,
        },
      },
    },
  })

  const prMap: Record<string, PREntry> = {}

  for (const set of sets) {
    const estimated = estimateOneRepMax(set.weight, set.reps)
    const existing = prMap[set.exerciseId]

    if (!existing || estimated > existing.estimatedOneRepMax) {
      prMap[set.exerciseId] = {
        exerciseName: set.exercise.name,
        category: set.exercise.category,
        weight: set.weight,
        reps: set.reps,
        estimatedOneRepMax: estimated,
        date: set.workout.date,
      }
    }
  }

  const prs = (Object.values(prMap) as PREntry[]).sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName)
  )

  return NextResponse.json(prs)
}