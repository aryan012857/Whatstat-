"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Type, BarChart3 } from "lucide-react"

interface UserStatsProps {
  data: any
}

export default function UserStats({ data }: UserStatsProps) {
  const maxMessages = Math.max(...data.userStats.map((user: any) => user.messages))
  const maxWords = Math.max(...data.userStats.map((user: any) => user.words))

  return (
    <div className="space-y-6">
      {/* User Cards */}
      <div className="grid gap-4">
        {data.userStats.map((user: any, index: number) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12" style={{ backgroundColor: user.color }}>
                  <AvatarFallback className="text-white font-semibold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">
                      {((user.messages / data.totalMessages) * 100).toFixed(1)}% of total messages
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Messages</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: user.color }}>
                        {user.messages.toLocaleString()}
                      </div>
                      <Progress
                        value={(user.messages / maxMessages) * 100}
                        className="h-2"
                        style={{
                          backgroundColor: `${user.color}20`,
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Type className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Words</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: user.color }}>
                        {user.words.toLocaleString()}
                      </div>
                      <Progress
                        value={(user.words / maxWords) * 100}
                        className="h-2"
                        style={{
                          backgroundColor: `${user.color}20`,
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Avg Length</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: user.color }}>
                        {user.avgLength}
                      </div>
                      <div className="text-xs text-gray-500">words per message</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Chart */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>User Comparison</CardTitle>
          <CardDescription>Message activity comparison across all participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.userStats.map((user: any, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar className="h-8 w-8" style={{ backgroundColor: user.color }}>
                  <AvatarFallback className="text-white text-sm">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-gray-600">{user.messages.toLocaleString()} messages</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(user.messages / maxMessages) * 100}%`,
                        backgroundColor: user.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
