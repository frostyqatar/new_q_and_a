'use client'

import { useState } from 'react'
import { X, ImageOff } from 'lucide-react'

interface ImagePreviewProps {
  url: string
  type: string
  onRemove: () => void
}

export function ImagePreview({ url, type, onRemove }: ImagePreviewProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (type === 'youtube') {
    return (
      <div className="mt-2 relative group inline-block">
        <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <img
            src={`https://img.youtube.com/vi/${url}/mqdefault.jpg`}
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  if (type === 'audio') {
    return (
      <div className="mt-2 relative group inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {url.split('/').pop()?.substring(0, 30) || 'audio'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className="mt-2 relative group inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {url.split('/').pop()?.substring(0, 30) || 'video'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  // Image type
  if (error) {
    return (
      <div className="mt-2 relative group inline-block">
        <div className="w-40 h-24 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center">
          <ImageOff className="w-6 h-6 text-red-300" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="mt-2 relative group inline-block">
      {!loaded && (
        <div className="w-40 h-24 rounded-lg border border-gray-200 bg-gray-100 animate-pulse" />
      )}
      <img
        src={url}
        alt="Question media"
        className={`w-40 h-24 rounded-lg object-cover border border-gray-200 shadow-sm transition-opacity ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true)
          setLoaded(true)
        }}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
