"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Heart, Zap } from "lucide-react"

interface EmojiAnalysisProps {
  data: any
}

export default function EmojiAnalysis({ data }: EmojiAnalysisProps) {
  const emojiData = [
    { emoji: "😂", name: "Face with Tears of Joy", count: 1247, category: "happy" },
    { emoji: "❤️", name: "Red Heart", count: 892, category: "love" },
    { emoji: "👍", name: "Thumbs Up", count: 654, category: "positive" },
    { emoji: "😊", name: "Smiling Face", count: 543, category: "happy" },
    { emoji: "🔥", name: "Fire", count: 432, category: "excited" },
    { emoji: "😭", name: "Loudly Crying Face", count: 321, category: "sad" },
    { emoji: "🤣", name: "Rolling on Floor Laughing", count: 298, category: "happy" },
    { emoji: "😍", name: "Smiling Face with Heart-Eyes", count: 276, category: "love" },
    { emoji: "👏", name: "Clapping Hands", count: 234, category: "positive" },
    { emoji: "💯", name: "Hundred Points", count: 198, category: "excited" },
  ]

  const categoryColors = {
    happy: "#10B981",
    love: "#EF4444",
    positive: "#06B6D4",
    excited: "#F59E0B",
    sad: "#8B5CF6",
  }

  const totalEmojis = emojiData.reduce((sum, emoji) => sum + emoji.count, 0)
  const maxCount = Math.max(...emojiData.map((emoji) => emoji.count))

  const categoryStats = emojiData.reduce((acc: any, emoji) => {
    acc[emoji.category] = (acc[emoji.category] || 0) + emoji.count
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Emoji Grid */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smile className="h-5 w-5" />
            <span>Most Used Emojis</span>
          </CardTitle>
          <CardDescription>Your favorite emojis and their usage frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {emojiData.slice(0, 10).map((emoji, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-2">{emoji.emoji}</div>
                <div className="font-semibold text-lg">{emoji.count}</div>
                <div className="text-xs text-gray-600">{emoji.name}</div>
                <Badge
                  variant="secondary"
                  className="mt-2 text-xs"
                  style={{
                    backgroundColor: `${categoryColors[emoji.category as keyof typeof categoryColors]}20`,
                    color: categoryColors[emoji.category as keyof typeof categoryColors],
                  }}
                >
                  {emoji.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emoji Rankings */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Emoji Leaderboard</CardTitle>
          <CardDescription>Detailed breakdown with usage percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emojiData.map((emoji, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: categoryColors[emoji.category as keyof typeof categoryColors] }}
                  >
                    {index + 1}
                  </div>
                  <div className="text-3xl">{emoji.emoji}</div>
                  <div>
                    <div className="font-semibold">{emoji.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{emoji.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-bold">{emoji.count}</div>
                    <div className="text-sm text-gray-600">{((emoji.count / totalEmojis) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(emoji.count / maxCount) * 100}%`,
                        backgroundColor: categoryColors[emoji.category as keyof typeof categoryColors],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Smile className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{categoryStats.happy || 0}</div>
            <div className="text-sm text-gray-600">Happy Emojis</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{categoryStats.love || 0}</div>
            <div className="text-sm text-gray-600">Love Emojis</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{categoryStats.excited || 0}</div>
            <div className="text-sm text-gray-600">Excited Emojis</div>
          </CardContent>
        </Card>
      </div>

      {/* Emoji Stats Summary */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Emoji Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalEmojis}</div>
              <div className="text-sm text-gray-600">Total Emojis</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{emojiData.length}</div>
              <div className="text-sm text-gray-600">Unique Emojis</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((totalEmojis / data.totalMessages) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Messages with Emojis</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{emojiData[0]?.emoji || "😂"}</div>
              <div className="text-sm text-gray-600">Most Popular</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
