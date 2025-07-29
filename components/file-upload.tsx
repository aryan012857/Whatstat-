"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isAnalyzing: boolean
}

export default function FileUpload({ onFileUpload, isAnalyzing }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          onFileUpload(file)
        } else {
          alert("Please upload a .txt file exported from WhatsApp")
        }
      }
    },
    [onFileUpload],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        onFileUpload(file)
      } else {
        alert("Please upload a .txt file exported from WhatsApp")
      }
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="border-2 border-dashed border-purple-300 bg-purple-50">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Analyzing Your Chat</h3>
          <p className="text-purple-700">Processing messages, extracting insights, and generating visualizations...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your WhatsApp chat file here</h3>
      <p className="text-gray-600 mb-4">or click to browse and select a .txt file</p>

      <input type="file" accept=".txt" onChange={handleFileInput} className="hidden" id="file-upload" />

      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <label htmlFor="file-upload" className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Choose File
        </label>
      </Button>
    </div>
  )
}
