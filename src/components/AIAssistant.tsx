import { startTransition, useState } from 'react'

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

interface AssistantProps {
  title?: string
  description?: string
  initialMessage: string
  placeholder?: string
  suggestions?: string[]
  generateResponse: (question: string) => Promise<string> | string
}

export default function AIAssistant({
  title = 'Ask ERP',
  description = 'Ask simple questions about the information on this page.',
  initialMessage,
  placeholder = 'Ask about the information on this page',
  suggestions = [],
  generateResponse
}: AssistantProps) {
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'assistant-intro',
      role: 'assistant',
      content: initialMessage
    }
  ])

  async function ask(question: string) {
    if (!question.trim()) {
      return
    }

    const sanitizedQuestion = question.trim()
    setLoading(true)

    try {
      const response = await Promise.resolve(generateResponse(sanitizedQuestion))

      startTransition(() => {
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: 'user', content: sanitizedQuestion },
          { id: crypto.randomUUID(), role: 'assistant', content: response }
        ])
        setDraft('')
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAsk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await ask(draft)
  }

  return (
    <section className="assistant-card">
      <div className="assistant-card__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {suggestions.length > 0 ? (
        <div className="assistant-card__suggestions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" className="ghost-button" onClick={() => void ask(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
      <div className="assistant-card__messages">
        {messages.map((message) => (
          <div key={message.id} className={`assistant-card__message assistant-card__message--${message.role}`}>
            <span>{message.role === 'assistant' ? 'ERP Assistant' : 'You'}</span>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form className="assistant-card__composer" onSubmit={handleAsk}>
        <input
          className="input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Getting answer...' : 'Ask'}
        </button>
      </form>
    </section>
  )
}
