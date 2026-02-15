import React, { useEffect, useRef, useState } from 'react'
import { Send, MessageCircle, X, Sparkles, MapPin, RotateCcw } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { chatAPI } from '../../services/api'

type Message = { id: string; text: string; sender: 'user' | 'bot' }

const QUICK_PROMPTS = [
  { icon: '🏛️', label: 'Top attractions' },
  { icon: '🍛', label: 'Local cuisine' },
  { icon: '🎭', label: 'Cultural festivals' },
  { icon: '🏖️', label: 'Best beaches' },
]

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || loading) return

    const userMsg: Message = { id: `user-${Date.now()}`, text, sender: 'user' }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await chatAPI.sendMessage(text)
      const botText = typeof res === 'string' ? res : res || 'Sorry, I could not generate a response.'
      setMessages((m) => [...m, { id: `bot-${Date.now()}`, text: botText, sender: 'bot' }])
    } catch {
      setMessages((m) => [...m, { id: `bot-${Date.now()}`, text: 'Unable to reach Aayu right now. Please try again.', sender: 'bot' }])
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

  const resetChat = () => {
    setMessages([])
    setInput('')
  }

  const showWelcome = messages.length === 0

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 group transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <div className="relative">
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          {/* Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="h-3 w-3 text-amber-900" />
          </span>
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-48px)] flex flex-col rounded-2xl shadow-2xl shadow-black/20 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-4">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-emerald-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">Aayu</h3>
                <p className="text-emerald-100 text-xs">Sri Lankan Travel Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
                title="New conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-emerald-50/50 to-white p-4 space-y-1">
          {showWelcome ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              {/* Welcome Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-gray-900 font-semibold text-lg mb-1">Ayubowan! I'm Aayu</h4>
              <p className="text-gray-500 text-sm mb-6 max-w-[260px] leading-relaxed">
                Your personal Sri Lankan tour guide. Ask me anything about travel, culture, food, or history!
              </p>

              {/* Quick Prompts */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => send(`Tell me about ${prompt.label.toLowerCase()} in Sri Lanka`)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 shadow-sm hover:shadow transition-all text-left group"
                  >
                    <span className="text-lg">{prompt.icon}</span>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700 transition-colors">{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {loading && (
                <div className="flex items-start gap-2.5 py-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-emerald-100 bg-white px-4 py-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                placeholder="Ask about Sri Lanka..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all max-h-[100px] leading-relaxed"
                style={{ minHeight: '42px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 100) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                input.trim() && !loading
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Powered by Aayu AI  ·  Sri Lankan Travel Assistant
          </p>
        </div>
      </div>
    </>
  )
}
