import { useState, useEffect, useCallback } from 'react'
import { GameState } from '@/lib/types'
import { storage } from '@/lib/storage'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedState = storage.getGameState()
    if (savedState) {
      setGameState(savedState)
    }
    setIsLoading(false)
  }, [])

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => {
      if (!prev) return prev
      const newState = { ...prev, ...updates }
      storage.saveGameState(newState)
      return newState
    })
  }, [])

  const resetGame = useCallback(() => {
    storage.clearGameState()
    setGameState(null)
  }, [])

  return {
    gameState,
    isLoading,
    updateGameState,
    resetGame,
    setGameState,
  }
}

