'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Team } from '@/lib/types'
import { Trophy, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultsScreenProps {
  team1: Team
  team2: Team
  onPlayAgain: () => void
  onNewGame: () => void
}

export function ResultsScreen({
  team1,
  team2,
  onPlayAgain,
  onNewGame,
}: ResultsScreenProps) {
  const team1Total = team1.correct
  const team2Total = team2.correct
  const winner = team1Total > team2Total ? 1 : team2Total > team1Total ? 2 : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-20 h-20 text-yellow-500" />
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

