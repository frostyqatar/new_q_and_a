'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MediaDisplay } from '@/components/MediaDisplay'
import { CodeDisplay } from '@/components/CodeDisplay'
import type { Question } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

interface AnswerRevealScreenProps {
  question: Question
  onNext: () => void
}

export function AnswerRevealScreen({
  question,
  onNext,
}: AnswerRevealScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {question.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-3xl font-bold text-center min-h-[100px] flex items-center justify-center">
            {question.question}
          </div>

          {question.code && (
            <div className="mt-6 flex justify-center">
              <CodeDisplay code={question.code} />
            </div>
          )}

          {question.media && (
            <div className="mt-6">
              <MediaDisplay media={question.media} />
            </div>
          )}

          <div className="border-t pt-6">
            <div className="text-center space-y-4">
              <div className="text-xl text-muted-foreground mb-2">
                الإجابة الصحيحة:
              </div>
              <div className="text-4xl font-bold text-green-600 bg-green-50 p-6 rounded-lg whitespace-pre-line">
                {question.answer}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onNext}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
            >
              السؤال التالي
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

