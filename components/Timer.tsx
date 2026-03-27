'use client'

import { useEffect, useState } from 'react'
import { Clock, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimerProps {
  timeLeft: number
  isPaused: boolean
  isRunning: boolean
  onPause: () => void
  onResume: () => void
  onTimeUp: () => void
  onTick?: (timeLeft: number) => void
  className?: string
}

export function Timer({
  timeLeft,
  isPaused,
  isRunning,
  onPause,
  onResume,
  onTimeUp,
  onTick,
  className,
}: TimerProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft)

  useEffect(() => {
    setDisplayTime(timeLeft)
  }, [timeLeft])

  useEffect(() => {
    if (!isRunning || isPaused) return

    const interval = setInterval(() => {
      setDisplayTime((prev) => {
        const newTime = prev - 1
        if (onTick) {
          onTick(newTime)
        }
        if (newTime <= 0) {
          clearInterval(interval)
          setTimeout(() => onTimeUp(), 0)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isPaused, onTimeUp, onTick])

  const minutes = Math.floor(displayTime / 60)
  const seconds = displayTime % 60
  const isLowTime = displayTime <= 10
  const isCritical = displayTime <= 5

  return (
    <div className={cn(
      'flex items-center gap-2 backdrop-blur-md border rounded-lg px-4 py-2 shadow-lg transition-all duration-300',
      isLowTime
        ? 'bg-red-100/60 border-red-300/60 shadow-red-500/20'
        : 'bg-white/40 border-white/50 shadow-purple-500/10',
      isCritical && 'animate-pulse-urgent',
      className
    )}>
      <Clock className={cn('w-5 h-5 text-gray-800 transition-colors', isLowTime && 'text-red-500 animate-pulse')} />
      <div className={cn(
        'text-3xl font-bold font-mono text-gray-800 transition-colors',
        isLowTime && 'text-red-600',
        isCritical && 'text-red-700'
      )}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {isRunning && !isPaused && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPause}
          className="h-8 w-8 backdrop-blur-sm bg-white/30 hover:bg-white/50 border border-white/40 rounded-md"
        >
          <Pause className="h-4 w-4 text-gray-800" />
        </Button>
      )}
      {isPaused && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onResume}
          className="h-8 w-8 backdrop-blur-sm bg-white/30 hover:bg-white/50 border border-white/40 rounded-md"
        >
          <Play className="h-4 w-4 text-gray-800" />
        </Button>
      )}
    </div>
  )
}

