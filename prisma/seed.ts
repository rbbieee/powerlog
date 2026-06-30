import { prisma } from "../src/lib/db"

const exercises = [
  { name: "Bench Press", category: "push" },
  { name: "Overhead Press", category: "push" },
  { name: "Incline Bench Press", category: "push" },
  { name: "Squat", category: "legs" },
  { name: "Leg Press", category: "legs" },
  { name: "Romanian Deadlift", category: "legs" },
  { name: "Deadlift", category: "pull" },
  { name: "Barbell Row", category: "pull" },
  { name: "Pull Up", category: "pull" },
]

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    })
  }
  console.log("Seed completed")
}

main()