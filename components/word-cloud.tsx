"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash } from "lucide-react"

interface WordCloudProps {
  data: any
}

export default function WordCloud({ data }: WordCloudProps) {
  const sortedWords = [...data.wordFrequency].sort((a, b) => b.value - a.value)
  const topWords = sortedWords.slice(0, 10)
  const maxValue = Math.max(...data.wordFrequency.map((word: any) => word.value))

  const getWordSize = (value: number) => {
    const ratio = value / maxValue
    return Math.max(12, Math.min(48, 12 + ratio * 36))
  }

  const getWordColor = (index: number) => {
    const colors = [
      "#8B5CF6",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Word Cloud Visualization */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Most Used Words</CardTitle>
          <CardDescription>Visual representation of word frequency in your chat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg min-h-[300px]">
            {data.wordFrequency.map((word: any, index: number) => (
              <span
                key={index}
                className="font-bold cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  fontSize: `${getWordSize(word.value)}px`,
                  color: getWordColor(index),
                  lineHeight: 1.2,
                }}
                title={`Used ${word.value} times`}
              >
                {word.text}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Words List */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top 10 Words</span>
          </CardTitle>
          <CardDescription>Most frequently used words with exact counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topWords.map((word: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: getWordColor(index) }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-semibold text-lg">{word.text}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white">
                    {word.value} times
                  </Badge>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(word.value / maxValue) * 100}%`,
                        backgroundColor: getWordColor(index),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Word Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Hash className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{data.wordFrequency.length}</div>
            <div className="text-sm text-gray-600">Unique Words</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{topWords[0]?.value || 0}</div>
            <div className="text-sm text-gray-600">Most Used: "{topWords[0]?.text || "N/A"}"</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Hash className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{Math.round(data.totalWords / data.totalMessages)}</div>
            <div className="text-sm text-gray-600">Avg Words/Message</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
