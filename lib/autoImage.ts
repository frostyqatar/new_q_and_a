import type { Question } from './types'
import { CATEGORIES, CATEGORIES_EN } from './types'

/**
 * Map of Arabic category names to English keywords for Wikipedia lookup.
 */
const CATEGORY_KEYWORDS: Record<string, string> = {}
CATEGORIES.forEach((cat, i) => {
  CATEGORY_KEYWORDS[cat] = CATEGORIES_EN[i]
    ?.replace(/&/g, 'and')
    .trim() || 'trivia'
})

/**
 * Common Arabic-to-English keyword mappings for quiz topics.
 * Keys are checked with `includes()` so partial matches work.
 */
const ARABIC_TO_ENGLISH: [string, string][] = [
  // Elements & Materials
  ['الذهب', 'Gold'], ['الفضة', 'Silver'], ['الحديد', 'Iron'], ['النحاس', 'Copper'],
  ['الماس', 'Diamond'], ['الماء', 'Water'], ['النار', 'Fire'], ['الهيدروجين', 'Hydrogen'],
  ['الأكسجين', 'Oxygen'],
  // Space
  ['الشمس', 'Sun'], ['القمر', 'Moon'], ['الأرض', 'Earth'], ['المريخ', 'Mars'],
  ['المشتري', 'Jupiter'], ['زحل', 'Saturn'], ['عطارد', 'Mercury_(planet)'],
  ['الزهرة', 'Venus'], ['نبتون', 'Neptune'], ['بلوتو', 'Pluto'],
  ['الثقب الأسود', 'Black_hole'], ['المجرة', 'Galaxy'],
  // Countries & Cities
  ['فرنسا', 'France'], ['باريس', 'Paris'], ['لندن', 'London'], ['طوكيو', 'Tokyo'],
  ['قطر', 'Qatar'], ['الدوحة', 'Doha'], ['مصر', 'Egypt'], ['القاهرة', 'Cairo'],
  ['السعودية', 'Saudi_Arabia'], ['الرياض', 'Riyadh'], ['دبي', 'Dubai'],
  ['أمريكا', 'United_States'], ['الصين', 'China'], ['اليابان', 'Japan'],
  ['ألمانيا', 'Germany'], ['إيطاليا', 'Italy'], ['إسبانيا', 'Spain'],
  ['البرازيل', 'Brazil'], ['الهند', 'India'], ['روسيا', 'Russia'],
  ['تركيا', 'Turkey'], ['المغرب', 'Morocco'], ['تونس', 'Tunisia'],
  ['الكويت', 'Kuwait'], ['البحرين', 'Bahrain'], ['عمان', 'Oman'],
  // Animals
  ['الأسد', 'Lion'], ['النمر', 'Tiger'], ['الفيل', 'Elephant'],
  ['الحوت', 'Whale'], ['الدلفين', 'Dolphin'], ['النسر', 'Eagle'],
  ['القط', 'Cat'], ['الكلب', 'Dog'], ['الحصان', 'Horse'],
  ['الزرافة', 'Giraffe'], ['الباندا', 'Giant_panda'], ['الذئب', 'Wolf'],
  ['الثعبان', 'Snake'], ['التمساح', 'Crocodile'], ['القرش', 'Shark'],
  ['النحل', 'Honey_bee'], ['الفراشة', 'Butterfly'], ['البطريق', 'Penguin'],
  // Nature
  ['البحر', 'Ocean'], ['الجبل', 'Mountain'], ['الصحراء', 'Desert'],
  ['الغابة', 'Forest'], ['النهر', 'River'], ['البركان', 'Volcano'],
  ['الشلال', 'Waterfall'], ['الجزيرة', 'Island'],
  // Body
  ['القلب', 'Heart'], ['الدماغ', 'Human_brain'], ['العين', 'Human_eye'],
  ['الرئة', 'Lung'], ['الكبد', 'Liver'], ['الكلية', 'Kidney'],
  // Sports
  ['كرة القدم', 'Association_football'], ['كرة السلة', 'Basketball'],
  ['التنس', 'Tennis'], ['السباحة', 'Swimming_(sport)'],
  ['ميسي', 'Lionel_Messi'], ['رونالدو', 'Cristiano_Ronaldo'],
  // People
  ['أينشتاين', 'Albert_Einstein'], ['نيوتن', 'Isaac_Newton'],
  ['إديسون', 'Thomas_Edison'], ['دافنشي', 'Leonardo_da_Vinci'],
  ['شكسبير', 'William_Shakespeare'], ['نابليون', 'Napoleon'],
  // Tech & Brands
  ['آيفون', 'IPhone'], ['سامسونج', 'Samsung'], ['أبل', 'Apple_Inc.'],
  ['جوجل', 'Google'], ['مايكروسوفت', 'Microsoft'],
  ['تسلا', 'Tesla,_Inc.'], ['أمازون', 'Amazon_(company)'],
  ['نينتندو', 'Nintendo'], ['سوني', 'Sony'], ['بلايستيشن', 'PlayStation'],
  // Food
  ['بيتزا', 'Pizza'], ['سوشي', 'Sushi'], ['شوكولاتة', 'Chocolate'],
  ['قهوة', 'Coffee'], ['شاي', 'Tea'], ['أرز', 'Rice'], ['خبز', 'Bread'],
  // Landmarks
  ['الأهرامات', 'Great_Pyramid_of_Giza'], ['برج إيفل', 'Eiffel_Tower'],
  ['سور الصين', 'Great_Wall_of_China'], ['تاج محل', 'Taj_Mahal'],
]

/**
 * Extract the best search terms from a question for Wikipedia lookup.
 * Returns an array of candidates to try in order.
 */
export function extractKeywords(question: Question): string[] {
  const answer = question.answer.trim()
  const qText = question.question.trim()
  const candidates: string[] = []

  // 1. If answer is English text, use it directly as Wikipedia article title
  if (/^[a-zA-Z][a-zA-Z0-9\s\-'.()]{1,50}$/.test(answer)) {
    // Clean up and use as article title (capitalize first letter)
    const cleaned = answer.replace(/\s+/g, '_')
    candidates.push(cleaned)
  }

  // 2. Check Arabic-to-English mappings — answer first, then question
  for (const [arabic, english] of ARABIC_TO_ENGLISH) {
    if (answer.includes(arabic)) {
      candidates.push(english)
    }
  }
  for (const [arabic, english] of ARABIC_TO_ENGLISH) {
    if (qText.includes(arabic) && !candidates.includes(english)) {
      candidates.push(english)
    }
  }

  // 3. Look for English words in question/answer that could be article titles
  const allText = `${qText} ${answer}`
  const englishPhrases = allText.match(/[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})*/g)
  if (englishPhrases) {
    for (const phrase of englishPhrases) {
      const asTitle = phrase.replace(/\s+/g, '_')
      if (!candidates.includes(asTitle)) {
        candidates.push(asTitle)
      }
    }
  }
  const englishWords = allText.match(/[a-zA-Z]{4,}/g)
  if (englishWords) {
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'what', 'which', 'who', 'how', 'why', 'from', 'this', 'that', 'with', 'code', 'print', 'return', 'function', 'true', 'false', 'output', 'result', 'value', 'following', 'python', 'java', 'javascript'])
    for (const w of englishWords) {
      if (!stopWords.has(w.toLowerCase()) && !candidates.includes(w)) {
        candidates.push(w)
      }
    }
  }

  // 4. Category fallback
  const catKeyword = CATEGORY_KEYWORDS[question.category]
  if (catKeyword && catKeyword !== 'trivia') {
    candidates.push(catKeyword.replace(/\s+/g, '_'))
  }

  return candidates.length > 0 ? candidates : ['Quiz']
}

/**
 * Fetch a Wikipedia thumbnail URL for a given article title.
 * Tries English Wikipedia first, then Arabic Wikipedia.
 * Returns the thumbnail URL or null if not found.
 */
async function fetchWikipediaThumbnail(title: string): Promise<string | null> {
  // Try English Wikipedia
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      if (data.thumbnail?.source) {
        // Upscale: replace width in the thumbnail URL for a bigger image
        return data.thumbnail.source.replace(/\/\d+px-/, '/640px-')
      }
      if (data.originalimage?.source) {
        return data.originalimage.source
      }
    }
  } catch {
    // Network error or timeout — continue to next attempt
  }

  return null
}

/**
 * Try Arabic Wikipedia as a last resort using the raw Arabic answer text.
 */
async function fetchArabicWikipediaThumbnail(arabicTitle: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(arabicTitle)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      if (data.thumbnail?.source) {
        return data.thumbnail.source.replace(/\/\d+px-/, '/640px-')
      }
      if (data.originalimage?.source) {
        return data.originalimage.source
      }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Validate that an image URL actually loads.
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

/**
 * Auto-assign images to questions that don't have media.
 * Uses Wikipedia article thumbnails for relevant, accurate images.
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
    const keywords = extractKeywords(q)
    let found = false

    // Try each keyword candidate until one works
    for (const keyword of keywords.slice(0, 4)) {
      const url = await fetchWikipediaThumbnail(keyword)
      if (url) {
        const valid = await validateImageUrl(url)
        if (valid) {
          updates.set(q.id, { type: 'image', url })
          found = true
          break
        }
      }
    }

    // Last resort: try Arabic Wikipedia with the raw answer
    if (!found) {
      const arabicAnswer = q.answer.trim()
      if (arabicAnswer && !/^[a-zA-Z]/.test(arabicAnswer)) {
        const url = await fetchArabicWikipediaThumbnail(arabicAnswer)
        if (url) {
          const valid = await validateImageUrl(url)
          if (valid) {
            updates.set(q.id, { type: 'image', url })
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
