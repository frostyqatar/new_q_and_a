import { Question, CATEGORIES } from './types'

export function parseQuestions(text: string): Question[] {
  const questions: Question[] = []
  // First, protect special blocks (code and multiline) before cleaning
  const codeBlockPlaceholder = '__CODE_BLOCK__'
  const multilinePlaceholder = '__MULTILINE_BLOCK__'
  const codeBlocks: string[] = []
  const multilineBlocks: string[] = []
  let protectedText = text
  let blockIndex = 0
  let multilineIndex = 0
  
  // Find and replace code blocks with placeholders
  const codeBlockRegex = /#code#([\s\S]*?)#\/code#/g
  let match
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const codeContent = match[1]
    codeBlocks.push(codeContent)
    protectedText = protectedText.replace(match[0], `${codeBlockPlaceholder}${blockIndex}${codeBlockPlaceholder}`)
    blockIndex++
  }
  
  // Find and replace multiline blocks with placeholders
  const multilineBlockRegex = /#multiline#([\s\S]*?)#\/multiline#/g
  while ((match = multilineBlockRegex.exec(protectedText)) !== null) {
    const multilineContent = match[1]
    multilineBlocks.push(multilineContent)
    protectedText = protectedText.replace(match[0], `${multilinePlaceholder}${multilineIndex}${multilinePlaceholder}`)
    multilineIndex++
  }
  
  // Clean up the text: remove markdown formatting, handle numbered lists, etc.
  let cleanedText = protectedText
    // Remove markdown bold/header markers
    .replace(/\*\*/g, '')
    // Remove markdown headers, but preserve lines with code block placeholders
    .split('\n')
    .map(line => {
      // Don't modify lines that contain code block placeholders
      if (line.includes(codeBlockPlaceholder)) {
        return line
      }
      // Remove markdown headers from other lines
      return line.replace(/^#{1,6}\s+/, '')
    })
    .join('\n')
    // Remove numbered list markers (e.g., "1. ", "2. ", etc.)
    .replace(/^\d+\.\s+/gm, '')
    // Remove bullet points
    .replace(/^[-•]\s+/gm, '')
    // Remove separator lines (e.g., "---")
    .replace(/^-{3,}$/gm, '')
  
  // Process line by line, preserving structure
  const rawLines = cleanedText.split('\n')
  let processedLines: string[] = []
  
  // Process lines to restore placeholders and handle structure
  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim()
    
    // Restore code blocks from placeholders
    const codePlaceholderRegex = new RegExp(`${codeBlockPlaceholder}(\\d+)${codeBlockPlaceholder}`, 'g')
    let hasCodePlaceholder = false
    line = line.replace(codePlaceholderRegex, (match, index) => {
      hasCodePlaceholder = true
      return match // Keep placeholder for later processing
    })
    
    // Restore multiline blocks from placeholders
    const multilinePlaceholderRegex = new RegExp(`${multilinePlaceholder}(\\d+)${multilinePlaceholder}`, 'g')
    let hasMultilinePlaceholder = false
    line = line.replace(multilinePlaceholderRegex, (match, index) => {
      hasMultilinePlaceholder = true
      return match // Keep placeholder for later processing
    })
    
    // Check for code/multiline block markers (in case they weren't protected)
    if (line === '#code#' || line === '#/code#' || line === '#multiline#' || line === '#/multiline#') {
      continue
    }
    
    if (line || hasCodePlaceholder || hasMultilinePlaceholder) {
      processedLines.push(line || '')
    }
  }
  
  let currentCategory = ''
  let currentQuestion = ''
  let currentAnswer = ''
  let currentAnswerLines: string[] = [] // Track answer lines to preserve multiline
  let currentCode = ''
  let currentMedia: Question['media'] | undefined = undefined
  let collectingAnswer = false
  
  for (let i = 0; i < processedLines.length; i++) {
    let line = processedLines[i]
    
    // Restore code blocks from placeholders (should come after question)
    const codePlaceholderRegex = new RegExp(`${codeBlockPlaceholder}(\\d+)${codeBlockPlaceholder}`, 'g')
    const codeMatch = line.match(codePlaceholderRegex)
    if (codeMatch && currentQuestion) {
      codeMatch.forEach(match => {
        const index = parseInt(match.replace(new RegExp(codeBlockPlaceholder, 'g'), ''))
        if (codeBlocks[index] !== undefined) {
          currentCode = codeBlocks[index]
          line = line.replace(match, '').trim()
        }
      })
      if (!line) continue
    } else if (codeMatch) {
      line = line.replace(codePlaceholderRegex, '').trim()
      if (!line) continue
    }
    
    // Restore multiline blocks from placeholders (can be used anywhere)
    const multilinePlaceholderRegex = new RegExp(`${multilinePlaceholder}(\\d+)${multilinePlaceholder}`, 'g')
    const multilineMatch = line.match(multilinePlaceholderRegex)
    if (multilineMatch) {
      multilineMatch.forEach(match => {
        const index = parseInt(match.replace(new RegExp(multilinePlaceholder, 'g'), ''))
        if (multilineBlocks[index] !== undefined) {
          // If we're collecting an answer, add multiline content to answer
          if (collectingAnswer) {
            currentAnswerLines.push(multilineBlocks[index])
          } else if (currentQuestion && !currentCode) {
            // If we have a question but no code yet, treat as code
            currentCode = multilineBlocks[index]
          }
          line = line.replace(match, '').trim()
        }
      })
      if (!line) continue
    }
    
    // Check if line is a category
    // Simple rule: If line ends with ":", it's a category
    const isCategory = line.endsWith(':') || line.endsWith('：') // Support both English and Arabic colon
    
    if (isCategory) {
      // Remove the colon and use as category name (freeform - any text before ":" becomes category)
      const categoryName = line.replace(/[:：]$/, '').trim()
      // Check if it matches a known category (for backwards compatibility)
      const exactCategoryMatch = CATEGORIES.find(cat => cat === categoryName)
      const partialCategoryMatch = CATEGORIES.find(cat => cat.includes(categoryName) || categoryName.includes(cat))
      
      // Use exact match if found, otherwise partial match, otherwise use the category name as-is (freeform)
      const newCategory = exactCategoryMatch || partialCategoryMatch || categoryName
      
      // If this is the same category as current, save current question and ignore duplicate category line
      // This prevents parsing when ChatGPT repeats categories before each question
      // Categories should only appear once, then all questions for that category follow
      if (currentCategory === newCategory && currentCategory) {
        // Duplicate category line - save current question first, then ignore the category line
        if (currentQuestion && (currentAnswer || currentAnswerLines.length > 0)) {
          const finalAnswer = currentAnswerLines.length > 0 
            ? currentAnswerLines.join('\n')
            : currentAnswer
          questions.push({
            id: `${Date.now()}-${Math.random()}`,
            category: currentCategory || 'معلومات عامة وممتعة',
            question: currentQuestion,
            answer: finalAnswer,
            code: currentCode || undefined,
            media: currentMedia,
          })
          // Reset for next question in same category
          currentQuestion = ''
          currentAnswer = ''
          currentAnswerLines = []
          currentCode = ''
          collectingAnswer = false
          currentMedia = undefined
        }
        // Ignore duplicate category line and continue
        continue
      }
      
      // If we have a current question and answer, save it first before switching to different category
      if (currentQuestion && (currentAnswer || currentAnswerLines.length > 0)) {
        const finalAnswer = currentAnswerLines.length > 0 
          ? currentAnswerLines.join('\n')
          : currentAnswer
        questions.push({
          id: `${Date.now()}-${Math.random()}`,
          category: currentCategory || 'معلومات عامة وممتعة',
          question: currentQuestion,
          answer: finalAnswer,
          code: currentCode || undefined,
          media: currentMedia,
        })
      }
      
      // Set new category (different from current)
      currentCategory = newCategory
      currentQuestion = ''
      currentAnswer = ''
      currentAnswerLines = []
      currentCode = ''
      collectingAnswer = false
      currentMedia = undefined
      continue
    }
    
    // Check for media URLs (can appear after answer)
    if (line.startsWith('http://') || line.startsWith('https://')) {
      const url = line
      // Check if URL has file extension (for images/videos/audio)
      // URLs without extensions might be YouTube or other media
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const videoId = extractYouTubeId(url)
        if (videoId) {
          currentMedia = {
            type: 'youtube',
            url: videoId,
          }
        }
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) {
        currentMedia = {
          type: 'image',
          url,
        }
      } else if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
        currentMedia = {
          type: 'video',
          url,
        }
      } else if (url.match(/\.(mp3|wav|ogg|m4a)(\?|$)/i)) {
        currentMedia = {
          type: 'audio',
          url,
        }
      } else {
        // URL without recognized extension - treat as image by default
        currentMedia = {
          type: 'image',
          url,
        }
      }
      continue
    }
    
    // Check if line ends with ? or ؟ (Arabic question mark)
    // Also handle lines that start with question indicators
    const isQuestion = line.endsWith('?') || line.endsWith('؟') || 
                       line.match(/^ما\s+ه[وي]/) || // Arabic questions starting with "ما هو/هي"
                       line.match(/^م[نت]/) || // Arabic questions starting with "من/ما"
                       line.match(/^أ[ي]/) || // Arabic questions starting with "أين"
                       line.match(/^م[ت]/) || // Arabic questions starting with "متى"
                       line.match(/^ك[ي]/) // Arabic questions starting with "كيف"
    
    if (isQuestion) {
      // Save previous question if exists
      if (currentQuestion && (currentAnswer || currentAnswerLines.length > 0)) {
        const finalAnswer = currentAnswerLines.length > 0 
          ? currentAnswerLines.join('\n')
          : currentAnswer
        questions.push({
          id: `${Date.now()}-${Math.random()}`,
          category: currentCategory || 'معلومات عامة وممتعة',
          question: currentQuestion,
          answer: finalAnswer,
          code: currentCode || undefined,
          media: currentMedia,
        })
      }
      // Start new question
      currentQuestion = line
      currentAnswer = ''
      currentAnswerLines = []
      currentCode = ''
      collectingAnswer = false // Will be set to true when we start collecting answer
      currentMedia = undefined
      continue
    }
    
    // If we have a question, this is likely part of the answer
    if (currentQuestion) {
      // Skip if it looks like another question (starts with number or question word followed by ?)
      const looksLikeNewQuestion = line.match(/^\d+[\.\)]/) || 
                                   (line.match(/^[مامنأينمتىكيف]/) && (line.includes('؟') || line.includes('?')))
      
      if (looksLikeNewQuestion) {
        // Save current question first
        if (currentAnswerLines.length > 0 || currentAnswer) {
          const finalAnswer = currentAnswerLines.length > 0 
            ? currentAnswerLines.join('\n')
            : currentAnswer
          questions.push({
            id: `${Date.now()}-${Math.random()}`,
            category: currentCategory || 'معلومات عامة وممتعة',
            question: currentQuestion,
            answer: finalAnswer,
            code: currentCode || undefined,
            media: currentMedia,
          })
        }
        // Start new question
        currentQuestion = line
        currentAnswer = ''
        currentAnswerLines = []
        currentCode = ''
        collectingAnswer = false
        currentMedia = undefined
        continue
      }
      
      // After a question, start collecting answer immediately (unless we have code first)
      // If we already have code, we're collecting answer
      // If we don't have code yet, any non-code line is the answer
      if (!currentCode) {
        // No code block yet - this line is the answer (or first part of answer)
        collectingAnswer = true
        currentAnswerLines.push(line)
        currentAnswer = line
      } else {
        // We have code - subsequent lines are answer
        collectingAnswer = true
        currentAnswerLines.push(line)
        currentAnswer = currentAnswerLines.join('\n')
      }
      continue // Important: Don't process further (category/media checks already done)
    }
  }
  
  // Save last question
  if (currentQuestion && (currentAnswer || currentAnswerLines.length > 0)) {
    const finalAnswer = currentAnswerLines.length > 0 
      ? currentAnswerLines.join('\n')
      : currentAnswer
    questions.push({
      id: `${Date.now()}-${Math.random()}`,
      category: currentCategory || 'معلومات عامة وممتعة',
      question: currentQuestion,
      answer: finalAnswer,
      code: currentCode || undefined,
      media: currentMedia,
    })
  }
  
  return questions
}

/**
 * Converts questions array back to text format for editing
 */
export function questionsToText(questions: Question[]): string {
  if (questions.length === 0) return ''
  
  let text = ''
  let currentCategory = ''
  
  questions.forEach((q) => {
    // Add category if it changed (with colon suffix)
    if (q.category !== currentCategory) {
      if (currentCategory) {
        text += '\n' // Add blank line between categories
      }
      text += q.category + ':\n'
      currentCategory = q.category
    }
    
    // Add question
    text += q.question + '\n'
    
    // Add code if exists
    if (q.code) {
      text += '#code#\n'
      text += q.code + '\n'
      text += '#/code#\n'
    }
    
    // Add answer (preserve multiline)
    if (q.answer.includes('\n')) {
      // Use multiline tag if answer has multiple lines
      text += '#multiline#\n'
      text += q.answer + '\n'
      text += '#/multiline#\n'
    } else {
      text += q.answer + '\n'
    }
    
    // Add media if exists
    if (q.media) {
      if (q.media.type === 'youtube') {
        text += `https://youtube.com/watch?v=${q.media.url}\n`
      } else {
        text += q.media.url + '\n'
      }
    }
    
    // Add blank line between questions
    text += '\n'
  })
  
  return text.trim()
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}
