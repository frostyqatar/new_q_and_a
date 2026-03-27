'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { storage } from '@/lib/storage'
import { parseQuestions, questionsToText } from '@/lib/questionParser'
import { CATEGORIES, CATEGORIES_EN, type Question } from '@/lib/types'
import { validateDifficultyBalance } from '@/lib/difficultyValidation'
import { Copy, Check, Home, Trash2, Star, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Filter } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [manualInput, setManualInput] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>('10')
  const [copied, setCopied] = useState(false)
  const [chatGPTResult, setChatGPTResult] = useState('')
  const [isEditingAll, setIsEditingAll] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null)

  const difficultyValidation = useMemo(() => validateDifficultyBalance(questions), [questions])
  const filteredQuestions = useMemo(() => {
    if (filterDifficulty === null) return questions
    return questions.filter((q) => (q.difficulty || 3) === filterDifficulty)
  }, [questions, filterDifficulty])

  useEffect(() => {
    const savedQuestions = storage.getQuestions()
    setQuestions(savedQuestions)
    // Initialize manual input with all questions if editing mode
    if (savedQuestions.length > 0 && !isEditingAll) {
      setManualInput('')
    }
  }, [])

  // Auto-update questions when manual input changes in edit mode (debounced)
  useEffect(() => {
    if (!isEditingAll || !manualInput.trim()) return

    const timeoutId = setTimeout(() => {
      const parsedQuestions = parseQuestions(manualInput)
      if (parsedQuestions.length > 0 || manualInput.trim() === '') {
        setQuestions(parsedQuestions)
        storage.saveQuestions(parsedQuestions)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [manualInput, isEditingAll])

  const handleManualAdd = () => {
    if (!manualInput.trim()) return

    if (isEditingAll) {
      // In edit mode, questions are already updated via useEffect
      setIsEditingAll(false)
      setManualInput('')
    } else {
      const newQuestions = parseQuestions(manualInput)
      const updatedQuestions = [...questions, ...newQuestions]
      setQuestions(updatedQuestions)
      storage.saveQuestions(updatedQuestions)
      setManualInput('')
    }
  }

  const handleEditAll = () => {
    setIsEditingAll(true)
    setManualInput(questionsToText(questions))
  }

  const handleCancelEdit = () => {
    setIsEditingAll(false)
    setManualInput('')
  }

  const handleDeleteAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع الأسئلة؟')) {
      setQuestions([])
      storage.saveQuestions([])
      setManualInput('')
      setIsEditingAll(false)
    }
  }

  const handleChatGPTAdd = () => {
    if (!chatGPTResult.trim()) return

    const newQuestions = parseQuestions(chatGPTResult)
    const updatedQuestions = [...questions, ...newQuestions]
    setQuestions(updatedQuestions)
    storage.saveQuestions(updatedQuestions)
    setChatGPTResult('')
  }

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    setQuestions(updatedQuestions)
    storage.saveQuestions(updatedQuestions)
  }

  const handleSetDifficulty = (id: string, difficulty: 1 | 2 | 3 | 4 | 5) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, difficulty } : q
    )
    setQuestions(updatedQuestions)
    storage.saveQuestions(updatedQuestions)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const generateChatGPTPrompt = () => {
    if (selectedCategories.length === 0) return ''
    
    const numQuestions = parseInt(numberOfQuestions) || 10
    const questionsPerCategory = Math.floor(numQuestions / selectedCategories.length)
    const remainder = numQuestions % selectedCategories.length
    const hasProgrammingCategory = selectedCategories.includes('برمجة')
    
    let prompt = 'أريد منك إنشاء أسئلة في الفئات التالية:\n\n'
    
    selectedCategories.forEach((category, index) => {
      const questionsForThisCategory = questionsPerCategory + (index < remainder ? 1 : 0)
      prompt += `- "${category}": ${questionsForThisCategory} أسئلة\n`
    })
    
    prompt += `\nإجمالي الأسئلة المطلوبة: ${numQuestions}\n\n`
    prompt += `**مهم جداً:** يجب استخدام اسم الفئة بالعربية بشكل دقيق كما هو مكتوب أعلاه، ويجب أن ينتهي بعلامة النقطتين (:) بدون استثناء.\n\n`
    
    if (hasProgrammingCategory) {
      prompt += `للأسئلة في فئة "برمجة"، استخدم التنسيق التالي:\n`
      prompt += `برمجة:\n`
      prompt += `السؤال؟\n`
      prompt += `#code#\n`
      prompt += `الكود هنا\n`
      prompt += `#/code#\n`
      prompt += `الجواب (يمكن أن يكون متعدد الأسطر - كل سطر في سطر منفصل)\n\n`
      prompt += `مثال:\n`
      prompt += `برمجة:\n`
      prompt += `What is the python output?\n`
      prompt += `#code#\n`
      prompt += `def function():\n    print('1')\n\n`
      prompt += `#/code#\n`
      prompt += `"1"\n\n`
      prompt += `مثال مع إجابة متعددة الأسطر:\n`
      prompt += `برمجة:\n`
      prompt += `ما الذي ستطبعه الشيفرة التالية؟\n`
      prompt += `#code#\n`
      prompt += `for i in range(3):\n    print("Hello")\n\n`
      prompt += `#/code#\n`
      prompt += `Hello\n`
      prompt += `Hello\n`
      prompt += `Hello\n\n`
      prompt += `ملاحظة: إذا كانت الإجابة متعددة الأسطر، ضع كل سطر في سطر منفصل بدون استخدام علامات خاصة.\n\n`
    }
    
    prompt += `للفئات الأخرى، استخدم التنسيق التالي:\n`
    prompt += `**مهم جداً:**\n`
    prompt += `1. اسم الفئة يجب أن ينتهي بعلامة النقطتين (:)\n`
    prompt += `2. ضع اسم الفئة مرة واحدة فقط، ثم ضع جميع أسئلة تلك الفئة تحتها\n`
    prompt += `3. لا تكرر اسم الفئة قبل كل سؤال - ضع جميع أسئلة الفئة الواحدة متتالية\n`
    prompt += `4. استخدم سطر فارغ بين الفئات المختلفة\n\n`
    prompt += `التنسيق الصحيح:\n`
    prompt += `اسم الفئة بالعربية:\n`
    prompt += `السؤال الأول؟\n`
    prompt += `الجواب الأول\n`
    prompt += `السؤال الثاني؟\n`
    prompt += `الجواب الثاني\n`
    prompt += `السؤال الثالث؟\n`
    prompt += `الجواب الثالث\n\n`
    prompt += `اسم الفئة الثانية:\n`
    prompt += `السؤال الأول؟\n`
    prompt += `الجواب الأول\n\n`
    
    prompt += `مثال كامل:\n`
    prompt += `العلوم والاختراعات:\n`
    prompt += `ما هو العنصر الكيميائي للذهب؟\n`
    prompt += `Au\n`
    prompt += `من هو مخترع المصباح الكهربائي؟\n`
    prompt += `توماس إديسون\n\n`
    prompt += `جغرافيا العالم:\n`
    prompt += `ما هي عاصمة فرنسا؟\n`
    prompt += `باريس\n\n`
    
    prompt += `يرجى إعطائي ${numQuestions} أسئلة موزعة بالتساوي على الفئات المذكورة أعلاه. ضع اسم كل فئة مرة واحدة فقط، ثم ضع جميع أسئلة تلك الفئة تحتها. استخدم سطر فارغ بين الفئات المختلفة.`
    
    return prompt
  }

  const copyPrompt = () => {
    const prompt = generateChatGPTPrompt()
    if (!prompt) return
    
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prompt = generateChatGPTPrompt()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            إدارة الأسئلة
          </h1>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
          >
            <Home className="w-4 h-4 ml-2" />
            الرئيسية
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Input */}
          <Card>
            <CardHeader>
              <CardTitle>إضافة أسئلة يدوياً</CardTitle>
              <CardDescription className="space-y-2">
                <div className="text-sm">
                  الفئة: &rarr; السؤال؟ &rarr; الجواب (كل سطر منفصل)
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  {showInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showInstructions ? 'إخفاء التعليمات' : 'عرض التعليمات والأمثلة'}
                </button>
                {showInstructions && (
                  <div className="text-sm leading-relaxed space-y-2 pt-2 border-t animate-fade-slide-in">
                    <div>
                      • الفئة: (يجب أن تنتهي بعلامة النقطتين : في سطر منفصل)
                    </div>
                    <div>
                      • السؤال؟ (يجب أن ينتهي بعلامة استفهام)
                    </div>
                    <div>
                      • الجواب (في سطر منفصل)
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <strong>لإضافة وسائط:</strong> ضع الرابط بعد الجواب في سطر منفصل.
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div><strong>الصور:</strong> .jpg, .png, .gif, .webp, .svg</div>
                      <div><strong>الفيديو:</strong> .mp4, .webm, .ogg</div>
                      <div><strong>الصوت:</strong> .mp3, .wav, .m4a</div>
                      <div><strong>YouTube:</strong> أي رابط youtube.com/watch أو youtu.be/</div>
                    </div>
                    <div className="text-xs mt-2 pt-2 border-t">
                      <strong>مثال:</strong>
                      <div className="mt-1 font-mono text-xs bg-muted p-2 rounded">
                        <div>العلوم والاختراعات:</div>
                        <div>ما هو العنصر الكيميائي للذهب؟</div>
                        <div>Au</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={isEditingAll 
                  ? "قم بتعديل الأسئلة هنا. سيتم حفظ التغييرات تلقائياً..." 
                  : `مثال:
العلوم والاختراعات:
ما هو العنصر الكيميائي للذهب؟
Au

ما هو أصغر كوكب في المجموعة الشمسية؟
عطارد

مثال مع صورة:
حقائق الحيوانات:
ما اسم هذا الحيوان؟
الأسد
https://example.com/lion.jpg

مثال مع فيديو:
التاريخ:
ما هي عاصمة فرنسا؟
باريس
https://example.com/paris.mp4

مثال مع صوت:
الموسيقى:
ما اسم هذه الأغنية؟
أغنية جميلة
https://example.com/song.mp3

مثال مع YouTube:
العلوم:
ما هو هذا الكوكب؟
المريخ
https://youtube.com/watch?v=abc123`}
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex gap-2">
                {!isEditingAll ? (
                  <>
                    <Button onClick={handleManualAdd} className="flex-1" disabled={!manualInput.trim()}>
                      إضافة الأسئلة
                    </Button>
                    {questions.length > 0 && (
                      <Button onClick={handleEditAll} variant="outline">
                        تعديل الكل
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                      إلغاء التعديل
                    </Button>
                    <Button onClick={handleManualAdd} className="flex-1">
                      حفظ التغييرات
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ChatGPT Integration */}
          <Card>
            <CardHeader>
              <CardTitle>تكامل ChatGPT</CardTitle>
              <CardDescription>
                اختر الفئات وعدد الأسئلة، ثم انسخ المطالبة إلى ChatGPT والصق النتيجة هنا
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">عدد الأسئلة المطلوبة:</label>
                <Input
                  type="number"
                  min="1"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  placeholder="10"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">اختر الفئات (يمكن اختيار أكثر من واحدة):</label>
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer hover:bg-muted/50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {selectedCategories.length} فئة محددة • 
                    {(() => {
                      const numQ = parseInt(numberOfQuestions) || 10
                      const perCategory = Math.floor(numQ / selectedCategories.length)
                      const remainder = numQ % selectedCategories.length
                      return ` ${perCategory} أسئلة لكل فئة${remainder > 0 ? ` + ${remainder} أسئلة إضافية موزعة على أول ${remainder} فئات` : ''}`
                    })()}
                  </div>
                )}
              </div>

              {selectedCategories.length > 0 && prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">المطالبة للنسخ:</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyPrompt}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 ml-2 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 ml-2" />
                      )}
                      {copied ? 'تم النسخ' : 'نسخ'}
                    </Button>
                  </div>
                  <Textarea
                    value={prompt}
                    readOnly
                    className="min-h-[200px] font-mono text-sm bg-muted"
                  />
                </div>
              )}

              <Textarea
                value={chatGPTResult}
                onChange={(e) => setChatGPTResult(e.target.value)}
                placeholder="الصق نتيجة ChatGPT هنا..."
                className="min-h-[150px] font-mono text-sm"
              />
              <Button
                onClick={handleChatGPTAdd}
                disabled={!chatGPTResult.trim()}
                className="w-full"
              >
                إضافة الأسئلة من ChatGPT
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Balance Panel */}
        {questions.length > 0 && (
          <Card className={difficultyValidation.isBalanced
            ? 'border-green-300 bg-green-50/50'
            : 'border-red-300 bg-red-50/50'
          }>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {difficultyValidation.isBalanced ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <CardTitle className={`text-lg ${difficultyValidation.isBalanced ? 'text-green-800' : 'text-red-800'}`}>
                  {difficultyValidation.isBalanced
                    ? 'توزيع الصعوبة متوازن - جاهز للعب!'
                    : 'توزيع الصعوبة غير متوازن - لا يمكن بدء اللعبة'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {difficultyValidation.breakdown.map((b) => (
                    <div
                      key={b.level}
                      onClick={() => b.count > 0 && setFilterDifficulty(filterDifficulty === b.level ? null : b.level)}
                      className={`text-center p-2 rounded-lg border transition-all ${
                        b.count === 0
                          ? 'bg-gray-50 border-gray-200'
                          : b.isEven
                            ? 'bg-green-50 border-green-300 cursor-pointer hover:shadow-md'
                            : 'bg-red-50 border-red-300 cursor-pointer hover:shadow-md'
                      } ${filterDifficulty === b.level ? 'ring-2 ring-yellow-400 shadow-md' : ''}`}
                    >
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[...Array(b.level)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className={`text-2xl font-bold ${
                        b.count === 0
                          ? 'text-gray-400'
                          : b.isEven
                            ? 'text-green-700'
                            : 'text-red-700'
                      }`}>
                        {b.count}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {b.count > 0 && b.isEven && `${b.count / 2} لكل فريق`}
                        {b.count > 0 && !b.isEven && 'عدد فردي!'}
                      </div>
                    </div>
                  ))}
                </div>

                {!difficultyValidation.isEvenTotal && (
                  <div className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2">
                    إجمالي الأسئلة ({difficultyValidation.totalQuestions}) عدد فردي. يجب أن يكون زوجياً للتوزيع المتساوي.
                  </div>
                )}

                {difficultyValidation.unbalancedLevels.length > 0 && (
                  <div className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2">
                    المستويات التالية تحتوي على عدد فردي من الأسئلة:{' '}
                    {difficultyValidation.unbalancedLevels.map((l) => `${l}`).join('، ')}
                    {' '}- أضف أو احذف سؤالاً في كل مستوى ليصبح العدد زوجياً.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  الأسئلة ({questions.length})
                  {filterDifficulty !== null && (
                    <span className="text-sm font-normal text-muted-foreground mr-2">
                      (عرض {filteredQuestions.length})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {(() => {
                    const cats = new Set(questions.map(q => q.category))
                    return `${cats.size} فئات`
                  })()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {questions.length > 0 && (
                  <Button
                    onClick={handleDeleteAll}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف الكل
                  </Button>
                )}
              </div>
            </div>
            {/* Difficulty filter bar */}
            {questions.length > 0 && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setFilterDifficulty(null)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filterDifficulty === null
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  الكل
                </button>
                {[1, 2, 3, 4, 5].map((level) => {
                  const count = questions.filter(q => (q.difficulty || 3) === level).length
                  if (count === 0) return null
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFilterDifficulty(filterDifficulty === level ? null : level)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1 ${
                        filterDifficulty === level
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {[...Array(level)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                      ))}
                      <span>({count})</span>
                    </button>
                  )
                })}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد أسئلة بعد. أضف بعض الأسئلة للبدء.
              </p>
            ) : filteredQuestions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد أسئلة بهذه الصعوبة.
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="secondary">{question.category}</Badge>
                          <div className="flex items-center gap-0.5" title="الصعوبة">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => handleSetDifficulty(question.id, level as 1 | 2 | 3 | 4 | 5)}
                                className="p-0 hover:scale-125 transition-transform"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    level <= (question.difficulty || 3)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs text-muted-foreground mr-1">
                              ({question.difficulty || 3}/5)
                            </span>
                          </div>
                        </div>
                        <p className="font-semibold text-lg mb-2">
                          {question.question}
                        </p>
                        <p className="text-muted-foreground">
                          {question.answer}
                        </p>
                        {question.media && (
                          <div className="mt-2 text-sm text-blue-600">
                            📎 {question.media.type}: {question.media.url.substring(0, 50)}...
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

