'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Team } from '@/lib/types'
import { RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface ResultsScreenProps {
  team1: Team
  team2: Team
  onPlayAgain: () => void
  onNewGame: () => void
  onIncrementScore?: (team: 1 | 2) => void
  onDecrementScore?: (team: 1 | 2) => void
}

export function ResultsScreen({
  team1,
  team2,
  onPlayAgain,
  onNewGame,
  onIncrementScore,
  onDecrementScore,
}: ResultsScreenProps) {
  const team1Total = team1.correct
  const team2Total = team2.correct
  const winner = team1Total > team2Total ? 1 : team2Total > team1Total ? 2 : null

  useEffect(() => {
    if (winner) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [winner])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center trophy-container">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="trophy-svg"
            >
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FDB931" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
              <path d="M6 9C6 4.5 7.5 3 12 3C16.5 3 18 4.5 18 9V11C18 13.5 16.5 16 13 16.5V19H16V21H8V19H11V16.5C7.5 16 6 13.5 6 11V9Z" />
              <path d="M6 5C3 5 2 6 2 9C2 11 3 13 6 13" />
              <path d="M18 5C21 5 22 6 22 9C22 11 21 13 18 13" />
              <path d="M12 5V9" strokeWidth="0.5" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold">
            {winner ? (
              <span>
                الفائز: <span className={winner === 1 ? 'text-blue-600' : 'text-purple-600'}>
                  {winner === 1 ? team1.name : team2.name}
                </span>
              </span>
            ) : (
              <span className="text-gray-600">تعادل!</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={cn(
              "transition-all",
              winner === 1 && "ring-4 ring-yellow-500 shadow-xl"
            )}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">{team1.name}</h2>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-green-600">
                      {team1.correct}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      إجابات صحيحة
                    </div>
                  </div>
                  {winner === 1 && (
                    <div className="mt-2 text-4xl">
                      🏆
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={cn(
              "transition-all",
              winner === 2 && "ring-4 ring-yellow-500 shadow-xl"
            )}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">{team2.name}</h2>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-green-600">
                      {team2.correct}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      إجابات صحيحة
                    </div>
                  </div>
                  {winner === 2 && (
                    <div className="mt-2 text-4xl">
                      🏆
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
            >
              <RotateCcw className="w-5 h-5 ml-2" />
              لعب مرة أخرى
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onNewGame()
              }}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              لعبة جديدة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

