"use client"

import { useState } from "react"
import { MessageCircle, BarChart3, Users, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import FileUpload from "@/components/file-upload"
import ChatAnalytics from "@/components/chat-analytics"
import MessageTimeline from "@/components/message-timeline"
import UserStats from "@/components/user-stats"
import WordCloud from "@/components/word-cloud"
import EmojiAnalysis from "@/components/emoji-analysis"

export default function WhatstatAnalyzer() {
  const [chatData, setChatData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analysis results
    const mockData = {
      totalMessages: 15847,
      totalWords: 89234,
      participants: ["Alice", "Bob", "Charlie", "Diana"],
      dateRange: {
        start: "2023-01-15",
        end: "2024-01-29",
      },
      topEmojis: ["😂", "❤️", "👍", "😊", "🔥"],
      dailyActivity: generateMockDailyData(),
      hourlyActivity: generateMockHourlyData(),
      userStats: generateMockUserStats(),
      wordFrequency: generateMockWordData(),
      mediaCount: 1247,
    }

    setChatData(mockData)
    setIsAnalyzing(false)
  }

  const generateMockDailyData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
      messages: Math.floor(Math.random() * 200) + 50,
    }))
  }

  const generateMockHourlyData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      messages: Math.floor(Math.random() * 100) + 10,
    }))
  }

  const generateMockUserStats = () => {
    return [
      { name: "Alice", messages: 4521, words: 23456, avgLength: 5.2, color: "#8B5CF6" },
      { name: "Bob", messages: 3892, words: 19834, avgLength: 5.1, color: "#06B6D4" },
      { name: "Charlie", messages: 4234, words: 25123, avgLength: 5.9, color: "#10B981" },
      { name: "Diana", messages: 3200, words: 20821, avgLength: 6.5, color: "#F59E0B" },
    ]
  }

  const generateMockWordData = () => {
    const words = [
      "love",
      "good",
      "time",
      "work",
      "home",
      "family",
      "friend",
      "happy",
      "great",
      "nice",
      "thanks",
      "sure",
      "okay",
      "yeah",
      "cool",
    ]
    return words.map((word) => ({
      text: word,
      value: Math.floor(Math.random() * 500) + 100,
    }))
  }

  if (!chatData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WhatStat
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock insights from your WhatsApp conversations with powerful analytics and beautiful visualizations
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Message Analytics</CardTitle>
                <CardDescription>Detailed statistics about your chat activity, patterns, and trends</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>User Insights</CardTitle>
                <CardDescription>
                  Individual participant analysis with message counts and activity patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Smile className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Emoji & Word Analysis</CardTitle>
                <CardDescription>Discover the most used emojis, words, and sentiment patterns</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your WhatsApp Chat</CardTitle>
              <CardDescription>Export your WhatsApp chat and upload the .txt file to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to export your WhatsApp chat:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Open WhatsApp and go to the chat you want to analyze</li>
                  <li>2. Tap the three dots menu → More → Export chat</li>
                  <li>3. Choose "Without Media" for faster processing</li>
                  <li>4. Save the .txt file and upload it here</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WhatStat Analysis
              </h1>
            </div>
            <Button variant="outline" onClick={() => setChatData(null)} className="bg-white/80 backdrop-blur-sm">
              Analyze New Chat
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{chatData.totalMessages.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{chatData.participants.length}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{chatData.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{chatData.mediaCount}</div>
                <div className="text-sm text-gray-600">Media Files</div>
              </CardContent>
            </Card>
          </div>

          {/* Participants */}
          <div className="flex flex-wrap gap-2">
            {chatData.participants.map((participant, index) => (
              <Badge key={index} variant="secondary" className="bg-white/80 backdrop-blur-sm">
                {participant}
              </Badge>
            ))}
          </div>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
            <TabsTrigger value="emojis">Emojis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ChatAnalytics data={chatData} />
          </TabsContent>

          <TabsContent value="timeline">
            <MessageTimeline data={chatData} />
          </TabsContent>

          <TabsContent value="users">
            <UserStats data={chatData} />
          </TabsContent>

          <TabsContent value="words">
            <WordCloud data={chatData} />
          </TabsContent>

          <TabsContent value="emojis">
            <EmojiAnalysis data={chatData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
