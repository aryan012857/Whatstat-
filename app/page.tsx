"use client"

import { useState } from "react"
import { MessageCircle, BarChart3, Users, Smile, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FileUpload from "@/components/file-upload"
import ChatAnalytics from "@/components/chat-analytics"
import MessageTimeline from "@/components/message-timeline"
import UserStats from "@/components/user-stats"
import WordCloud from "@/components/word-cloud"
import EmojiAnalysis from "@/components/emoji-analysis"
import { parseChatFile, analyzeChatData, type ChatAnalysis } from "@/lib/chat-parser"

export default function WhatstatAnalyzer() {
  const [chatData, setChatData] = useState<ChatAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log("Reading file:", file.name, "Size:", file.size, "bytes")
      const content = await file.text()
      console.log("File content loaded, length:", content.length)

      // Show first few lines for debugging
      const lines = content.split(/\r?\n/).slice(0, 10)
      const debugLines = lines.map((line, i) => `${i}: ${line}`).join("\n")
      setDebugInfo(`First 10 lines of your file:\n${debugLines}`)

      // Parse the chat file
      const messages = parseChatFile(content)

      if (messages.length === 0) {
        throw new Error(`No valid messages found. 

Possible issues:
1. The file might not be a WhatsApp chat export
2. The date/time format might not be recognized
3. The file might be corrupted or empty

Please make sure you:
- Export the chat from WhatsApp (not a screenshot)
- Choose "Export Chat" → "Without Media"
- Upload the .txt file that WhatsApp creates

Debug info: Found ${content.split(/\r?\n/).length} lines in the file.`)
      }

      console.log(`Successfully parsed ${messages.length} messages`)

      // Analyze the parsed messages
      const analysis = analyzeChatData(messages)

      setChatData(analysis)
      setDebugInfo(null) // Clear debug info on success
    } catch (err) {
      console.error("Error analyzing chat:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze chat file")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Analysis Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>

              {debugInfo && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Debug Information:</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                    {debugInfo}
                  </pre>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to export your WhatsApp chat correctly:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Open WhatsApp and go to the chat you want to analyze</li>
                  <li>2. Tap the three dots menu (⋮) → More → Export chat</li>
                  <li>3. Choose "Without Media" for faster processing</li>
                  <li>4. Save the .txt file and upload it here</li>
                  <li>5. Make sure the file is a .txt file (not a screenshot or image)</li>
                </ol>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setError(null)
                    setChatData(null)
                    setDebugInfo(null)
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                  <li>2. Tap the three dots menu (⋮) → More → Export chat</li>
                  <li>3. Choose "Without Media" for faster processing</li>
                  <li>4. Save the .txt file and upload it here</li>
                </ol>
              </div>

              {debugInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">File Preview:</h4>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
                </div>
              )}
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
