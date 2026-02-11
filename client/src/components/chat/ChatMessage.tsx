import * as React from 'react'
import { Avatar } from '../ui/avatar'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm">A</div>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted/60 text-muted-foreground'
        }`}
      >
        {message.text}
      </div>

      {isUser && (
        <Avatar>
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">Y</div>
        </Avatar>
      )}
    </div>
  )
}
