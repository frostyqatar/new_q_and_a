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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Clock className={cn('w-5 h-5', isLowTime && 'text-red-500 animate-pulse')} />
      <div className={cn(
        'text-3xl font-bold font-mono',
        isLowTime && 'text-red-500'
      )}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {isRunning && !isPaused && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPause}
          className="h-8 w-8"
        >
          <Pause className="h-4 w-4" />
        </Button>
      )}
      {isPaused && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onResume}
          className="h-8 w-8"
        >
          <Play className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

