import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: session.user.id },
    include: {
      sets: {
        include: {
          exercise: true,
        },
      },
    },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(workouts)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { note, sets } = body

  if (!Array.isArray(sets) || sets.length === 0) {
    return NextResponse.json(
      { error: "At least one set is required" },
      { status: 400 }
    )
  }

  for (const set of sets) {
    if (!set.exerciseId || !set.weight || !set.reps || !set.setNumber) {
      return NextResponse.json(
        { error: "Each set needs exerciseId, weight, reps, and setNumber" },
        { status: 400 }
      )
    }
  }

  const workout = await prisma.workout.create({
    data: {
      userId: session.user.id,
      note: note || null,
      sets: {
        create: sets.map((set: { exerciseId: string; setNumber: number; weight: number; reps: number; rpe?: number }) => ({
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weight: set.weight,
          reps: set.reps,
          rpe: set.rpe || null,
        })),
      },
    },
    include: {
      sets: {
        include: {
          exercise: true,
        },
      },
    },
  })

  return NextResponse.json(workout, { status: 201 })
}