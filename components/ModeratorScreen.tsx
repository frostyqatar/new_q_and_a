'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timer } from '@/components/Timer'
import { MediaDisplay } from '@/components/MediaDisplay'
import { CodeDisplay } from '@/components/CodeDisplay'
import type { Team, Question } from '@/lib/types'
import { CheckCircle2, XCircle, Trophy, ArrowLeft } from 'lucide-react'

interface ModeratorScreenProps {
  team1: Team
  team2: Team
  currentTeam: 1 | 2
  currentQuestion: Question | null
  currentQuestionIndex: number | null
  totalQuestions: number
  timer: {
    timeLeft: number
    isPaused: boolean
    isRunning: boolean
  }
  onCorrect: () => void
  onIncorrect: () => void
  onPauseTimer: () => void
  onResumeTimer: () => void
  onTimeUp: () => void
  onTimerTick?: (timeLeft: number) => void
  onEndGame: () => void
  onNextQuestion: () => void
  isAnswerRevealed: boolean
  viewMode: 'public' | 'moderator'
}

export function ModeratorScreen({
  team1,
  team2,
  currentTeam,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  timer,
  onCorrect,
  onIncorrect,
  onPauseTimer,
  onResumeTimer,
  onTimeUp,
  onTimerTick,
  onEndGame,
  onNextQuestion,
  isAnswerRevealed,
  viewMode,
}: ModeratorScreenProps) {
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-xl">في انتظار السؤال التالي...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {currentQuestion.category}
                  </Badge>
                  <Timer
                    timeLeft={timer.timeLeft}
                    isPaused={timer.isPaused}
                    isRunning={timer.isRunning}
                    onPause={onPauseTimer}
                    onResume={onResumeTimer}
                    onTimeUp={onTimeUp}
                    onTick={onTimerTick}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAnswerRevealed ? (
                  <>
                    <div className="text-3xl font-bold text-center min-h-[120px] flex items-center justify-center">
                      {currentQuestion.question}
                    </div>

                    {currentQuestion.code && (
                      <div className="mt-6 flex justify-center">
                        <CodeDisplay code={currentQuestion.code} />
                      </div>
                    )}

                    {currentQuestion.media && (
                      <div className="mt-6">
                        <MediaDisplay media={currentQuestion.media} />
                      </div>
                    )}

                    <div className="flex gap-4 justify-center pt-4">
                      <Button
                        onClick={onCorrect}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                      >
                        <CheckCircle2 className="w-6 h-6 ml-2" />
                        صحيح
                      </Button>
                      <Button
                        onClick={onIncorrect}
                        size="lg"
                        variant="destructive"
                        className="px-8 py-6 text-lg"
                      >
                        <XCircle className="w-6 h-6 ml-2" />
                        خطأ
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-4">
                      <div className="text-xl text-muted-foreground mb-2">
                        الإجابة الصحيحة:
                      </div>
                      <div className="text-4xl font-bold text-green-600 bg-green-50 p-6 rounded-lg whitespace-pre-line min-h-[120px] flex items-center justify-center">
                        {currentQuestion.answer}
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={onNextQuestion}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
                      >
                        السؤال التالي
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scoreboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">النتائج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className={currentTeam === 1 ? "ring-2 ring-blue-500 rounded-lg p-3" : "p-3"}>
                    <div className="font-bold text-lg mb-2">{team1.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">صحيح:</span>
                      <span className="text-2xl font-bold">{team1.correct}</span>
                    </div>
                  </div>

                  <div className={currentTeam === 2 ? "ring-2 ring-purple-500 rounded-lg p-3" : "p-3"}>
                    <div className="font-bold text-lg mb-2">{team2.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">صحيح:</span>
                      <span className="text-2xl font-bold">{team2.correct}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            {currentQuestionIndex !== null && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold">
                      السؤال {currentQuestionIndex + 1} من {totalQuestions}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* End Game Button */}
            <Button
              onClick={onEndGame}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Trophy className="w-5 h-5 ml-2" />
              إنهاء اللعبة
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

