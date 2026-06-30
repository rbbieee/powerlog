import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params

  const workout = await prisma.workout.findUnique({
    where: { id },
  })

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 })
  }

  if (workout.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.workoutSet.deleteMany({
    where: { workoutId: id },
  })

  await prisma.workout.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params

  const workout = await prisma.workout.findUnique({
    where: { id },
  })

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 })
  }

  if (workout.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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

  await prisma.workoutSet.deleteMany({
    where: { workoutId: id },
  })

  const updatedWorkout = await prisma.workout.update({
    where: { id },
    data: {
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

  return NextResponse.json(updatedWorkout)
}