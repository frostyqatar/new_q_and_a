'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function BellPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isRinging, setIsRinging] = useState(false)

  const playBellSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((error) => {
        console.error('Error playing bell sound:', error)
      })
      setIsRinging(true)
      setTimeout(() => setIsRinging(false), 600)
    }
  }

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/bell-98033.mp3')
    audioRef.current.preload = 'auto'
    
    // Play bell sound when page loads
    playBellSound()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleBellClick = () => {
    playBellSound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Smooth Curvy Background Animations */}
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
            <linearGradient id="bell-wave1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q150,100 300,150 T600,180 T900,160 T1200,200 L1200,0 L0,0 Z"
            fill="url(#bell-wave1-gradient)"
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
            <linearGradient id="bell-wave2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,600 Q200,500 400,550 T800,580 T1200,600 L1200,800 L0,800 Z"
            fill="url(#bell-wave2-gradient)"
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
            <linearGradient id="bell-wave3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q250,200 500,280 Q750,360 1000,320 T1200,300 L1200,600 L0,600 Z"
            fill="url(#bell-wave3-gradient)"
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
            <linearGradient id="bell-blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M200,100 Q150,150 100,200 T150,300 Q200,250 250,280 T300,200 Q250,150 200,100 Z"
            fill="url(#bell-blob-gradient)"
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
            <linearGradient id="bell-curve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q200,300 400,350 Q600,400 800,380 L800,600 L0,600 Z"
            fill="url(#bell-curve-gradient)"
          />
        </svg>
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10 relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Bell 
                className={`w-32 h-32 text-yellow-500 transition-all duration-500 ease-in-out ${
                  isRinging ? 'animate-ring scale-110' : 'scale-100'
                }`}
                style={{
                  transformOrigin: 'top center',
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleBellClick}
            size="lg"
            className="w-full backdrop-blur-md bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-500/90 hover:to-orange-500/90 border border-yellow-400/50 text-white px-8 py-6 text-lg shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300"
          >
            جرس
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

