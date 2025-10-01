'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'support',
      text: 'Hi! Welcome to Rooted Voices. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'support',
          text: 'Thanks for your message! A team member will respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      }, 1000)
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 ${
              isMinimized ? 'w-80' : 'w-96'
            }`}
            style={{ height: isMinimized ? '60px' : '500px' }}
          >
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">Support Team</h3>
                  <p className="text-xs text-gray-300">Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-[360px] overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                    <button
                      onClick={handleSend}
                      className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
