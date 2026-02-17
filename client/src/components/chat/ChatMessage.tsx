import * as React from 'react'
import { MapPin } from 'lucide-react'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex gap-2.5 items-start py-1 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-[10px] font-bold">Y</span>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md shadow-emerald-500/15'
            : 'bg-white border border-emerald-100 text-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
