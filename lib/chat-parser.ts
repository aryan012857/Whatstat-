export interface ParsedMessage {
  timestamp: Date
  sender: string
  message: string
  isSystemMessage: boolean
}

export interface ChatAnalysis {
  totalMessages: number
  totalWords: number
  participants: string[]
  dateRange: {
    start: string
    end: string
  }
  topEmojis: string[]
  dailyActivity: Array<{ date: string; messages: number }>
  hourlyActivity: Array<{ hour: number; messages: number }>
  userStats: Array<{
    name: string
    messages: number
    words: number
    avgLength: number
    color: string
  }>
  wordFrequency: Array<{ text: string; value: number }>
  mediaCount: number
  emojiStats: Array<{
    emoji: string
    name: string
    count: number
    category: string
  }>
}

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#F97316", "#84CC16"]

// Comprehensive WhatsApp date/time patterns for different locales and versions
const DATE_TIME_PATTERNS = [
  // Standard formats with various separators
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*([^:]+?):\s*(.*)$/,
  /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*([^:]+?):\s*(.*)$/,
  /^(\d{1,2}-\d{1,2}-\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*([^:]+?):\s*(.*)$/,

  // Bracketed formats
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+?):\s*(.*)$/,
  /^\[(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+?):\s*(.*)$/,

  // With AM/PM
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm))\s*[-–—]\s*([^:]+?):\s*(.*)$/,
  /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm))\s*[-–—]\s*([^:]+?):\s*(.*)$/,

  // Different date orders (MM/DD/YYYY vs DD/MM/YYYY)
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*([^:]+?):\s*(.*)$/,

  // ISO-like formats
  /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*([^:]+?):\s*(.*)$/,

  // Compact formats without separators
  /^(\d{1,2}\/\d{1,2}\/\d{2}),?\s+(\d{1,2}:\d{2})\s*[-–—]\s*([^:]+?):\s*(.*)$/,

  // Alternative colon placement
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/,

  // Without dash separator
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+([^:]+?):\s*(.*)$/,
  /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+([^:]+?):\s*(.*)$/,
]

const SYSTEM_MESSAGE_PATTERNS = [
  /created group/i,
  /added/i,
  /left/i,
  /removed/i,
  /changed the subject/i,
  /changed this group's icon/i,
  /security code changed/i,
  /messages and calls are end-to-end encrypted/i,
  /missed voice call/i,
  /missed video call/i,
  /deleted this message/i,
  /this message was deleted/i,
  /you deleted this message/i,
]

function parseDate(dateStr: string, timeStr: string): Date {
  // Clean up time string
  const cleanTime = timeStr.replace(/\s*(AM|PM|am|pm)\s*$/i, "").trim()
  const isAM = /AM|am/.test(timeStr)
  const isPM = /PM|pm/.test(timeStr)

  let day: number, month: number, year: number

  // Handle different date formats
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/")

    if (parts[2].length === 2) {
      // 2-digit year - assume 20xx if < 50, 19xx if >= 50
      const shortYear = Number.parseInt(parts[2])
      year = shortYear < 50 ? 2000 + shortYear : 1900 + shortYear
    } else {
      year = Number.parseInt(parts[2])
    }

    // Determine if it's DD/MM or MM/DD format
    const first = Number.parseInt(parts[0])
    const second = Number.parseInt(parts[1])

    if (first > 12) {
      // Must be DD/MM format
      day = first
      month = second - 1
    } else if (second > 12) {
      // Must be MM/DD format
      month = first - 1
      day = second
    } else {
      // Ambiguous - default to DD/MM (most common internationally)
      day = first
      month = second - 1
    }
  } else if (dateStr.includes(".")) {
    const parts = dateStr.split(".")
    day = Number.parseInt(parts[0])
    month = Number.parseInt(parts[1]) - 1
    year =
      parts[2].length === 2
        ? Number.parseInt(parts[2]) < 50
          ? 2000 + Number.parseInt(parts[2])
          : 1900 + Number.parseInt(parts[2])
        : Number.parseInt(parts[2])
  } else if (dateStr.includes("-")) {
    const parts = dateStr.split("-")
    if (parts[0].length === 4) {
      // YYYY-MM-DD format
      year = Number.parseInt(parts[0])
      month = Number.parseInt(parts[1]) - 1
      day = Number.parseInt(parts[2])
    } else {
      // DD-MM-YYYY format
      day = Number.parseInt(parts[0])
      month = Number.parseInt(parts[1]) - 1
      year =
        parts[2].length === 2
          ? Number.parseInt(parts[2]) < 50
            ? 2000 + Number.parseInt(parts[2])
            : 1900 + Number.parseInt(parts[2])
          : Number.parseInt(parts[2])
    }
  } else {
    throw new Error("Unsupported date format")
  }

  const timeParts = cleanTime.split(":")
  let hour = Number.parseInt(timeParts[0])
  const minute = Number.parseInt(timeParts[1])
  const second = timeParts[2] ? Number.parseInt(timeParts[2]) : 0

  // Handle AM/PM
  if (isPM && hour !== 12) {
    hour += 12
  } else if (isAM && hour === 12) {
    hour = 0
  }

  return new Date(year, month, day, hour, minute, second)
}

function isSystemMessage(message: string): boolean {
  return SYSTEM_MESSAGE_PATTERNS.some((pattern) => pattern.test(message))
}

function extractEmojis(text: string): string[] {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu
  return text.match(emojiRegex) || []
}

function extractWords(text: string): string[] {
  // Remove emojis and extract words
  const cleanText = text.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu,
    "",
  )
  return cleanText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "the",
          "and",
          "for",
          "are",
          "but",
          "not",
          "you",
          "all",
          "can",
          "had",
          "her",
          "was",
          "one",
          "our",
          "out",
          "day",
          "get",
          "has",
          "him",
          "his",
          "how",
          "its",
          "may",
          "new",
          "now",
          "old",
          "see",
          "two",
          "who",
          "boy",
          "did",
          "she",
          "use",
          "way",
          "many",
          "then",
          "them",
          "well",
          "were",
          "this",
          "that",
          "with",
          "have",
          "will",
          "your",
          "from",
          "they",
          "know",
          "want",
          "been",
          "good",
          "much",
          "some",
          "time",
          "very",
          "when",
          "come",
          "here",
          "just",
          "like",
          "long",
          "make",
          "over",
          "such",
          "take",
          "than",
          "only",
          "think",
          "also",
          "back",
          "after",
          "first",
          "well",
          "year",
        ].includes(word),
    )
}

export function parseChatFile(content: string): ParsedMessage[] {
  console.log("Starting to parse chat file...")
  console.log("Content length:", content.length)

  const lines = content.split(/\r?\n/)
  console.log("Total lines:", lines.length)

  const messages: ParsedMessage[] = []
  let currentMessage: ParsedMessage | null = null
  let matchedLines = 0
  let totalNonEmptyLines = 0

  // Log first few lines for debugging
  console.log("First 10 lines:")
  lines.slice(0, 10).forEach((line, i) => {
    if (line.trim()) {
      console.log(`${i}: "${line}"`)
    }
  })

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    totalNonEmptyLines++
    let matched = false

    // Try each date/time pattern
    for (let j = 0; j < DATE_TIME_PATTERNS.length; j++) {
      const pattern = DATE_TIME_PATTERNS[j]
      const match = line.match(pattern)

      if (match) {
        // Save previous message if exists
        if (currentMessage) {
          messages.push(currentMessage)
        }

        const [, dateStr, timeStr, sender, messageText] = match

        console.log(`Matched line ${i} with pattern ${j}:`, {
          dateStr,
          timeStr,
          sender: sender.trim(),
          messageText: messageText.substring(0, 50) + "...",
        })

        try {
          const timestamp = parseDate(dateStr, timeStr)
          const isSystem = isSystemMessage(messageText)

          currentMessage = {
            timestamp,
            sender: sender.trim(),
            message: messageText.trim(),
            isSystemMessage: isSystem,
          }
          matched = true
          matchedLines++
          break
        } catch (error) {
          console.log(`Date parsing failed for line ${i}:`, error)
          continue
        }
      }
    }

    // If no pattern matched and we have a current message, it's a continuation
    if (!matched && currentMessage) {
      currentMessage.message += "\n" + line.trim()
    } else if (!matched) {
      // Log unmatched lines for debugging
      if (i < 20) {
        // Only log first 20 unmatched lines to avoid spam
        console.log(`Unmatched line ${i}: "${line}"`)
      }
    }
  }

  // Don't forget the last message
  if (currentMessage) {
    messages.push(currentMessage)
  }

  console.log(`Parsing complete:`)
  console.log(`- Total non-empty lines: ${totalNonEmptyLines}`)
  console.log(`- Matched lines: ${matchedLines}`)
  console.log(`- Total messages: ${messages.length}`)
  console.log(`- System messages: ${messages.filter((m) => m.isSystemMessage).length}`)
  console.log(`- Regular messages: ${messages.filter((m) => !m.isSystemMessage).length}`)

  // Log first few parsed messages
  console.log("First 3 parsed messages:")
  messages.slice(0, 3).forEach((msg, i) => {
    console.log(`${i}: ${msg.timestamp.toISOString()} - ${msg.sender}: ${msg.message.substring(0, 50)}...`)
  })

  const regularMessages = messages.filter((msg) => !msg.isSystemMessage && msg.message.length > 0)
  console.log(`Final regular messages count: ${regularMessages.length}`)

  return regularMessages
}

export function analyzeChatData(messages: ParsedMessage[]): ChatAnalysis {
  if (messages.length === 0) {
    throw new Error("No valid messages found in the chat file")
  }

  console.log(`Analyzing ${messages.length} messages...`)

  // Basic stats
  const totalMessages = messages.length
  const participants = [...new Set(messages.map((msg) => msg.sender))]
  console.log(`Found ${participants.length} participants:`, participants)

  // Date range
  const dates = messages.map((msg) => msg.timestamp).sort((a, b) => a.getTime() - b.getTime())
  const startDate = dates[0]
  const endDate = dates[dates.length - 1]

  // Word analysis
  const allWords: string[] = []
  const allEmojis: string[] = []
  let mediaCount = 0

  messages.forEach((msg) => {
    const words = extractWords(msg.message)
    allWords.push(...words)

    const emojis = extractEmojis(msg.message)
    allEmojis.push(...emojis)

    // Count media messages
    if (
      msg.message.includes("<Media omitted>") ||
      msg.message.includes("image omitted") ||
      msg.message.includes("video omitted") ||
      msg.message.includes("audio omitted") ||
      msg.message.includes("document omitted") ||
      msg.message.includes("‎image omitted") ||
      msg.message.includes("‎video omitted") ||
      msg.message.includes("‎audio omitted") ||
      msg.message.includes("‎document omitted")
    ) {
      mediaCount++
    }
  })

  const totalWords = allWords.length
  console.log(`Extracted ${totalWords} words and ${allEmojis.length} emojis`)

  // Word frequency
  const wordFreq: { [key: string]: number } = {}
  allWords.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  const wordFrequency = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .map(([text, value]) => ({ text, value }))

  // Emoji frequency
  const emojiFreq: { [key: string]: number } = {}
  allEmojis.forEach((emoji) => {
    emojiFreq[emoji] = (emojiFreq[emoji] || 0) + 1
  })

  const topEmojis = Object.entries(emojiFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([emoji]) => emoji)

  // User statistics
  const userStats = participants
    .map((participant, index) => {
      const userMessages = messages.filter((msg) => msg.sender === participant)
      const userWords = userMessages.flatMap((msg) => extractWords(msg.message))

      return {
        name: participant,
        messages: userMessages.length,
        words: userWords.length,
        avgLength: userWords.length / userMessages.length || 0,
        color: COLORS[index % COLORS.length],
      }
    })
    .sort((a, b) => b.messages - a.messages)

  // Daily activity
  const dailyActivity: { [key: string]: number } = {}
  messages.forEach((msg) => {
    const dateKey = msg.timestamp.toISOString().split("T")[0]
    dailyActivity[dateKey] = (dailyActivity[dateKey] || 0) + 1
  })

  const dailyActivityArray = Object.entries(dailyActivity)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, messages]) => ({ date, messages }))

  // Hourly activity
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
    const count = messages.filter((msg) => msg.timestamp.getHours() === hour).length
    return { hour, messages: count }
  })

  // Emoji stats with categories
  const emojiStats = Object.entries(emojiFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([emoji, count]) => ({
      emoji,
      name: getEmojiName(emoji),
      count,
      category: getEmojiCategory(emoji),
    }))

  const analysis = {
    totalMessages,
    totalWords,
    participants,
    dateRange: {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    },
    topEmojis,
    dailyActivity: dailyActivityArray,
    hourlyActivity,
    userStats,
    wordFrequency,
    mediaCount,
    emojiStats,
  }

  console.log("Analysis complete:", {
    totalMessages: analysis.totalMessages,
    totalWords: analysis.totalWords,
    participants: analysis.participants.length,
    dateRange: analysis.dateRange,
    topWords: analysis.wordFrequency.slice(0, 5).map((w) => w.text),
    topEmojis: analysis.topEmojis.slice(0, 5),
  })

  return analysis
}

function getEmojiName(emoji: string): string {
  const emojiNames: { [key: string]: string } = {
    "😂": "Face with Tears of Joy",
    "❤️": "Red Heart",
    "😍": "Smiling Face with Heart-Eyes",
    "🤣": "Rolling on Floor Laughing",
    "😊": "Smiling Face with Smiling Eyes",
    "🙏": "Folded Hands",
    "😘": "Face Blowing a Kiss",
    "💕": "Two Hearts",
    "😭": "Loudly Crying Face",
    "😅": "Grinning Face with Sweat",
    "👍": "Thumbs Up",
    "🔥": "Fire",
    "💯": "Hundred Points Symbol",
    "👏": "Clapping Hands",
    "😎": "Smiling Face with Sunglasses",
    "😉": "Winking Face",
    "😄": "Grinning Face with Smiling Eyes",
    "😃": "Grinning Face",
    "😀": "Grinning Face",
    "😆": "Grinning Squinting Face",
    "😁": "Beaming Face with Smiling Eyes",
    "🥰": "Smiling Face with Hearts",
    "😋": "Face Savoring Food",
    "😌": "Relieved Face",
    "😏": "Smirking Face",
    "🤔": "Thinking Face",
    "🙄": "Face with Rolling Eyes",
    "😒": "Unamused Face",
    "😔": "Pensive Face",
    "😢": "Crying Face",
    "😞": "Disappointed Face",
    "😟": "Worried Face",
    "😕": "Slightly Frowning Face",
    "🙁": "Slightly Frowning Face",
    "☹️": "Frowning Face",
    "😤": "Face with Steam From Nose",
    "😠": "Angry Face",
    "😡": "Pouting Face",
    "🤬": "Face with Symbols on Mouth",
    "😱": "Face Screaming in Fear",
    "😨": "Fearful Face",
    "😰": "Anxious Face with Sweat",
    "😥": "Sad but Relieved Face",
    "😓": "Downcast Face with Sweat",
    "🤗": "Hugging Face",
    "🤭": "Face with Hand Over Mouth",
    "🤫": "Shushing Face",
    "🤥": "Lying Face",
    "😶": "Face Without Mouth",
    "😐": "Neutral Face",
    "😑": "Expressionless Face",
    "😬": "Grimacing Face",
    "🙃": "Upside-Down Face",
    "😯": "Hushed Face",
    "😦": "Frowning Face with Open Mouth",
    "😧": "Anguished Face",
    "😮": "Face with Open Mouth",
    "😲": "Astonished Face",
    "🥱": "Yawning Face",
    "😴": "Sleeping Face",
    "🤤": "Drooling Face",
    "😪": "Sleepy Face",
    "😵": "Dizzy Face",
    "🤐": "Zipper-Mouth Face",
    "🥴": "Woozy Face",
    "🤢": "Nauseated Face",
    "🤮": "Face Vomiting",
    "🤧": "Sneezing Face",
    "😷": "Face with Medical Mask",
    "🤒": "Face with Thermometer",
    "🤕": "Face with Head-Bandage",
  }
  return emojiNames[emoji] || "Unknown Emoji"
}

function getEmojiCategory(emoji: string): string {
  const happyEmojis = ["😂", "🤣", "😊", "😄", "😃", "😀", "😆", "😁", "😉", "😋", "😌", "🥰", "🤗"]
  const loveEmojis = ["❤️", "😍", "😘", "💕", "💖", "💗", "💓", "💝", "💘", "💞", "💟", "♥️", "💋"]
  const sadEmojis = ["😭", "😢", "😞", "😔", "😟", "😕", "🙁", "☹️", "😥", "😓", "😰", "😨", "😱"]
  const excitedEmojis = ["🔥", "💯", "🎉", "🎊", "✨", "⭐", "🌟", "💫", "🚀", "⚡", "💥", "🎯", "🏆"]
  const angryEmojis = ["😤", "😠", "😡", "🤬", "👿", "😈"]

  if (happyEmojis.includes(emoji)) return "happy"
  if (loveEmojis.includes(emoji)) return "love"
  if (sadEmojis.includes(emoji)) return "sad"
  if (excitedEmojis.includes(emoji)) return "excited"
  if (angryEmojis.includes(emoji)) return "angry"
  return "other"
}
