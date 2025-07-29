"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, TrendingUp } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MessageTimelineProps {
  data: any
}

export default function MessageTimeline({ data }: MessageTimelineProps) {
  const peakHour = data.hourlyActivity.reduce((max: any, hour: any) => (hour.messages > max.messages ? hour : max))

  const totalDays = Math.ceil(
    (new Date(data.dateRange.end).getTime() - new Date(data.dateRange.start).getTime()) / (1000 * 60 * 60 * 24),
  )
  const avgMessagesPerDay = Math.round(data.totalMessages / totalDays)

  return (
    <div className="space-y-6">
      {/* Timeline Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{totalDays}</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{avgMessagesPerDay}</div>
                <div className="text-sm text-gray-600">Avg Messages/Day</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{peakHour.hour}:00</div>
                <div className="text-sm text-gray-600">Peak Hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Message Timeline</CardTitle>
          <CardDescription>
            Chat activity from {new Date(data.dateRange.start).toLocaleDateString()} to{" "}
            {new Date(data.dateRange.end).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.dailyActivity}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [value, "Messages"]}
              />
              <Area type="monotone" dataKey="messages" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMessages)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Date Range Info */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Chat Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Started</div>
              <div className="font-semibold">
                {new Date(data.dateRange.start).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">{totalDays} days</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Last Message</div>
              <div className="font-semibold">
                {new Date(data.dateRange.end).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
