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
              className="max-w-md w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setImageModalOpen(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
            <DialogContent className="max-w-4xl">
              <img
                src={media.url}
                alt="Question media"
                className="max-w-full h-auto rounded-lg"
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
            className="max-w-md w-full h-auto rounded-lg"
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
            className="w-full"
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
          <div className="relative w-full max-w-md" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${media.url}`}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
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

