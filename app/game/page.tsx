'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameState } from '@/hooks/useGameState'
import { ModeratorScreen } from '@/components/ModeratorScreen'
import { ResultsScreen } from '@/components/ResultsScreen'
import type { Question } from '@/lib/types'
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
  const teamSelectionAudioRef = useRef<HTMLAudioElement | null>(null)
  const revealAudioRef = useRef<HTMLAudioElement | null>(null)
  const correctAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!isLoading && !gameState) {
      router.push('/')
    }
  }, [isLoading, gameState, router])

  useEffect(() => {
    // Initialize all audio elements
    teamSelectionAudioRef.current = new Audio('/notification-for-game-scenes-132473.mp3')
    teamSelectionAudioRef.current.preload = 'auto'

    revealAudioRef.current = new Audio('/shine-11-268907.mp3')
    revealAudioRef.current.preload = 'auto'

    correctAudioRef.current = new Audio('/correct-choice-43861.mp3')
    correctAudioRef.current.preload = 'auto'

    wrongAudioRef.current = new Audio('/wrong-answer-126515.mp3')
    wrongAudioRef.current.preload = 'auto'
    wrongAudioRef.current.volume = 0.1 // Reduce volume by 30%

    return () => {
      if (teamSelectionAudioRef.current) {
        teamSelectionAudioRef.current.pause()
        teamSelectionAudioRef.current = null
      }
      if (revealAudioRef.current) {
        revealAudioRef.current.pause()
        revealAudioRef.current = null
      }
      if (correctAudioRef.current) {
        correctAudioRef.current.pause()
        correctAudioRef.current = null
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.pause()
        wrongAudioRef.current = null
      }
    }
  }, [])

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

    // Play correct sound
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0
      correctAudioRef.current.play().catch((error) => {
        console.error('Error playing correct sound:', error)
      })
    }

    const currentTeam = gameState.currentTeam === 1 ? 'team1' : 'team2'
    const nextTeam: 1 | 2 = gameState.currentTeam === 1 ? 2 : 1
    
    // Get the next question
    const question = getRandomQuestion(gameState.questions, gameState.usedQuestions)
    if (!question) {
      // No more questions, end game
      updateGameState({
        [currentTeam]: {
          ...gameState[currentTeam],
          correct: gameState[currentTeam].correct + 1,
        },
        gamePhase: 'results',
        timer: {
          ...gameState.timer,
          isRunning: false,
        },
      })
      return
    }

    // In bell mode, don't switch teams automatically
    const shouldSwitchTeam = gameState.gameMode !== 'bell'

    // Update state with score and next question
    updateGameState({
      [currentTeam]: {
        ...gameState[currentTeam],
        correct: gameState[currentTeam].correct + 1,
      },
      currentTeam: shouldSwitchTeam ? nextTeam : gameState.currentTeam,
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

  const handleIncorrect = useCallback(() => {
    if (!gameState) return

    // Play wrong answer sound
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0
      wrongAudioRef.current.play().catch((error) => {
        console.error('Error playing wrong answer sound:', error)
      })
    }

    const currentTeam = gameState.currentTeam === 1 ? 'team1' : 'team2'
    const nextTeam: 1 | 2 = gameState.currentTeam === 1 ? 2 : 1
    
    // Get the next question
    const question = getRandomQuestion(gameState.questions, gameState.usedQuestions)
    
    // In bell mode, subtract 1 from correct score. In normal mode, add to wrong count
    const isBellMode = gameState.gameMode === 'bell'
    
    if (!question) {
      // No more questions, end game
      if (isBellMode) {
        updateGameState({
          [currentTeam]: {
            ...gameState[currentTeam],
            correct: Math.max(0, gameState[currentTeam].correct - 1),
          },
          gamePhase: 'results',
          timer: {
            ...gameState.timer,
            isRunning: false,
          },
        })
      } else {
        updateGameState({
          [currentTeam]: {
            ...gameState[currentTeam],
            wrong: gameState[currentTeam].wrong + 1,
          },
          gamePhase: 'results',
          timer: {
            ...gameState.timer,
            isRunning: false,
          },
        })
      }
      return
    }

    // In bell mode, don't switch teams automatically
    const shouldSwitchTeam = !isBellMode

    // Update state with score and next question
    if (isBellMode) {
      updateGameState({
        [currentTeam]: {
          ...gameState[currentTeam],
          correct: Math.max(0, gameState[currentTeam].correct - 1),
        },
        currentTeam: gameState.currentTeam, // Don't switch in bell mode
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
    } else {
      updateGameState({
        [currentTeam]: {
          ...gameState[currentTeam],
          wrong: gameState[currentTeam].wrong + 1,
        },
        currentTeam: nextTeam,
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
    }
  }, [gameState, updateGameState])

  const handleRevealAnswer = useCallback(() => {
    if (!gameState) return
    
    // Play reveal sound
    if (revealAudioRef.current) {
      revealAudioRef.current.currentTime = 0
      revealAudioRef.current.play().catch((error) => {
        console.error('Error playing reveal sound:', error)
      })
    }
    
    updateGameState({
      gamePhase: 'answerReveal',
      timer: {
        ...gameState.timer,
        isRunning: false,
      },
    })
  }, [gameState, updateGameState])

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

  const handleSwitchTeam = useCallback((team: 1 | 2) => {
    if (!gameState) return
    
    // Play notification sound when team is selected
    if (teamSelectionAudioRef.current) {
      teamSelectionAudioRef.current.currentTime = 0
      teamSelectionAudioRef.current.play().catch((error) => {
        console.error('Error playing team selection sound:', error)
      })
    }
    
    updateGameState({
      currentTeam: team,
    })
  }, [gameState, updateGameState])

  const handleIncrementScore = useCallback((team: 1 | 2) => {
    if (!gameState) return
    const teamKey = team === 1 ? 'team1' : 'team2'
    updateGameState({
      [teamKey]: {
        ...gameState[teamKey],
        correct: gameState[teamKey].correct + 1,
      },
    })
  }, [gameState, updateGameState])

  const handleDecrementScore = useCallback((team: 1 | 2) => {
    if (!gameState) return
    const teamKey = team === 1 ? 'team1' : 'team2'
    updateGameState({
      [teamKey]: {
        ...gameState[teamKey],
        correct: Math.max(0, gameState[teamKey].correct - 1),
      },
    })
  }, [gameState, updateGameState])

  useEffect(() => {
    if (!isLoading && gameState) {
      // Auto-start first question if waiting (only on initial load)
      if (gameState.gamePhase === 'waiting' && !gameState.currentQuestion && gameState.usedQuestions.length === 0) {
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
        onIncrementScore={handleIncrementScore}
        onDecrementScore={handleDecrementScore}
      />
    )
  }

  const isAnswerRevealed = gameState.gamePhase === 'answerReveal'

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
      onRevealAnswer={handleRevealAnswer}
      onPauseTimer={handlePauseTimer}
      onResumeTimer={handleResumeTimer}
      onTimeUp={handleTimerUp}
      onTimerTick={handleTimerTick}
      onEndGame={handleEndGame}
      isAnswerRevealed={isAnswerRevealed}
      viewMode="moderator"
      gameMode={gameState.gameMode || 'normal'}
      onSwitchTeam={handleSwitchTeam}
      onIncrementScore={handleIncrementScore}
      onDecrementScore={handleDecrementScore}
    />
  )
}

