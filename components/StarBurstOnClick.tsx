'use client'

import { useCallback, useRef, useState, type CSSProperties, type ReactNode, type MouseEvent } from 'react'
import { Star } from 'lucide-react'

type Burst = { id: number; x: number; y: number }

export function StarBurstOnClick({ children }: { children: ReactNode }) {
  const [bursts, setBursts] = useState<Burst[]>([])
  const idRef = useRef(0)

  const handleClickCapture = useCallback((e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('button')
    if (!btn || !(btn instanceof HTMLButtonElement) || btn.disabled) return

    const id = ++idRef.current
    setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }])
    globalThis.setTimeout(() => {
      setBursts((b) => b.filter((x) => x.id !== id))
    }, 650)
  }, [])

  return (
    <>
      <div className="relative" onClickCapture={handleClickCapture}>
        {children}
      </div>
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="pointer-events-none fixed z-[200]"
          style={{
            left: burst.x,
            top: burst.y,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden
        >
          <div className="relative h-0 w-0">
            {Array.from({ length: 8 }, (_, i) => (
              <Star
                key={i}
                className="star-burst-particle text-amber-400 fill-amber-300"
                size={10}
                style={
                  {
                    '--angle': `${i * 45}deg`,
                    animationDelay: `${i * 28}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
