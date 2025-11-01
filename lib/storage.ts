import { GameState, Question } from './types'

const STORAGE_KEYS = {
  GAME_STATE: 'quick_qa_game_state',
  QUESTIONS: 'quick_qa_questions',
}

export const storage = {
  getGameState: (): GameState | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
    return stored ? JSON.parse(stored) : null
  },

  saveGameState: (state: GameState): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state))
  },

  getQuestions: (): Question[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
    return stored ? JSON.parse(stored) : []
  },

  saveQuestions: (questions: Question[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))
  },

  clearGameState: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE)
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE)
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS)
  },
}

