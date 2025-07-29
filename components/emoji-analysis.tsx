"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Heart, Zap } from "lucide-react"

interface EmojiAnalysisProps {
  data: {
    emojiStats: Array<{
      emoji: string
      name: string
      count: number
      category: string
    }>
    totalMessages: number
  }
}

export default function EmojiAnalysis({ data }: EmojiAnalysisProps) {
  const categoryColors = {
    happy: "#10B981",
    love: "#EF4444",
    other: "#06B6D4",
    excited: "#F59E0B",
    sad: "#8B5CF6",
  }

  const totalEmojis = data.emojiStats.reduce((sum, emoji) => sum + emoji.count, 0)
  const maxCount = Math.max(...data.emojiStats.map((emoji) => emoji.count))

  const categoryStats = data.emojiStats.reduce((acc: any, emoji) => {
    acc[emoji.category] = (acc[emoji.category] || 0) + emoji.count
    return acc
  }, {})

  if (data.emojiStats.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Smile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Emojis Found</h3>
          <p className="text-gray-500">This chat doesn't contain any emojis to analyze.</p>
        </CardContent>
      </Card>
    )
  }

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
            {data.emojiStats.slice(0, 10).map((emoji, index) => (
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
            {data.emojiStats.map((emoji, index) => (
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
              <div className="text-2xl font-bold text-blue-600">{data.emojiStats.length}</div>
              <div className="text-sm text-gray-600">Unique Emojis</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((totalEmojis / data.totalMessages) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Messages with Emojis</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{data.emojiStats[0]?.emoji || "N/A"}</div>
              <div className="text-sm text-gray-600">Most Popular</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
