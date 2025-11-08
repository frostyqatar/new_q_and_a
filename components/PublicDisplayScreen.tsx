'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Team } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Plus, Minus } from 'lucide-react'

interface PublicDisplayScreenProps {
  team1: Team
  team2: Team
  currentTeam: 1 | 2
  currentQuestionIndex: number | null
  totalQuestions: number
  viewMode: 'public' | 'moderator'
  onIncrementScore?: (team: 1 | 2) => void
  onDecrementScore?: (team: 1 | 2) => void
}

export function PublicDisplayScreen({
  team1,
  team2,
  currentTeam,
  currentQuestionIndex,
  totalQuestions,
  viewMode,
  onIncrementScore,
  onDecrementScore,
}: PublicDisplayScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Teams Scoreboard */}
        <div className="grid grid-cols-2 gap-6">
          <Card className={cn(
            "transition-all duration-300",
            currentTeam === 1 && "ring-4 ring-blue-500 shadow-xl scale-105"
          )}>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className={cn(
                  "text-3xl font-bold",
                  currentTeam === 1 && "text-blue-600"
                )}>
                  {team1.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    {onDecrementScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDecrementScore(1)}
                        className="h-10 w-10 p-0 rounded-full hover:bg-red-100"
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                    )}
                    <div className="text-5xl font-bold text-green-600">
                      {team1.correct}
                    </div>
                    {onIncrementScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onIncrementScore(1)}
                        className="h-10 w-10 p-0 rounded-full hover:bg-green-100"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجابات صحيحة
                  </div>
                </div>
                {currentTeam === 1 && (
                  <Badge className="bg-blue-500 text-white mt-2">
                    دورك الآن
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "transition-all duration-300",
            currentTeam === 2 && "ring-4 ring-purple-500 shadow-xl scale-105"
          )}>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className={cn(
                  "text-3xl font-bold",
                  currentTeam === 2 && "text-purple-600"
                )}>
                  {team2.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    {onDecrementScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDecrementScore(2)}
                        className="h-10 w-10 p-0 rounded-full hover:bg-red-100"
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                    )}
                    <div className="text-5xl font-bold text-green-600">
                      {team2.correct}
                    </div>
                    {onIncrementScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onIncrementScore(2)}
                        className="h-10 w-10 p-0 rounded-full hover:bg-green-100"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجابات صحيحة
                  </div>
                </div>
                {currentTeam === 2 && (
                  <Badge className="bg-purple-500 text-white mt-2">
                    دورك الآن
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        {currentQuestionIndex !== null && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  السؤال {currentQuestionIndex + 1} من {totalQuestions}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

