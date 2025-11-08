'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timer } from '@/components/Timer'
import { MediaDisplay } from '@/components/MediaDisplay'
import { CodeDisplay } from '@/components/CodeDisplay'
import type { Team, Question } from '@/lib/types'
import { CheckCircle2, XCircle, Flag, Eye, Plus, Minus } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo } from 'react'

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
  onRevealAnswer: () => void
  onPauseTimer: () => void
  onResumeTimer: () => void
  onTimeUp: () => void
  onTimerTick?: (timeLeft: number) => void
  onEndGame: () => void
  isAnswerRevealed: boolean
  viewMode: 'public' | 'moderator'
  gameMode: 'normal' | 'bell'
  onSwitchTeam?: (team: 1 | 2) => void
  onIncrementScore?: (team: 1 | 2) => void
  onDecrementScore?: (team: 1 | 2) => void
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
  onRevealAnswer,
  onPauseTimer,
  onResumeTimer,
  onTimeUp,
  onTimerTick,
  onEndGame,
  isAnswerRevealed,
  viewMode,
  gameMode,
  onSwitchTeam,
  onIncrementScore,
  onDecrementScore,
}: ModeratorScreenProps) {
  const bellUrl = useMemo(() => {
    if (globalThis.window !== undefined) {
      return `${globalThis.window.location.origin}/bell`
    }
    return '/bell'
  }, [])
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-20 animate-[float_20s_ease-in-out_infinite]"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waiting-wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 Q150,100 300,150 T600,180 T900,160 T1200,200 L1200,0 L0,0 Z"
              fill="url(#waiting-wave1)"
              transform="translate(0, -50)"
            />
          </svg>
        </div>
        <Card className="relative z-10 backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10">
          <CardContent className="p-8 text-center">
            <p className="text-xl text-gray-800">في انتظار السؤال التالي...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Wave 1 - Top Left */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-25 animate-[float_20s_ease-in-out_infinite]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '0s' }}
        >
          <defs>
            <linearGradient id="game-wave1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q150,100 300,150 T600,180 T900,160 T1200,200 L1200,0 L0,0 Z"
            fill="url(#game-wave1-gradient)"
            transform="translate(0, -50)"
          />
        </svg>

        {/* Wave 2 - Bottom Right */}
        <svg
          className="absolute bottom-0 right-0 w-full h-full opacity-20 animate-[float_25s_ease-in-out_infinite]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '2s' }}
        >
          <defs>
            <linearGradient id="game-wave2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,600 Q200,500 400,550 T800,580 T1200,600 L1200,800 L0,800 Z"
            fill="url(#game-wave2-gradient)"
            transform="translate(0, 50)"
          />
        </svg>

        {/* Organic Blob Shape */}
        <svg
          className="absolute top-1/4 right-1/4 w-96 h-96 opacity-15 animate-[float_35s_ease-in-out_infinite,rotate_60s_linear_infinite]"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '3s' }}
        >
          <defs>
            <linearGradient id="game-blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M200,100 Q150,150 100,200 T150,300 Q200,250 250,280 T300,200 Q250,150 200,100 Z"
            fill="url(#game-blob-gradient)"
            transform="rotate(-20 200 200)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10">
              <CardHeader className="backdrop-blur-sm bg-white/10 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className="text-lg px-4 py-2 backdrop-blur-md bg-white/40 border border-white/50"
                    style={{ color: '#800020' }}
                  >
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
                {isAnswerRevealed ? (
                  <>
                    <div className="text-center space-y-4">
                      <div className="text-xl text-gray-700 mb-2 backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2 inline-block">
                        الإجابة الصحيحة:
                      </div>
                      <div className="text-4xl font-bold text-green-700 backdrop-blur-md bg-green-100/50 border border-green-200/50 p-6 rounded-lg whitespace-pre-line min-h-[120px] flex items-center justify-center shadow-lg shadow-green-500/10">
                        {currentQuestion.answer}
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                      <Button
                        onClick={onCorrect}
                        size="lg"
                        className="backdrop-blur-md bg-green-500/80 hover:bg-green-500/90 border border-green-400/50 text-white px-8 py-6 text-lg shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                      >
                        <CheckCircle2 className="w-6 h-6 ml-2" />
                        صحيح
                      </Button>
                      <Button
                        onClick={onIncorrect}
                        size="lg"
                        className="backdrop-blur-md bg-red-500/80 hover:bg-red-500/90 border border-red-400/50 text-white px-8 py-6 text-lg shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                      >
                        <XCircle className="w-6 h-6 ml-2" />
                        خطأ
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-center min-h-[120px] flex items-center justify-center text-gray-800">
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
                        onClick={onRevealAnswer}
                        size="lg"
                        className="backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500/90 hover:to-purple-500/90 border border-purple-400/50 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                      >
                        <Eye className="w-6 h-6 ml-2" />
                        كشف
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
            <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10">
              <CardHeader className="backdrop-blur-sm bg-white/10 border-b border-white/20">
                <CardTitle className="text-center" style={{ color: '#800020' }}>النتائج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div 
                    className={currentTeam === 1 
                      ? "ring-2 ring-blue-400/60 rounded-lg p-3 backdrop-blur-sm bg-blue-50/40 border border-blue-200/50 shadow-lg shadow-blue-500/10" 
                      : "p-3 backdrop-blur-sm bg-white/20 rounded-lg border border-white/30"
                    }
                    onClick={gameMode === 'bell' && onSwitchTeam ? () => onSwitchTeam(1) : undefined}
                    onKeyDown={gameMode === 'bell' && onSwitchTeam ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSwitchTeam(1)
                      }
                    } : undefined}
                    role={gameMode === 'bell' && onSwitchTeam ? 'button' : undefined}
                    tabIndex={gameMode === 'bell' && onSwitchTeam ? 0 : undefined}
                    style={gameMode === 'bell' && onSwitchTeam ? { cursor: 'pointer' } : {}}
                  >
                    <div className="font-bold text-lg mb-2 text-gray-800">{team1.name}</div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-green-700 font-semibold">صحيح:</span>
                      <div className="flex items-center gap-2">
                        {onDecrementScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDecrementScore(1)
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-red-100"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                        <span className="text-2xl font-bold text-gray-800">{team1.correct}</span>
                        {onIncrementScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onIncrementScore(1)
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-green-100"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div 
                    className={currentTeam === 2 
                      ? "ring-2 ring-purple-400/60 rounded-lg p-3 backdrop-blur-sm bg-purple-50/40 border border-purple-200/50 shadow-lg shadow-purple-500/10" 
                      : "p-3 backdrop-blur-sm bg-white/20 rounded-lg border border-white/30"
                    }
                    onClick={gameMode === 'bell' && onSwitchTeam ? () => onSwitchTeam(2) : undefined}
                    onKeyDown={gameMode === 'bell' && onSwitchTeam ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSwitchTeam(2)
                      }
                    } : undefined}
                    role={gameMode === 'bell' && onSwitchTeam ? 'button' : undefined}
                    tabIndex={gameMode === 'bell' && onSwitchTeam ? 0 : undefined}
                    style={gameMode === 'bell' && onSwitchTeam ? { cursor: 'pointer' } : {}}
                  >
                    <div className="font-bold text-lg mb-2 text-gray-800">{team2.name}</div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-green-700 font-semibold">صحيح:</span>
                      <div className="flex items-center gap-2">
                        {onDecrementScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDecrementScore(2)
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-red-100"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                        <span className="text-2xl font-bold text-gray-800">{team2.correct}</span>
                        {onIncrementScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onIncrementScore(2)
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-green-100"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            {currentQuestionIndex !== null && (
              <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      السؤال {currentQuestionIndex + 1} من {totalQuestions}
                    </div>
                    <div className="w-full backdrop-blur-sm bg-white/30 rounded-full h-3 border border-white/40 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 h-3 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20"
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
              className="w-full backdrop-blur-md bg-white/40 hover:bg-white/50 border border-white/50 text-gray-800 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
              size="lg"
            >
              <Flag className="w-5 h-5 ml-2" />
              إنهاء اللعبة
            </Button>

            {/* QR Code for Bell Mode */}
            {gameMode === 'bell' && !isAnswerRevealed && (
              <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-bold text-gray-800">افتح الجرس 🔔</div>
                <div className="backdrop-blur-md bg-white/40 border border-white/50 rounded-lg p-4 shadow-lg">
                  <QRCodeSVG value={bellUrl} size={150} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

