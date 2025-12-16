'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Minimize2, Maximize2, Paperclip, FileText, Image, Download } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { messageAPI } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'
import io, { Socket } from 'socket.io-client'

export default function LiveChatWidget() {
  const { user, isAuthenticated } = useAuth()
  const t = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [supportUserId, setSupportUserId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize Socket.io connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token')
      if (token) {
        const apiUrl = typeof window !== 'undefined' 
          ? (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://api.rootedvoices.com')
          : 'http://localhost:5001'
        const socket = io(apiUrl, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        })

        socket.on('connect', () => {
          console.log('Connected to chat server')
        })

        socket.on('new-message', (message: any) => {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m._id === message._id)) {
              return prev
            }
            return [...prev, message]
          })
          scrollToBottom()
        })

        socket.on('message-sent', (message: any) => {
          setMessages(prev => {
            // Update message if it exists, otherwise add it
            const index = prev.findIndex(m => m._id === message._id || (m.tempId && m.tempId === message.tempId))
            if (index >= 0) {
              const updated = [...prev]
              updated[index] = message
              return updated
            }
            return [...prev, message]
          })
          scrollToBottom()
        })

        socket.on('user-typing', (data: any) => {
          if (data.userId !== user?.id) {
            setIsTyping(data.isTyping)
          }
        })

        socket.on('message-error', (error: any) => {
          console.error('Message error:', error)
          alert('Failed to send message: ' + (error.error || 'Unknown error'))
        })

        socket.on('disconnect', () => {
          console.log('Disconnected from chat server')
        })

        socketRef.current = socket

        return () => {
          socket.disconnect()
        }
      }
    }
  }, [isAuthenticated, user])

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      loadChatHistory()
    }
  }, [isOpen, isAuthenticated, user])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      setIsLoading(true)
      
      // Get or create support agent
      const supportRes = await messageAPI.getSupportAgent()
      const supportAgent = supportRes.data.data
      setSupportUserId(supportAgent._id)
      
      // Get conversations
      const conversationsRes = await messageAPI.getConversations()
      
      if (conversationsRes.data.data && conversationsRes.data.data.length > 0) {
        // Find support conversation
        const supportConversation = conversationsRes.data.data.find(
          (conv: any) => conv.participant?._id === supportAgent._id || conv.isSupport
        )
        
        if (supportConversation && supportConversation.messages) {
          setMessages(supportConversation.messages || [])
        } else {
          // Get messages with support agent
          const messagesRes = await messageAPI.getMessages(supportAgent._id)
          setMessages(messagesRes.data.data || [])
        }
      } else {
        // Show welcome message if no conversation exists
        setMessages([{
          _id: 'welcome',
          senderId: { firstName: 'Support', lastName: 'Team', _id: supportAgent._id },
          content: 'Hi! Welcome to Rooted Voices. How can I help you today?',
          createdAt: new Date(),
        }])
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Show welcome message on error
      setMessages([{
        _id: 'welcome',
        senderId: { firstName: 'Support', lastName: 'Team' },
        content: 'Hi! Welcome to Rooted Voices. How can I help you today?',
        createdAt: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || !isAuthenticated || !user || !supportUserId) {
      return
    }

    try {
      setIsUploading(true)
      
      // Upload files if any
      let attachments: any[] = []
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        formData.append('receiverId', supportUserId)
        formData.append('content', message || 'Shared file')
        formData.append('type', 'file')
        
        selectedFiles.forEach((file) => {
          formData.append('attachments', file)
        })

        const response = await messageAPI.sendMessageWithFiles(formData)
        const newMessage = response.data.data
        
        setMessages(prev => [...prev, newMessage])
        setMessage('')
        setSelectedFiles([])
        
        // Emit socket event
        if (socketRef.current) {
          socketRef.current.emit('send-message', {
            receiverId: supportUserId,
            content: message || 'Shared file',
            attachments: newMessage.attachments,
          })
        }
      } else {
        // Send text message
        const response = await messageAPI.sendMessage(supportUserId, message, 'text')
        const newMessage = response.data.data
        
        // Add temporary message for immediate UI update
        const tempMessage = {
          ...newMessage,
          tempId: `temp-${Date.now()}`,
        }
        setMessages(prev => [...prev, tempMessage])
        setMessage('')
        
        // Emit socket event for real-time delivery
        if (socketRef.current) {
          socketRef.current.emit('send-message', {
            receiverId: supportUserId,
            content: message,
          })
        }
      }

      scrollToBottom()
    } catch (error: any) {
      console.error('Failed to send message:', error)
      alert('Failed to send message: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleTyping = () => {
    if (socketRef.current && supportUserId) {
      socketRef.current.emit('typing', {
        conversationId: `support-${supportUserId}`,
        isTyping: true,
      })
      
      // Stop typing after 3 seconds
      setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing', {
            conversationId: `support-${supportUserId}`,
            isTyping: false,
          })
        }
      }, 3000)
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
                  <h3 className="font-semibold">{t('chat.title')}</h3>
                  <p className="text-xs text-gray-300">{t('chat.online')}</p>
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
                <div className="h-[360px] overflow-y-auto p-4 bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((msg, index) => {
                        const isUser = msg.senderId?._id === user?.id || 
                                      (typeof msg.senderId === 'string' && msg.senderId === user?.id) ||
                                      msg.sender === 'user'
                        const isFromCurrentUser = isUser
                        
                        // Check if previous message is from same sender (for grouping)
                        const prevMessage = index > 0 ? messages[index - 1] : null
                        const showAvatar = !prevMessage || 
                          (prevMessage.senderId?._id !== msg.senderId?._id) ||
                          (new Date(msg.createdAt || new Date()).getTime() - new Date(prevMessage.createdAt || new Date()).getTime() > 300000) // 5 minutes
                        
                        const senderName = msg.senderId?.firstName 
                          ? `${msg.senderId.firstName} ${msg.senderId.lastName || ''}`.trim()
                          : 'Support Team'
                        const messageTime = msg.createdAt 
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                        return (
                          <div
                            key={msg._id || msg.id}
                            className={`flex items-end gap-2 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {/* Avatar (only for received messages, on left) */}
                            {!isFromCurrentUser && (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                                {msg.senderId?.avatar ? (
                                  <img src={msg.senderId.avatar} alt="" className="w-full h-full rounded-full" />
                                ) : (
                                  <span className="text-indigo-600 font-medium text-xs">
                                    {senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {/* Message Bubble */}
                            <div className={`flex flex-col ${isFromCurrentUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                              {/* Sender name (only for received messages) */}
                              {!isFromCurrentUser && showAvatar && (
                                <p className="text-xs text-gray-600 mb-1 px-2">
                                  {senderName}
                                </p>
                              )}
                              
                              {/* Message content */}
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isFromCurrentUser
                                    ? 'bg-black text-white rounded-br-sm'
                                    : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{msg.content || msg.text}</p>
                              
                              {/* Attachments */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {msg.attachments.map((attachment: any, idx: number) => (
                                    <a
                                        key={idx}
                                      href={attachment.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                        className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${
                                          isFromCurrentUser
                                            ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                      {attachment.fileType?.startsWith('image/') ? (
                                        <Image className="w-3 h-3" />
                                      ) : (
                                        <FileText className="w-3 h-3" />
                                      )}
                                      <span className="truncate max-w-[200px]">{attachment.fileName}</span>
                                      <Download className="w-3 h-3" />
                                    </a>
                                  ))}
                                </div>
                              )}
                              </div>
                              
                              {/* Timestamp */}
                              <p className={`text-xs mt-1 px-2 ${isFromCurrentUser ? 'text-gray-500' : 'text-gray-500'}`}>
                                {messageTime}
                              </p>
                            </div>
                            
                            {/* Avatar (only for sent messages, on right) */}
                            {isFromCurrentUser && (
                              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mb-1">
                                {user?.avatar ? (
                                  <img src={user.avatar} alt="" className="w-full h-full rounded-full" />
                                ) : (
                                  <span className="text-white font-medium text-xs">
                                    {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex items-end gap-2 justify-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                            <span className="text-indigo-600 font-medium text-xs">ST</span>
                          </div>
                          <div className="bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          <FileText className="w-3 h-3 text-gray-600" />
                          <span className="max-w-[150px] truncate">{file.name}</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        handleTyping()
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      placeholder={isAuthenticated ? t('chat.placeholder') : t('chat.placeholder')}
                      disabled={!isAuthenticated || isUploading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSend}
                      disabled={(!message.trim() && selectedFiles.length === 0) || isUploading}
                      className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
