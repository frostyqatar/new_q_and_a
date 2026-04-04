import type { Question } from './types'
import { CATEGORIES, CATEGORIES_EN } from './types'

// ---------------------------------------------------------------------------
// Arabic stop words: question words, prepositions, pronouns, conjunctions,
// common verbs, and generic descriptors that are never good image keywords.
// ---------------------------------------------------------------------------
const ARABIC_STOP_WORDS = new Set([
  // Question words
  'ما', 'ماذا', 'ماهي', 'ماهو', 'من', 'أين', 'اين', 'متى', 'كيف', 'لماذا', 'هل', 'كم', 'أي', 'اي',
  // Pronouns & demonstratives
  'هو', 'هي', 'هم', 'هن', 'أنا', 'أنت', 'أنتم', 'نحن', 'هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء',
  // Articles & prepositions
  'ال', 'في', 'من', 'إلى', 'الى', 'على', 'عن', 'مع', 'بين', 'حتى', 'منذ', 'خلال', 'ضد',
  // Conjunctions & particles
  'و', 'أو', 'ثم', 'لكن', 'بل', 'أن', 'ان', 'إن', 'لا', 'لم', 'لن', 'قد', 'سوف',
  'ليس', 'ليست', 'أم',
  // Common verbs that appear in questions but aren't topics
  'كان', 'كانت', 'كانوا', 'يكون', 'تكون',
  'تم', 'يتم', 'بدأت', 'بدأ', 'بدات',
  'اخترع', 'اخترعت', 'اكتشف', 'اكتشفت', 'اكتشاف',
  'صناعة', 'صنع', 'صنعت', 'انشاء', 'أنشأ', 'أنشئ', 'أنشئت',
  'فتحت', 'فتح', 'سقطت', 'سقط',
  'يوجد', 'توجد', 'يقع', 'تقع',
  'يبلغ', 'تبلغ', 'يساوي', 'تساوي',
  'نستطيع', 'نستطع', 'يستطيع', 'نراه', 'نراها',
  'لديها', 'لديه', 'لديهم',
  // Generic descriptor nouns that appear in questions but aren't the topic
  'اسم', 'الاسم', 'يسمى', 'تسمى', 'يعرف', 'تعرف', 'يعني', 'تعني',
  'أكبر', 'اكبر', 'أصغر', 'اصغر', 'أطول', 'اطول', 'أقصر', 'اقصر',
  'أسرع', 'اسرع', 'أبطأ', 'أعلى', 'اعلى', 'أدنى', 'أول', 'اول', 'آخر',
  'أكثر', 'اكثر', 'أقل', 'اقل',
  'عدد', 'العدد', 'كثير', 'قليل', 'بعض', 'كل', 'جميع',
  'شيء', 'الشيء', 'نوع', 'النوع', 'شكل', 'الشكل',
  'مثل', 'غير', 'بعد', 'قبل', 'فوق', 'تحت', 'داخل', 'خارج',
  'عام', 'العام', 'سنة', 'السنة', 'يوم', 'اليوم', 'تاريخ',
  'الذي', 'التي', 'الذين', 'اللذين', 'اللتين', 'اللواتي',
  'عند', 'حول', 'ضمن', 'لدى', 'وفق',
  'يمكن', 'يجب', 'ينبغي', 'يستطيع',
  'نقطة', 'استقلال', 'محافظة',
  'مصدرة', 'مصدر', 'الاساسي', 'الأساسي',
  'دولة', 'الدولة', 'بلد', 'البلد', 'مدينة', 'المدينة',
  'العنصر', 'الرمز', 'العاصمة',
  'الكيميائي', 'الكيميائية', 'الفيزيائي', 'الفيزيائية',
  'المخترع', 'المكتشف', 'المؤسس', 'الرئيس',
  'الناتج', 'النتيجة', 'الجواب', 'الإجابة',
  'السؤال', 'التالي', 'التالية', 'الآتي', 'الآتية',
  'الصحيح', 'الصحيحة', 'الخاطئ', 'الخاطئة',
  'العالم', 'معنى', 'شبيه',
  'ثروة', 'دخل',
  'الانسان', 'الإنسان',
])

// English stop words for scoring
const ENGLISH_STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
  'not', 'no', 'nor', 'so', 'if', 'then', 'than', 'too', 'very',
  'just', 'about', 'above', 'after', 'again', 'all', 'also', 'any',
  'because', 'before', 'between', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'that', 'these', 'this', 'those', 'through',
  'what', 'which', 'who', 'whom', 'why', 'how', 'where', 'when',
  'here', 'there', 'its', 'it', 'he', 'she', 'they', 'them', 'his', 'her',
  'our', 'your', 'my', 'out', 'up', 'down', 'only', 'own', 'same',
  // Programming words
  'code', 'print', 'return', 'function', 'def', 'var', 'let', 'const',
  'true', 'false', 'output', 'result', 'value', 'following', 'null',
  'python', 'java', 'javascript', 'called', 'name', 'named',
])

// Category -> English keyword fallback
const CATEGORY_KEYWORDS: Record<string, string> = {}
CATEGORIES.forEach((cat, i) => {
  CATEGORY_KEYWORDS[cat] = CATEGORIES_EN[i]?.replace(/&/g, 'and').trim() || ''
})

// ---------------------------------------------------------------------------
// RAKE-inspired keyword scorer for Arabic & English text
// ---------------------------------------------------------------------------

interface ScoredWord {
  word: string
  score: number
}

/**
 * Tokenize Arabic text into words, stripping punctuation.
 */
function tokenizeArabic(text: string): string[] {
  return text
    .replace(/[؟?!.,:;،؛"""''()\[\]{}<>\/\\|@#$%^&*+=~`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Strip the Arabic definite article "ال" prefix for matching purposes.
 */
function stripArticle(word: string): string {
  if (word.startsWith('ال') && word.length > 3) return word.slice(2)
  return word
}

/**
 * Score Arabic words from a question using RAKE-like principles:
 * - Longer words score higher (more specific)
 * - Stop words score 0
 * - Words with Arabic article "ال" get a small boost (likely nouns = topics)
 * - Words near end of question get positional boost
 */
function scoreArabicWords(text: string): ScoredWord[] {
  const tokens = tokenizeArabic(text)
  const totalTokens = tokens.length
  const scored: ScoredWord[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const stripped = stripArticle(token)
    if (ARABIC_STOP_WORDS.has(token) || ARABIC_STOP_WORDS.has(stripped)) continue
    // Allow short tokens if they contain digits or are all-uppercase Latin (model numbers like T2, 5G, AI)
    if (token.length <= 2) {
      const hasDigit = /\d/.test(token)
      const isUpperLatin = /^[A-Z]+$/.test(token)
      if (!hasDigit && !isUpperLatin) continue
    }

    let score = token.length * 2
    if (token.startsWith('ال')) score += 5
    if (token.length >= 4) score += 3
    // Alphanumeric tokens (model numbers, codes) get a boost
    if (/[A-Za-z]/.test(token) && /\d/.test(token)) score += 15

    // Positional boost: words near end of question are more likely the topic
    const positionRatio = (i + 1) / totalTokens
    score += Math.round(positionRatio * 15)

    scored.push({ word: token, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored
}

/**
 * Score English words/phrases.
 */
function scoreEnglishWords(text: string): ScoredWord[] {
  const scored: ScoredWord[] = []

  // Extract capitalized phrases first (likely proper nouns / titles)
  const properNouns = text.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g)
  if (properNouns) {
    for (const phrase of properNouns) {
      if (!ENGLISH_STOP_WORDS.has(phrase.toLowerCase())) {
        scored.push({ word: phrase, score: 80 + phrase.length })
      }
    }
  }

  // Then individual words
  const words = text.match(/[a-zA-Z]{3,}/g)
  if (words) {
    for (const w of words) {
      if (!ENGLISH_STOP_WORDS.has(w.toLowerCase())) {
        scored.push({ word: w, score: 20 + w.length })
      }
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored
}

/**
 * Extract multi-word noun phrases from Arabic text.
 * Consecutive non-stop-words form a phrase (e.g. "الحرب العالمية الأولى").
 * Also captures mixed Arabic-English entities like "الجيتور T2".
 */
function extractNounPhrases(text: string): ScoredWord[] {
  // Tokenize keeping both Arabic and Latin/digit tokens
  const tokens = text
    .replace(/[؟?!.,:;،؛"""''()\[\]{}<>\/\\|@#$%^&*+=~`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const phrases: ScoredWord[] = []
  let currentPhrase: string[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const stripped = stripArticle(token)
    const isStop = ARABIC_STOP_WORDS.has(token) || ARABIC_STOP_WORDS.has(stripped)
    // Short non-alphanumeric tokens break phrases, but model numbers (T2) don't
    const isShortBreaker = token.length <= 2 && !/\d/.test(token) && !/^[A-Z]+$/.test(token)
    const isBreaker = isStop || isShortBreaker

    if (!isBreaker) {
      currentPhrase.push(token)
    } else {
      if (currentPhrase.length >= 2) {
        const phrase = currentPhrase.join(' ')
        const score = 50 + phrase.length * 2 + currentPhrase.length * 10
        phrases.push({ word: phrase, score })
      }
      currentPhrase = []
    }
  }
  // Flush final phrase
  if (currentPhrase.length >= 2) {
    const phrase = currentPhrase.join(' ')
    const score = 50 + phrase.length * 2 + currentPhrase.length * 10
    phrases.push({ word: phrase, score })
  }

  phrases.sort((a, b) => b.score - a.score)
  return phrases
}

/**
 * Extract ranked search queries from a question.
 * Returns a list of search terms to try, best first.
 */
export function extractKeywords(question: Question): string[] {
  const qText = question.question.trim()
  const answer = question.answer.trim()
  const candidates: string[] = []
  const seen = new Set<string>()

  const addCandidate = (term: string) => {
    const key = term.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      candidates.push(term)
    }
  }

  // 1. Multi-word noun phrases (highest priority — captures compound entities)
  const phrases = extractNounPhrases(qText)
  for (const p of phrases.slice(0, 2)) {
    addCandidate(p.word)
  }

  // 2. Top Arabic keywords from the question (RAKE-scored)
  const arabicScored = scoreArabicWords(qText)
  for (const sw of arabicScored.slice(0, 4)) {
    addCandidate(sw.word)
  }

  // 3. English words from the question
  const englishScored = scoreEnglishWords(qText)
  for (const sw of englishScored.slice(0, 2)) {
    addCandidate(sw.word)
  }

  // 4. Answer as fallback (lower priority)
  const answerEnglish = scoreEnglishWords(answer)
  for (const sw of answerEnglish.slice(0, 2)) {
    addCandidate(sw.word)
  }
  // If answer is a short Arabic/English phrase, use it as-is
  if (answer.length > 2 && answer.length < 60) {
    addCandidate(answer)
  }

  // 5. Category fallback
  const catKeyword = CATEGORY_KEYWORDS[question.category]
  if (catKeyword) addCandidate(catKeyword)

  return candidates.length > 0 ? candidates : ['Quiz']
}

/**
 * Extract English-only keywords for services that need English tags (e.g. LoremFlickr).
 */
function extractEnglishKeywords(question: Question): string[] {
  const qText = question.question.trim()
  const answer = question.answer.trim()
  const candidates: string[] = []
  const seen = new Set<string>()

  const addCandidate = (term: string) => {
    const key = term.toLowerCase()
    if (!seen.has(key)) { seen.add(key); candidates.push(term) }
  }

  // English words from question
  const englishScored = scoreEnglishWords(qText)
  for (const sw of englishScored.slice(0, 3)) addCandidate(sw.word)

  // English words from answer
  const answerEnglish = scoreEnglishWords(answer)
  for (const sw of answerEnglish.slice(0, 2)) addCandidate(sw.word)

  // Short English/Latin answer as-is
  if (answer.length > 2 && answer.length < 60 && /[a-zA-Z]/.test(answer)) {
    addCandidate(answer)
  }

  // Category English equivalent
  const catKeyword = CATEGORY_KEYWORDS[question.category]
  if (catKeyword) addCandidate(catKeyword)

  return candidates.length > 0 ? candidates : ['quiz']
}

// ---------------------------------------------------------------------------
// Wikipedia Search API — searches for articles and returns thumbnails.
// Much more robust than requiring exact article titles.
// Uses action=query with generator=search to search + get images in one call.
// ---------------------------------------------------------------------------

interface WikiSearchResult {
  title: string
  thumbnail: string | null
}

/**
 * Search Wikipedia for articles matching a query and return the best
 * thumbnail found. Searches in one API call using generator=search + pageimages.
 */
async function searchWikipediaImages(
  query: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<string | null> {
  const domain = `${lang}.wikipedia.org`
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: '5',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '640',
    format: 'json',
    origin: '*',
  })

  try {
    const res = await fetch(`https://${domain}/w/api.php?${params}`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null

    const data = await res.json()
    const pages = data?.query?.pages
    if (!pages) return null

    // Pages come as an object keyed by page ID. Find the first with a thumbnail.
    // Sort by index (search relevance order) to get the best match.
    const pageList: WikiSearchResult[] = Object.values(pages as Record<string, { title: string; index: number; thumbnail?: { source: string } }>)
      .sort((a, b) => a.index - b.index)
      .map((p) => ({
        title: p.title,
        thumbnail: p.thumbnail?.source || null,
      }))

    // Return the first result that has a thumbnail
    for (const page of pageList) {
      if (page.thumbnail) return page.thumbnail
    }
  } catch {
    // timeout or network error
  }
  return null
}

/**
 * Try to validate an image URL loads correctly in the browser.
 */
function validateImageUrl(url: string, timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image()
    const timer = setTimeout(() => {
      img.src = ''
      resolve(false)
    }, timeoutMs)
    img.onload = () => {
      clearTimeout(timer)
      resolve(img.naturalWidth > 10 && img.naturalHeight > 10)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

// ---------------------------------------------------------------------------
// LoremFlickr — keyword-based stock photos from Flickr
// ---------------------------------------------------------------------------

export type ImageSource = 'wikipedia' | 'loremflickr'

/**
 * Generate a deterministic LoremFlickr URL for a keyword.
 * Uses ?lock= with a hash so the same keyword always returns the same image.
 */
function generateLoremFlickrUrl(keyword: string, questionId: string): string {
  // Simple hash from keyword + questionId for deterministic results
  let hash = 0
  const seed = keyword + questionId
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const encoded = encodeURIComponent(keyword.replace(/\s+/g, ','))
  return `https://loremflickr.com/640/480/${encoded}?lock=${Math.abs(hash)}`
}

// ---------------------------------------------------------------------------
// Main auto-assign function
// ---------------------------------------------------------------------------

export async function autoAssignImages(
  questions: Question[],
  source: ImageSource = 'wikipedia',
  onProgress?: (done: number, total: number) => void
): Promise<Question[]> {
  const needsImage = questions.filter((q) => !q.media)
  if (needsImage.length === 0) return questions

  const updates = new Map<string, Question['media']>()
  let done = 0

  for (const q of needsImage) {
    let found = false

    if (source === 'loremflickr') {
      // LoremFlickr: use English keywords
      const keywords = extractEnglishKeywords(q)
      for (const keyword of keywords.slice(0, 3)) {
        if (found) break
        const url = generateLoremFlickrUrl(keyword, q.id)
        const valid = await validateImageUrl(url)
        if (valid) {
          updates.set(q.id, { type: 'image', url })
          found = true
        }
      }
    } else {
      // Wikipedia: use full keyword extraction (Arabic + English)
      const keywords = extractKeywords(q)
      for (const keyword of keywords.slice(0, 5)) {
        if (found) break

        // Try Arabic Wikipedia search first (understands Arabic natively)
        const hasArabic = /[\u0600-\u06FF]/.test(keyword)
        if (hasArabic) {
          const url = await searchWikipediaImages(keyword, 'ar')
          if (url) {
            const valid = await validateImageUrl(url)
            if (valid) {
              updates.set(q.id, { type: 'image', url })
              found = true
              break
            }
          }
        }

        // Try English Wikipedia search
        const url = await searchWikipediaImages(keyword, 'en')
        if (url) {
          const valid = await validateImageUrl(url)
          if (valid) {
            updates.set(q.id, { type: 'image', url })
            found = true
            break
          }
        }
      }
    }

    done++
    onProgress?.(done, needsImage.length)
  }

  return questions.map((q) => {
    const media = updates.get(q.id)
    if (media) return { ...q, media }
    return q
  })
}
