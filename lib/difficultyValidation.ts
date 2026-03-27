import type { Question } from './types'

export interface DifficultyBreakdown {
  level: number
  count: number
  isEven: boolean
}

export interface DifficultyValidation {
  isBalanced: boolean
  totalQuestions: number
  isEvenTotal: boolean
  breakdown: DifficultyBreakdown[]
  unbalancedLevels: number[]
}

/**
 * Validates that questions can be split equally between two teams by difficulty.
 * For fair assignment, each difficulty level must have an even number of questions
 * so both teams get the same count at each level.
 * The total number of questions must also be even.
 */
export function validateDifficultyBalance(questions: Question[]): DifficultyValidation {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  for (const q of questions) {
    const d = q.difficulty || 3
    counts[d] = (counts[d] || 0) + 1
  }

  const breakdown: DifficultyBreakdown[] = [1, 2, 3, 4, 5].map((level) => ({
    level,
    count: counts[level],
    isEven: counts[level] % 2 === 0,
  }))

  const unbalancedLevels = breakdown
    .filter((b) => b.count > 0 && !b.isEven)
    .map((b) => b.level)

  const isEvenTotal = questions.length % 2 === 0

  return {
    isBalanced: unbalancedLevels.length === 0 && isEvenTotal,
    totalQuestions: questions.length,
    isEvenTotal,
    breakdown,
    unbalancedLevels,
  }
}
