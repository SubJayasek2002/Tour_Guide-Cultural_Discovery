import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ScrollArea } from '../ui/scroll-area'
import { Send, MessageCircle, X } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { chatAPI } from '../../services/api'

type Message = { id: string; text: string; sender: 'user' | 'bot' }

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'bot-1', text: "Ayubowan — I'm Aayu, your Sri Lankan tour guide! Ask me about travel & culture.", sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: `user-${Date.now()}`, text, sender: 'user' }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await chatAPI.sendMessage(text)
      // backend returns raw text or object; handle both
      const botText = typeof res === 'string' ? res : res || 'Sorry, I could not generate a response.'
      const botMsg: Message = { id: `bot-${Date.now()}`, text: botText, sender: 'bot' }
      setMessages((m) => [...m, botMsg])
    } catch (error) {
      console.error('Chat error', error)
      const botMsg: Message = { id: `bot-${Date.now()}`, text: 'Unable to contact chat service.', sender: 'bot' }
      setMessages((m) => [...m, botMsg])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-24px)] h-[600px] flex flex-col rounded-lg shadow-2xl bg-background border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Chat Header */}
          <div className="bg-primary text-white px-4 py-3 font-semibold flex items-center justify-between">
            <span>Chat with Aayu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-primary/80 rounded p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-background overflow-y-scroll [&>div>div]:pr-3">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-3 bg-background">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about Sri Lanka..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="min-h-[40px] resize-none"
              />
              <Button onClick={send} disabled={loading} variant="secondary" size="sm" className="self-end">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
