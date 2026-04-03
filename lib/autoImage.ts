import type { Question } from './types'
import { CATEGORIES, CATEGORIES_EN } from './types'

/**
 * Map of Arabic category names to English keywords for image search.
 */
const CATEGORY_KEYWORDS: Record<string, string> = {}
CATEGORIES.forEach((cat, i) => {
  CATEGORY_KEYWORDS[cat] = CATEGORIES_EN[i]
    ?.replace(/&/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')[0]
    .toLowerCase() || 'trivia'
})

/**
 * Common Arabic-to-English keyword mappings for quiz topics.
 */
const ARABIC_TO_ENGLISH: Record<string, string> = {
  'الذهب': 'gold', 'الفضة': 'silver', 'الماء': 'water', 'النار': 'fire',
  'الشمس': 'sun', 'القمر': 'moon', 'الأرض': 'earth', 'المريخ': 'mars',
  'المشتري': 'jupiter', 'زحل': 'saturn', 'فرنسا': 'france', 'باريس': 'paris',
  'لندن': 'london', 'طوكيو': 'tokyo', 'قطر': 'qatar', 'الدوحة': 'doha',
  'مصر': 'egypt', 'القاهرة': 'cairo', 'السعودية': 'saudi arabia',
  'الرياض': 'riyadh', 'دبي': 'dubai', 'الأسد': 'lion', 'النمر': 'tiger',
  'الفيل': 'elephant', 'الحوت': 'whale', 'الدلفين': 'dolphin',
  'النسر': 'eagle', 'القط': 'cat', 'الكلب': 'dog', 'الحصان': 'horse',
  'البحر': 'ocean', 'الجبل': 'mountain', 'الصحراء': 'desert',
  'الغابة': 'forest', 'النهر': 'river', 'البركان': 'volcano',
  'القلب': 'heart', 'الدماغ': 'brain', 'العين': 'eye',
  'كرة القدم': 'football', 'كرة السلة': 'basketball',
  'التنس': 'tennis', 'السباحة': 'swimming',
  'أينشتاين': 'einstein', 'نيوتن': 'newton', 'إديسون': 'edison',
  'آيفون': 'iphone', 'سامسونج': 'samsung', 'أبل': 'apple',
  'جوجل': 'google', 'مايكروسوفت': 'microsoft',
  'بيتزا': 'pizza', 'سوشي': 'sushi', 'شوكولاتة': 'chocolate',
  'قهوة': 'coffee', 'شاي': 'tea',
}

/**
 * Extract the best English keyword from a question + answer for image search.
 * Priority: answer content > question content > category fallback.
 */
export function extractKeyword(question: Question): string {
  const answer = question.answer.trim()
  const qText = question.question.trim()

  // 1. Check if answer itself is a recognizable English word/phrase (many quiz answers are)
  const englishWord = answer.match(/^[a-zA-Z][a-zA-Z0-9\s\-']{1,30}$/)
  if (englishWord) {
    return answer.toLowerCase().replace(/\s+/g, ',')
  }

  // 2. Look for English words embedded in the question or answer
  const allText = `${qText} ${answer}`
  const englishWords = allText.match(/[a-zA-Z]{3,}/g)
  if (englishWords && englishWords.length > 0) {
    // Filter out common non-keyword words
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'what', 'which', 'who', 'how', 'why', 'from', 'this', 'that', 'with', 'code', 'print', 'def', 'return', 'function', 'var', 'let', 'const', 'true', 'false'])
    const filtered = englishWords.filter(w => !stopWords.has(w.toLowerCase()) && w.length > 2)
    if (filtered.length > 0) {
      return filtered[0].toLowerCase()
    }
  }

  // 3. Check Arabic-to-English mappings in answer first, then question
  for (const [arabic, english] of Object.entries(ARABIC_TO_ENGLISH)) {
    if (answer.includes(arabic) || qText.includes(arabic)) {
      return english
    }
  }

  // 4. Fallback: use category keyword
  return CATEGORY_KEYWORDS[question.category] || 'trivia'
}

/**
 * Generate the LoremFlickr image URL for a keyword.
 * Uses a lock parameter based on the keyword hash for consistent images.
 */
export function buildImageUrl(keyword: string): string {
  // Simple hash for consistent image per keyword
  let hash = 0
  for (let i = 0; i < keyword.length; i++) {
    hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0
  }
  const lock = Math.abs(hash) % 10000
  return `https://loremflickr.com/640/480/${encodeURIComponent(keyword)}?lock=${lock}`
}

/**
 * Build a fallback image URL using the category keyword.
 */
export function buildFallbackUrl(question: Question): string {
  const catKeyword = CATEGORY_KEYWORDS[question.category] || 'trivia'
  let hash = 0
  const key = `${catKeyword}-fallback`
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  const lock = Math.abs(hash) % 10000
  return `https://loremflickr.com/640/480/${encodeURIComponent(catKeyword)}?lock=${lock}`
}

/**
 * Validate that an image URL actually loads.
 * Returns true if the image loads within the timeout.
 */
export function validateImageUrl(url: string, timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => {
      img.src = ''
      resolve(false)
    }, timeoutMs)

    img.onload = () => {
      clearTimeout(timer)
      // LoremFlickr returns a 1x1 pixel for bad keywords sometimes
      resolve(img.naturalWidth > 10 && img.naturalHeight > 10)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

/**
 * Auto-assign images to questions that don't have media.
 * Validates each image and tries a fallback if the primary fails.
 * Returns updated questions array.
 */
export async function autoAssignImages(
  questions: Question[],
  onProgress?: (done: number, total: number) => void
): Promise<Question[]> {
  const needsImage = questions.filter((q) => !q.media)
  if (needsImage.length === 0) return questions

  const updates = new Map<string, Question['media']>()
  let done = 0

  for (const q of needsImage) {
    const keyword = extractKeyword(q)
    const primaryUrl = buildImageUrl(keyword)

    const primaryOk = await validateImageUrl(primaryUrl)
    if (primaryOk) {
      updates.set(q.id, { type: 'image', url: primaryUrl })
    } else {
      // Try fallback (category-based)
      const fallbackUrl = buildFallbackUrl(q)
      const fallbackOk = await validateImageUrl(fallbackUrl)
      if (fallbackOk) {
        updates.set(q.id, { type: 'image', url: fallbackUrl })
      }
      // If both fail, skip — no image assigned
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
