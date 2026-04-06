import { useEffect, useRef, useState } from 'react'

function ChatbotPanel({ open, onClose }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am your PC Builder assistant. Ask me anything.' },
  ])
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
  }, [input])

  const submitPrompt = () => {
    const value = input.trim()
    if (!value) return

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: value },
      { role: 'assistant', text: 'Got it. I can help you pick parts or optimize your build.' },
    ])
    setInput('')
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitPrompt()
    }
  }

  return (
    <div className={`chatbot-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="chatbot-backdrop" onClick={onClose} />

      <section className="chatbot-panel" role="dialog" aria-modal="true" aria-label="Chatbot">
        <header className="chatbot-header">
          <p>PC Builder Chatbot</p>
          <button type="button" className="chatbot-close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`chatbot-message ${message.role === 'user' ? 'is-user' : 'is-assistant'}`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="prompt-shell">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything..."
            rows={1}
          />

          <div className="prompt-actions">
            <button type="button" className="prompt-send" onClick={submitPrompt}>
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ChatbotPanel
