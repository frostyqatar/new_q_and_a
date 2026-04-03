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
  'العالم', 'حياة', 'معنى', 'شبيه',
  'حرب', 'شركة', 'ثروة', 'دخل',
  'جسم', 'الانسان', 'الإنسان',
  'افريقيا', 'أفريقيا', 'اوروبا', 'أوروبا', 'آسيا', 'امريكية', 'أمريكية', 'لاتينية',
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

// ---------------------------------------------------------------------------
// Arabic-to-English Wikipedia article title mappings.
// These are known entities that map cleanly to Wikipedia articles.
// ---------------------------------------------------------------------------
const ARABIC_TO_WIKI: [string, string][] = [
  // Elements & Materials
  ['الذهب', 'Gold'], ['الفضة', 'Silver'], ['الحديد', 'Iron'], ['النحاس', 'Copper'],
  ['الماس', 'Diamond'], ['الماء', 'Water'], ['الهيدروجين', 'Hydrogen'],
  ['الأكسجين', 'Oxygen'], ['الكربون', 'Carbon'],
  // Space
  ['الشمس', 'Sun'], ['القمر', 'Moon'], ['الأرض', 'Earth'], ['المريخ', 'Mars'],
  ['المشتري', 'Jupiter'], ['زحل', 'Saturn'], ['عطارد', 'Mercury_(planet)'],
  ['الزهرة', 'Venus'], ['نبتون', 'Neptune'], ['بلوتو', 'Pluto'],
  ['الثقب الأسود', 'Black_hole'], ['المجرة', 'Galaxy'], ['النجم', 'Star'],
  // Countries & Cities
  ['فرنسا', 'France'], ['باريس', 'Paris'], ['لندن', 'London'], ['طوكيو', 'Tokyo'],
  ['قطر', 'Qatar'], ['الدوحة', 'Doha'], ['مصر', 'Egypt'], ['القاهرة', 'Cairo'],
  ['السعودية', 'Saudi_Arabia'], ['الرياض', 'Riyadh'], ['دبي', 'Dubai'],
  ['أمريكا', 'United_States'], ['الصين', 'China'], ['اليابان', 'Japan'],
  ['ألمانيا', 'Germany'], ['إيطاليا', 'Italy'], ['إسبانيا', 'Spain'],
  ['البرازيل', 'Brazil'], ['الهند', 'India'], ['روسيا', 'Russia'],
  ['تركيا', 'Turkey'], ['المغرب', 'Morocco'], ['تونس', 'Tunisia'],
  ['الكويت', 'Kuwait'], ['البحرين', 'Bahrain'], ['عمان', 'Oman'],
  ['العراق', 'Iraq'], ['سوريا', 'Syria'], ['لبنان', 'Lebanon'],
  ['فلسطين', 'Palestine'], ['الأردن', 'Jordan'], ['اليمن', 'Yemen'],
  ['ليبيا', 'Libya'], ['السودان', 'Sudan'], ['الجزائر', 'Algeria'],
  ['بريطانيا', 'United_Kingdom'], ['كندا', 'Canada'], ['أستراليا', 'Australia'],
  ['المكسيك', 'Mexico'], ['الأرجنتين', 'Argentina'],
  // Animals
  ['الأسد', 'Lion'], ['النمر', 'Tiger'], ['الفيل', 'Elephant'],
  ['الحوت', 'Whale'], ['الدلفين', 'Dolphin'], ['النسر', 'Eagle'],
  ['القط', 'Cat'], ['الكلب', 'Dog'], ['الحصان', 'Horse'],
  ['الزرافة', 'Giraffe'], ['الباندا', 'Giant_panda'], ['الذئب', 'Wolf'],
  ['الثعبان', 'Snake'], ['التمساح', 'Crocodile'], ['القرش', 'Shark'],
  ['النحل', 'Honey_bee'], ['الفراشة', 'Butterfly'], ['البطريق', 'Penguin'],
  ['الجمل', 'Camel'], ['الدب', 'Bear'], ['القرد', 'Monkey'],
  ['الأخطبوط', 'Octopus'], ['السلحفاة', 'Turtle'], ['الصقر', 'Falcon'],
  // Nature
  ['البحر', 'Ocean'], ['المحيط', 'Ocean'], ['الجبل', 'Mountain'],
  ['الصحراء', 'Desert'], ['الغابة', 'Forest'], ['النهر', 'River'],
  ['البركان', 'Volcano'], ['الشلال', 'Waterfall'], ['الجزيرة', 'Island'],
  // Body
  ['القلب', 'Heart'], ['الدماغ', 'Human_brain'], ['العين', 'Human_eye'],
  ['الرئة', 'Lung'], ['الكبد', 'Liver'], ['الكلية', 'Kidney'],
  ['العظم', 'Bone'], ['الدم', 'Blood'],
  // Sports
  ['كرة القدم', 'Association_football'], ['كرة السلة', 'Basketball'],
  ['التنس', 'Tennis'], ['السباحة', 'Swimming_(sport)'],
  ['ميسي', 'Lionel_Messi'], ['رونالدو', 'Cristiano_Ronaldo'],
  ['نيمار', 'Neymar'], ['محمد صلاح', 'Mohamed_Salah'],
  // People
  ['أينشتاين', 'Albert_Einstein'], ['نيوتن', 'Isaac_Newton'],
  ['إديسون', 'Thomas_Edison'], ['دافنشي', 'Leonardo_da_Vinci'],
  ['شكسبير', 'William_Shakespeare'], ['نابليون', 'Napoleon'],
  ['غاندي', 'Mahatma_Gandhi'], ['ماندلا', 'Nelson_Mandela'],
  // Tech & Brands
  ['آيفون', 'IPhone'], ['سامسونج', 'Samsung'], ['أبل', 'Apple_Inc.'],
  ['جوجل', 'Google'], ['مايكروسوفت', 'Microsoft'],
  ['تسلا', 'Tesla,_Inc.'], ['أمازون', 'Amazon_(company)'],
  ['نينتندو', 'Nintendo'], ['سوني', 'Sony'], ['بلايستيشن', 'PlayStation'],
  ['تويتر', 'Twitter'], ['فيسبوك', 'Facebook'], ['إنستغرام', 'Instagram'],
  // Cars
  ['تويوتا', 'Toyota'], ['مرسيدس', 'Mercedes-Benz'], ['بي إم دبليو', 'BMW'],
  ['فيراري', 'Ferrari'], ['لامبورغيني', 'Lamborghini'], ['بورش', 'Porsche'],
  ['رولز رويس', 'Rolls-Royce'], ['بنتلي', 'Bentley'],
  // Fashion & Luxury
  ['غوتشي', 'Gucci'], ['لويس فيتون', 'Louis_Vuitton'], ['شانيل', 'Chanel'],
  ['رولكس', 'Rolex'], ['أوميغا', 'Omega_SA'],
  // Food & Drink
  ['بيتزا', 'Pizza'], ['سوشي', 'Sushi'], ['شوكولاتة', 'Chocolate'],
  ['قهوة', 'Coffee'], ['القهوة', 'Coffee'], ['القهوة العربية', 'Arabic_coffee'],
  ['شاي', 'Tea'], ['الشاي', 'Tea'], ['أرز', 'Rice'], ['خبز', 'Bread'],
  ['الشاورما', 'Shawarma'], ['شاورما', 'Shawarma'],
  ['الحمص', 'Hummus'], ['حمص', 'Hummus'],
  ['البطاطس المقلية', 'French_fries'], ['البطاطس', 'Potato'],
  ['الآيس كريم', 'Ice_cream'], ['الكبسة', 'Kabsa'],
  // History & Events
  ['الحرب العالمية الثانية', 'World_War_II'], ['الحرب العالمية الأولى', 'World_War_I'],
  ['الدولة العثمانية', 'Ottoman_Empire'], ['العثمانية', 'Ottoman_Empire'],
  ['الثورة الفرنسية', 'French_Revolution'],
  ['الثورة الإيرانية', 'Iranian_Revolution'],
  ['السرطان', 'Cancer'],
  // Materials & Objects
  ['الزجاج', 'Glass'], ['زجاج', 'Glass'],
  ['الاسمنت', 'Cement'], ['اسمنت', 'Cement'], ['الإسمنت', 'Cement'],
  ['السجاد', 'Carpet'], ['سجاد', 'Carpet'],
  ['الحديد', 'Iron'],
  // Concepts & Places
  ['جامعة', 'University'], ['الجامعة', 'University'],
  ['القرويين', 'University_of_al-Qarawiyyin'],
  ['مضيق', 'Strait'], ['المضيق', 'Strait'],
  ['بركان', 'Volcano'], ['البركان', 'Volcano'],
  ['ماونا لوا', 'Mauna_Loa'], ['هاواي', 'Hawaii'],
  ['النجم', 'Star'], ['نجم', 'Star'],
  ['الكوكب', 'Planet'], ['كوكب', 'Planet'],
  ['العضلة', 'Muscle'], ['عضلة', 'Muscle'],
  ['الفاتيكان', 'Vatican_City'], ['بلجيكا', 'Belgium'],
  ['نيجيريا', 'Nigeria'], ['سورينام', 'Suriname'],
  ['موزمبيق', 'Mozambique'],
  ['الرافدين', 'Mesopotamia'],
  ['قوقل', 'Google'], ['القرويين', 'University_of_al-Qarawiyyin'],
  // Landmarks
  ['الأهرامات', 'Great_Pyramid_of_Giza'], ['برج إيفل', 'Eiffel_Tower'],
  ['سور الصين', 'Great_Wall_of_China'], ['تاج محل', 'Taj_Mahal'],
  ['برج خليفة', 'Burj_Khalifa'], ['تمثال الحرية', 'Statue_of_Liberty'],
  ['قناة السويس', 'Suez_Canal'],
]

// Build a fast lookup map from the array
const ARABIC_WIKI_MAP = new Map<string, string>()
for (const [ar, en] of ARABIC_TO_WIKI) {
  ARABIC_WIKI_MAP.set(ar, en)
}

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
  wikiTitle?: string // Pre-resolved Wikipedia title if known
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
 * Strip the Arabic definite article "ال" prefix for matching purposes,
 * but keep the original for wiki lookup.
 */
function stripArticle(word: string): string {
  if (word.startsWith('ال') && word.length > 3) return word.slice(2)
  return word
}

/**
 * Score Arabic words from a question using RAKE-like principles:
 * - Known entities (in our dictionary) get highest score
 * - Longer words score higher (more specific)
 * - Stop words score 0
 * - Words with Arabic article "ال" get a small boost (likely nouns = topics)
 */
function scoreArabicWords(text: string): ScoredWord[] {
  const tokens = tokenizeArabic(text)
  const totalTokens = tokens.length
  const scored: ScoredWord[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    // Check stop words (with and without article)
    const stripped = stripArticle(token)
    if (ARABIC_STOP_WORDS.has(token) || ARABIC_STOP_WORDS.has(stripped)) {
      continue
    }
    // Skip very short words (1-2 chars) — usually particles
    if (token.length <= 2) continue

    let score = 0
    let wikiTitle: string | undefined

    // Check known entity dictionary — highest priority
    for (const [arabic, wiki] of ARABIC_TO_WIKI) {
      if (text.includes(arabic)) {
        if (token === arabic || arabic.includes(token)) {
          score = 100 + arabic.length
          wikiTitle = wiki
          break
        }
      }
    }

    if (score === 0) {
      // Base score by word length (longer = more specific)
      score = token.length * 2

      // Boost words with definite article (likely proper nouns / topics)
      if (token.startsWith('ال')) score += 5

      // Boost words that look like proper names (no common patterns)
      if (token.length >= 4) score += 3
    }

    // Positional boost: words near the END of the question are more likely
    // to be the topic. "ماهي اكبر دولة مصدرة للحديد؟" → "الحديد" is last.
    // "متى تم استقلال قطر؟" → "قطر" is last.
    const positionRatio = (i + 1) / totalTokens // 0..1, higher = closer to end
    score += Math.round(positionRatio * 15)

    scored.push({ word: token, score, wikiTitle })
  }

  // Sort by score descending
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
        scored.push({
          word: phrase,
          score: 80 + phrase.length,
          wikiTitle: phrase.replace(/\s+/g, '_'),
        })
      }
    }
  }

  // Then individual words
  const words = text.match(/[a-zA-Z]{3,}/g)
  if (words) {
    for (const w of words) {
      if (!ENGLISH_STOP_WORDS.has(w.toLowerCase())) {
        scored.push({
          word: w,
          score: 20 + w.length,
          wikiTitle: w.charAt(0).toUpperCase() + w.slice(1),
        })
      }
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored
}

/**
 * Extract ranked Wikipedia article title candidates from a question.
 * Uses RAKE-inspired keyword extraction to find the most relevant
 * topic word, not the raw answer.
 */
export function extractKeywords(question: Question): string[] {
  const qText = question.question.trim()
  const answer = question.answer.trim()
  const candidates: string[] = []
  const seen = new Set<string>()

  const addCandidate = (title: string) => {
    const key = title.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      candidates.push(title)
    }
  }

  // 1. Check for multi-word Arabic entities in the FULL question text first
  //    These are highest confidence (e.g. "كرة القدم", "الحرب العالمية الثانية")
  //    Sort by phrase length descending — longer matches are more specific.
  const multiWordHits: { wiki: string; len: number }[] = []
  for (const [arabic, wiki] of ARABIC_TO_WIKI) {
    if (arabic.includes(' ') && qText.includes(arabic)) {
      multiWordHits.push({ wiki, len: arabic.length })
    }
  }
  multiWordHits.sort((a, b) => b.len - a.len)
  for (const hit of multiWordHits) {
    addCandidate(hit.wiki)
  }

  // 2. Score individual Arabic words from the question (RAKE-like)
  const arabicScored = scoreArabicWords(qText)
  for (const sw of arabicScored.slice(0, 3)) {
    if (sw.wikiTitle) {
      addCandidate(sw.wikiTitle)
    }
  }

  // 3. Score English words from the question
  const englishScored = scoreEnglishWords(qText)
  for (const sw of englishScored.slice(0, 2)) {
    if (sw.wikiTitle) addCandidate(sw.wikiTitle)
  }

  // 4. Top Arabic keyword for Arabic Wikipedia (no English mapping found)
  //    This handles words not in our dictionary.
  for (const sw of arabicScored.slice(0, 2)) {
    if (!sw.wikiTitle) {
      addCandidate(`ar:${sw.word}`)
    }
  }

  // 5. Check the answer for known entities (lower priority — user said
  //    to focus on the question, but answer is a useful fallback)
  for (const [arabic, wiki] of ARABIC_TO_WIKI) {
    if (answer.includes(arabic)) {
      addCandidate(wiki)
    }
  }
  if (/^[a-zA-Z][a-zA-Z0-9\s\-'.()]{1,50}$/.test(answer)) {
    addCandidate(answer.replace(/\s+/g, '_'))
  }
  const answerEnglish = scoreEnglishWords(answer)
  for (const sw of answerEnglish.slice(0, 2)) {
    if (sw.wikiTitle) addCandidate(sw.wikiTitle)
  }

  // 6. Category fallback
  const catKeyword = CATEGORY_KEYWORDS[question.category]
  if (catKeyword) {
    addCandidate(catKeyword.replace(/\s+/g, '_'))
  }

  return candidates.length > 0 ? candidates : ['Quiz']
}

// ---------------------------------------------------------------------------
// Wikipedia API fetchers
// ---------------------------------------------------------------------------

async function fetchWikipediaThumbnail(title: string): Promise<string | null> {
  // Handle Arabic Wikipedia prefix
  const isArabic = title.startsWith('ar:')
  const cleanTitle = isArabic ? title.slice(3) : title
  const domain = isArabic ? 'ar.wikipedia.org' : 'en.wikipedia.org'

  try {
    const res = await fetch(
      `https://${domain}/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`,
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
    // timeout or network error
  }
  return null
}

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
// Main auto-assign function
// ---------------------------------------------------------------------------

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

    // Try each keyword candidate (up to 5)
    let found = false
    for (const keyword of keywords.slice(0, 5)) {
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

    // Last resort: try Arabic Wikipedia with top Arabic keyword
    if (!found) {
      const arabicWords = scoreArabicWords(q.question)
      if (arabicWords.length > 0) {
        const url = await fetchWikipediaThumbnail(`ar:${arabicWords[0].word}`)
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
