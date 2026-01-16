import { useState, useRef, useEffect } from 'react'

function ChatPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    history: messages.slice(-10)
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur: ' + (data.message || 'Une erreur est survenue') }])
            }
        } catch (err) {
            console.error('Erreur chat:', err)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion au serveur.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <h1 className="text-2xl font-bold text-white mb-4">Assistant IA</h1>

            <div className="flex-1 bg-dark-soft rounded-lg p-4 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                    <div className="text-gray-500 text-center mt-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>Posez une question à l'assistant</p>
                        <p className="text-sm mt-2">Il peut vous aider avec vos factures, clients, etc.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                        msg.role === 'user'
                                            ? 'bg-white text-dark'
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="animate-pulse">Réflexion en cours...</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-dark-soft border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-white text-dark px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default ChatPage
