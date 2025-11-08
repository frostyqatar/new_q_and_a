'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function BellPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [hasRung, setHasRung] = useState(false)

  useEffect(() => {
    // Play bell sound when page loads
    playBellSound()
  }, [])

  const playBellSound = () => {
    // Create audio context for bell sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Bell-like sound: multiple frequencies
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)

    setHasRung(true)
  }

  const handleBellClick = () => {
    playBellSound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl shadow-purple-500/10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Bell 
                className={`w-32 h-32 text-yellow-500 transition-transform duration-300 ${hasRung ? 'animate-bounce' : ''}`}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">جرس 🔔</h1>
          <p className="text-lg text-gray-600">اضغط على الجرس</p>
          <Button
            onClick={handleBellClick}
            size="lg"
            className="w-full backdrop-blur-md bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-500/90 hover:to-orange-500/90 border border-yellow-400/50 text-white px-8 py-6 text-lg shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300"
          >
            <Bell className="w-6 h-6 ml-2" />
            اضغط للجرس
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

