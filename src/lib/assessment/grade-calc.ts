export function calculateGrade(score: number): {
  letter: string
  predicate: string
} {
  if (score >= 86) return { letter: "A", predicate: "Sangat Baik" }
  if (score >= 71) return { letter: "B", predicate: "Baik" }
  if (score >= 56) return { letter: "C", predicate: "Cukup" }
  return { letter: "D", predicate: "Kurang" }
}
