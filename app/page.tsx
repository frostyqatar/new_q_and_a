'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { storage } from '@/lib/storage'

export default function HomeScreen() {
  const router = useRouter()
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [canStart, setCanStart] = useState(false)

  useEffect(() => {
    // Check if there's a saved game state
    const savedState = storage.getGameState()
    if (savedState && savedState.gamePhase !== 'waiting') {
      // Resume game
      router.push('/game')
    }
  }, [router])

  useEffect(() => {
    setCanStart(team1Name.trim().length > 0 && team2Name.trim().length > 0)
  }, [team1Name, team2Name])

  const handleStart = () => {
    if (!canStart) return
    
    // Initialize game state
    const questions = storage.getQuestions()
    const gameState = {
      team1: { name: team1Name.trim(), correct: 0, wrong: 0 },
      team2: { name: team2Name.trim(), correct: 0, wrong: 0 },
      currentTeam: 1 as 1 | 2,
      questions,
      usedQuestions: [],
      currentQuestionIndex: null,
      currentQuestion: null,
      gamePhase: 'waiting' as const,
      timer: {
        timeLeft: 60,
        isPaused: false,
        isRunning: false,
      },
      viewMode: 'public' as const,
    }
    
    storage.saveGameState(gameState)
    router.push('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Zaha Hadid Style Waves */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Wave 1 - Top Left */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-30 animate-[float_20s_ease-in-out_infinite]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '0s' }}
        >
          <defs>
            <linearGradient id="wave1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q150,100 300,150 T600,180 T900,160 T1200,200 L1200,0 L0,0 Z"
            fill="url(#wave1-gradient)"
            transform="translate(0, -50)"
          />
        </svg>

        {/* Wave 2 - Bottom Right */}
        <svg
          className="absolute bottom-0 right-0 w-full h-full opacity-25 animate-[float_25s_ease-in-out_infinite]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '2s' }}
        >
          <defs>
            <linearGradient id="wave2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,600 Q200,500 400,550 T800,580 T1200,600 L1200,800 L0,800 Z"
            fill="url(#wave2-gradient)"
            transform="translate(0, 50)"
          />
        </svg>

        {/* Wave 3 - Middle Flowing */}
        <svg
          className="absolute top-1/3 left-0 w-full h-full opacity-20 animate-[float_30s_ease-in-out_infinite]"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '1s' }}
        >
          <defs>
            <linearGradient id="wave3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q250,200 500,280 Q750,360 1000,320 T1200,300 L1200,600 L0,600 Z"
            fill="url(#wave3-gradient)"
          />
        </svg>

        {/* Organic Blob Shape - Zaha Hadid Signature Style */}
        <svg
          className="absolute top-1/4 right-1/4 w-96 h-96 opacity-15 animate-[float_35s_ease-in-out_infinite,rotate_60s_linear_infinite]"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '3s' }}
        >
          <defs>
            <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M200,100 Q150,150 100,200 T150,300 Q200,250 250,280 T300,200 Q250,150 200,100 Z"
            fill="url(#blob-gradient)"
            transform="rotate(-20 200 200)"
          />
        </svg>

        {/* Flowing Curve Element */}
        <svg
          className="absolute bottom-1/3 left-1/3 w-full h-full opacity-15 animate-[float_28s_ease-in-out_infinite]"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDelay: '1.5s' }}
        >
          <defs>
            <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q200,300 400,350 Q600,400 800,380 L800,600 L0,600 Z"
            fill="url(#curve-gradient)"
          />
        </svg>
      </div>

      <Card className="w-full max-w-md shadow-xl relative z-10 backdrop-blur-md bg-white/70 border border-white/20">
        <CardHeader className="text-center">
          <CardTitle 
            className="text-4xl font-semibold"
            style={{ 
              color: '#800020',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}
          >
            اسـئلــة وأجــوبــة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="team1" className="text-xl font-bold text-gray-800">
              اسم الفريق الأول
            </label>
            <Input
              id="team1"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              placeholder=""
              className="text-lg transition-all duration-300 focus:scale-105 focus:shadow-lg focus:shadow-purple-200/50 border-2 border-gray-200 focus:border-purple-400"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="team2" className="text-xl font-bold text-gray-800">
              اسم الفريق الثاني
            </label>
            <Input
              id="team2"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              placeholder=""
              className="text-lg transition-all duration-300 focus:scale-105 focus:shadow-lg focus:shadow-purple-200/50 border-2 border-gray-200 focus:border-purple-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canStart) {
                  handleStart()
                }
              }}
            />
          </div>
          <Button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full h-12 text-lg font-semibold backdrop-blur-md bg-white/30 border border-white/30 shadow-lg hover:bg-white/40 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
            style={{
              background: canStart 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
            }}
          >
            ابدأ اللعبة
          </Button>
          <Button
            onClick={() => router.push('/admin')}
            className="w-full h-12 text-lg font-semibold backdrop-blur-md bg-white/30 border border-white/30 shadow-lg hover:bg-white/40 hover:shadow-xl transition-all duration-300 text-gray-800"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))',
            }}
          >
            إدارة الأسئلة
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

