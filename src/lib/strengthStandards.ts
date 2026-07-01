type Standard = {
  bodyweight: number
  beginner: number
  novice: number
  intermediate: number
  advanced: number
  elite: number
}

export const maleStandards: Standard[] = [
  { bodyweight: 59, beginner: 192, novice: 245, intermediate: 305, advanced: 372, elite: 446 },
  { bodyweight: 66, beginner: 222, novice: 281, intermediate: 348, advanced: 423, elite: 504 },
  { bodyweight: 74, beginner: 249, novice: 314, intermediate: 388, advanced: 470, elite: 558 },
  { bodyweight: 83, beginner: 274, novice: 344, intermediate: 424, advanced: 512, elite: 607 },
  { bodyweight: 93, beginner: 297, novice: 372, intermediate: 457, advanced: 551, elite: 652 },
  { bodyweight: 105, beginner: 319, novice: 399, intermediate: 489, advanced: 589, elite: 696 },
  { bodyweight: 120, beginner: 343, novice: 428, intermediate: 524, advanced: 630, elite: 744 },
  { bodyweight: 140, beginner: 366, novice: 457, intermediate: 558, advanced: 670, elite: 790 },
]

export const femaleStandards: Standard[] = [
  { bodyweight: 47, beginner: 111, novice: 141, intermediate: 175, advanced: 214, elite: 257 },
  { bodyweight: 52, beginner: 123, novice: 155, intermediate: 192, advanced: 234, elite: 281 },
  { bodyweight: 57, beginner: 133, novice: 168, intermediate: 208, advanced: 253, elite: 303 },
  { bodyweight: 63, beginner: 144, novice: 181, intermediate: 223, advanced: 271, elite: 325 },
  { bodyweight: 69, beginner: 153, novice: 193, intermediate: 238, advanced: 289, elite: 345 },
  { bodyweight: 76, beginner: 163, novice: 205, intermediate: 252, advanced: 306, elite: 365 },
  { bodyweight: 84, beginner: 172, novice: 216, intermediate: 266, advanced: 322, elite: 384 },
  { bodyweight: 100, beginner: 185, novice: 232, intermediate: 285, advanced: 345, elite: 411 },
]

export type StrengthLevel = "Beginner" | "Novice" | "Intermediate" | "Advanced" | "Elite" | "Unknown"

export function getStrengthLevel(total: number, bodyweight: number, gender: "male" | "female"): StrengthLevel {
  const standards = gender === "male" ? maleStandards : femaleStandards

  const closest = standards.reduce((prev, curr) =>
    Math.abs(curr.bodyweight - bodyweight) < Math.abs(prev.bodyweight - bodyweight) ? curr : prev
  )

  if (total >= closest.elite) return "Elite"
  if (total >= closest.advanced) return "Advanced"
  if (total >= closest.intermediate) return "Intermediate"
  if (total >= closest.novice) return "Novice"
  if (total >= closest.beginner) return "Beginner"
  return "Unknown"
}

export function getDOTSScore(total: number, bodyweight: number, gender: "male" | "female"): number {
  const a = gender === "male"
    ? [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093]
    : [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706]

  const bwClamped = Math.min(Math.max(bodyweight, 40), 210)
  const denominator =
    a[0] +
    a[1] * bwClamped +
    a[2] * bwClamped ** 2 +
    a[3] * bwClamped ** 3 +
    a[4] * bwClamped ** 4

  const dots = (500 / denominator) * total
  return Math.round(dots * 100) / 100
}