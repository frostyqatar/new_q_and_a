'use client'

import { useState } from 'react'
import { X, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { Question } from '@/lib/types'

interface MediaDisplayProps {
  media: Question['media']
  className?: string
}

export function MediaDisplay({ media, className }: MediaDisplayProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)

  if (!media) return null

  switch (media.type) {
    case 'image':
      return (
        <>
          <div className={`${className} flex justify-center`}>
            <img
              src={media.url}
              alt="Question media"
              className="max-w-md w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-all duration-300 border-2 border-white/30 shadow-lg shadow-purple-500/10 backdrop-blur-sm bg-white/10"
              onClick={() => setImageModalOpen(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
            <DialogContent className="max-w-4xl backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl">
              <img
                src={media.url}
                alt="Question media"
                className="max-w-full h-auto rounded-lg border border-white/30 shadow-lg"
              />
            </DialogContent>
          </Dialog>
        </>
      )

    case 'video':
      return (
        <div className={`${className} flex justify-center`}>
          <video
            src={media.url}
            controls
            className="max-w-md w-full h-auto rounded-lg border-2 border-white/30 shadow-lg shadow-purple-500/10 backdrop-blur-sm bg-white/10"
            onError={(e) => {
              const target = e.target as HTMLVideoElement
              target.style.display = 'none'
            }}
          >
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        </div>
      )

    case 'audio':
      return (
        <div className={className}>
          <audio
            src={media.url}
            controls
            preload="metadata"
            className="w-full rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLAudioElement
              target.style.display = 'none'
            }}
          >
            متصفحك لا يدعم تشغيل الصوت
          </audio>
        </div>
      )

    case 'youtube':
      return (
        <div className={`${className} flex justify-center`}>
          <div className="relative w-full max-w-md backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-lg shadow-lg shadow-purple-500/10 p-1" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${media.url}`}
              className="absolute top-1 left-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )

    default:
      return null
  }
}

