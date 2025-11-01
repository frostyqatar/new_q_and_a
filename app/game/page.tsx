'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameState } from '@/hooks/useGameState'
import { ModeratorScreen } from '@/components/ModeratorScreen'
import { AnswerRevealScreen } from '@/components/AnswerRevealScreen'
import { ResultsScreen } from '@/components/ResultsScreen'
import type { GameState, Question } from '@/lib/types'
import { storage } from '@/lib/storage'

function getRandomQuestion(
  questions: Question[],
  usedQuestions: string[]
): Question | null {
  const available = questions.filter((q) => !usedQuestions.includes(q.id))
  if (available.length === 0) return null
  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]
}

export default function GamePage() {
  const router = useRouter()
  const { gameState, isLoading, updateGameState } = useGameState()

  useEffect(() => {
    if (!isLoading && !gameState) {
      router.push('/')
    }
  }, [isLoading, gameState, router])

  const startQuestion = useCallback(() => {
    if (!gameState) return

    const question = getRandomQuestion(gameState.questions, gameState.usedQuestions)
    if (!question) {
      // No more questions, end game
      updateGameState({ gamePhase: 'results' })
      return
    }

    updateGameState({
      currentQuestion: question,
      currentQuestionIndex: gameState.usedQuestions.length,
      usedQuestions: [...gameState.usedQuestions, question.id],
      gamePhase: 'playing',
      timer: {
        timeLeft: 60,
        isPaused: false,
        isRunning: true,
      },
    })
  }, [gameState, updateGameState])

  const handleCorrect = useCallback(() => {
    if (!gameState) return

    const currentTeam = gameState.currentTeam === 1 ? 'team1' : 'team2'
    updateGameState({
      [currentTeam]: {
        ...gameState[currentTeam],
        correct: gameState[currentTeam].correct + 1,
      },
      gamePhase: 'answerReveal',
      timer: {
        ...gameState.timer,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

  const handleIncorrect = useCallback(() => {
    if (!gameState) return

    const currentTeam = gameState.currentTeam === 1 ? 'team1' : 'team2'
    updateGameState({
      [currentTeam]: {
        ...gameState[currentTeam],
        wrong: gameState[currentTeam].wrong + 1,
      },
      gamePhase: 'answerReveal',
      timer: {
        ...gameState.timer,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

  const handleNextQuestion = useCallback(() => {
    if (!gameState) return

    const nextTeam: 1 | 2 = gameState.currentTeam === 1 ? 2 : 1
    updateGameState({
      currentTeam: nextTeam,
      currentQuestion: null,
      currentQuestionIndex: null,
      gamePhase: 'waiting',
      timer: {
        timeLeft: 60,
        isPaused: false,
        isRunning: false,
      },
    })

    // Auto-start next question after a short delay
    setTimeout(() => {
      startQuestion()
    }, 500)
  }, [gameState, updateGameState, startQuestion])

  const handleTimerUp = useCallback(() => {
    if (!gameState) return
    // Just stop the timer, don't auto-reveal answer
    updateGameState({
      timer: {
        ...gameState.timer,
        isRunning: false,
        timeLeft: 0,
      },
    })
  }, [gameState, updateGameState])

  const handlePauseTimer = useCallback(() => {
    if (!gameState) return
    updateGameState({
      timer: {
        ...gameState.timer,
        isPaused: true,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

  const handleResumeTimer = useCallback(() => {
    if (!gameState) return
    updateGameState({
      timer: {
        ...gameState.timer,
        isPaused: false,
        isRunning: true,
      },
    })
  }, [gameState, updateGameState])

  const handleTimerTick = useCallback((newTime: number) => {
    if (!gameState) return
    updateGameState({
      timer: {
        ...gameState.timer,
        timeLeft: newTime,
      },
    })
  }, [gameState, updateGameState])

  const handleEndGame = useCallback(() => {
    if (!gameState) return
    updateGameState({
      gamePhase: 'results',
      timer: {
        ...gameState.timer,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

  const handlePlayAgain = useCallback(() => {
    if (!gameState) return
    updateGameState({
      team1: { ...gameState.team1, correct: 0, wrong: 0 },
      team2: { ...gameState.team2, correct: 0, wrong: 0 },
      currentTeam: 1,
      usedQuestions: [],
      currentQuestionIndex: null,
      currentQuestion: null,
      gamePhase: 'waiting',
      timer: {
        timeLeft: 60,
        isPaused: false,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

  const handleNewGame = useCallback(() => {
    storage.clearGameState()
    router.push('/')
  }, [router])

  useEffect(() => {
    if (!isLoading && gameState) {
      // Auto-start first question if waiting
      if (gameState.gamePhase === 'waiting' && !gameState.currentQuestion) {
        startQuestion()
      }
    }
  }, [isLoading, gameState, startQuestion])

  if (isLoading || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    )
  }

  if (gameState.gamePhase === 'results') {
    return (
      <ResultsScreen
        team1={gameState.team1}
        team2={gameState.team2}
        onPlayAgain={handlePlayAgain}
        onNewGame={handleNewGame}
      />
    )
  }

  if (gameState.gamePhase === 'answerReveal' && gameState.currentQuestion) {
    return (
      <AnswerRevealScreen
        question={gameState.currentQuestion}
        onNext={handleNextQuestion}
      />
    )
  }

  return (
    <ModeratorScreen
      team1={gameState.team1}
      team2={gameState.team2}
      currentTeam={gameState.currentTeam}
      currentQuestion={gameState.currentQuestion}
      currentQuestionIndex={gameState.currentQuestionIndex}
      totalQuestions={gameState.questions.length}
      timer={gameState.timer}
      onCorrect={handleCorrect}
      onIncorrect={handleIncorrect}
      onPauseTimer={handlePauseTimer}
      onResumeTimer={handleResumeTimer}
      onTimeUp={handleTimerUp}
      onTimerTick={handleTimerTick}
      onEndGame={handleEndGame}
      viewMode="moderator"
    />
  )
}

