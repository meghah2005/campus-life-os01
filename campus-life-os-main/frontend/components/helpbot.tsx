"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircleIcon, SendIcon, XIcon } from "lucide-react"
import { sendHelpBotMessageViaGateway } from "@/lib/api-gateway"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function HelpBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Campus HelpBot. I can help you with forms, deadlines, and finding skilled peers. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const quickPrompts = [
    "How do I track upcoming deadlines?",
    "Where can I find GPA calculator?",
    "How to use study timer effectively?",
  ]

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isSending) return

    const currentInput = input.trim()

    const userMessage: Message = {
      id: messages.length + 1,
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      setIsSending(true)
      const response = await sendHelpBotMessageViaGateway(currentInput)
      const botResponse: Message = {
        id: Date.now(),
        text: response.reply,
        sender: "bot",
        timestamp: new Date(response.timestamp),
      }
      setMessages((prev) => [...prev, botResponse])
    } catch {
      const botResponse: Message = {
        id: Date.now(),
        text: "HelpBot is temporarily unavailable. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsSending(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-24 right-4 z-50 size-14 rounded-full shadow-lg md:bottom-6 md:right-6"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircleIcon className="size-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed inset-x-3 bottom-20 top-20 z-50 flex flex-col shadow-2xl md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:w-[420px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                <MessageCircleIcon className="size-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Campus HelpBot</CardTitle>
                <p className="text-xs text-muted-foreground">
                  <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />
                  Online now
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <XIcon className="size-4" />
            </Button>
          </CardHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="mt-1 text-[10px] opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <CardContent className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button size="icon" onClick={sendMessage} disabled={isSending || !input.trim()}>
                <SendIcon className="size-4" />
              </Button>
            </div>
            {isSending && <p className="mt-2 text-xs text-muted-foreground">HelpBot is typing...</p>}
          </CardContent>
        </Card>
      )}
    </>
  )
}
