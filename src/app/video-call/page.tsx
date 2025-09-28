'use client'

import { motion } from 'framer-motion'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageCircle, 
  Share, 
  Settings, 
  Users, 
  Clock, 
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Monitor,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Download,
  Camera,
  CameraOff
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function VideoCallPage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Dummy data
  const sessionInfo = {
    client: 'Sarah Johnson',
    type: 'Speech Therapy',
    duration: 45,
    startTime: '10:00 AM',
    notes: 'Working on articulation exercises for /r/ sounds'
  }

  const participants = [
    { id: 1, name: 'Dr. Rebecca Smith', role: 'Therapist', isVideoOn: true, isMicOn: true },
    { id: 2, name: 'Sarah Johnson', role: 'Client', isVideoOn: true, isMicOn: true }
  ]

  const chatMessages = [
    { id: 1, sender: 'Dr. Rebecca Smith', message: 'Welcome Sarah! How are you feeling today?', time: '10:00 AM', isTherapist: true },
    { id: 2, sender: 'Sarah Johnson', message: 'Hi Dr. Smith! I\'m doing well, thank you. Ready to work on my exercises.', time: '10:01 AM', isTherapist: false },
    { id: 3, sender: 'Dr. Rebecca Smith', message: 'Great! Let\'s start with the warm-up exercises we practiced last week.', time: '10:02 AM', isTherapist: true }
  ]

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    // Handle end call logic
    console.log('Ending call...')
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle send message logic
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  return (
    <div className={`min-h-screen bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-semibold">Rooted Voices</span>
            </Link>
            <span className="text-gray-400">/</span>
            <div className="text-white">
              <h1 className="text-lg font-semibold">{sessionInfo.client}</h1>
              <p className="text-sm text-gray-300">{sessionInfo.type}</p>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTime(callDuration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowChat(!showChat)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex h-screen">
        {/* Primary Video */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold">SJ</span>
                  </div>
                  <h2 className="text-2xl font-semibold">{sessionInfo.client}</h2>
                  <p className="text-gray-300">Client View</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-20 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}

          {/* Session Notes Overlay */}
          <div className="absolute bottom-20 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-sm">
            <h3 className="font-semibold mb-2">Session Notes</h3>
            <p className="text-sm text-gray-300">{sessionInfo.notes}</p>
          </div>
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants) && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-l border-gray-200 flex flex-col"
          >
            {showChat && (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-black">Chat</h3>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isTherapist ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        message.isTherapist 
                          ? 'bg-black text-white' 
                          : 'bg-gray-100 text-black'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {showParticipants && (
              <>
                {/* Participants Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-black">Participants</h3>
                </div>

                {/* Participants List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-black">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {participant.isVideoOn ? (
                          <Video className="w-4 h-4 text-green-500" />
                        ) : (
                          <VideoOff className="w-4 h-4 text-gray-400" />
                        )}
                        {participant.isMicOn ? (
                          <Mic className="w-4 h-4 text-green-500" />
                        ) : (
                          <MicOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-center p-6">
          <div className="flex items-center space-x-4">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition-colors ${
                isMicOn 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <Monitor className="w-6 h-6" />
            </button>

            {/* Recording */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-4 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <div className="w-6 h-6 border-2 border-current rounded-full" />
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Session Summary Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-black mb-2">Session Complete</h3>
            <p className="text-gray-600">Session with {sessionInfo.client} has ended</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{formatTime(callDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-semibold">{sessionInfo.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600">Completed</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Save Session Notes
            </button>
            <button className="w-full py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Follow-up
            </button>
            <button className="w-full py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors">
              Download Recording
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
