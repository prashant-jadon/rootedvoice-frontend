'use client'

import { useEffect, useState } from 'react'

/**
 * Accessibility Features Component
 * Implements AI-powered accessibility features
 */
export default function AccessibilityFeatures() {
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState<any>(null)

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        setSpeechRecognition(recognition)
      }
    }

    // Generate AI alt text for images without alt attributes
    generateAltTextForImages()

    // Add keyboard navigation enhancements
    enhanceKeyboardNavigation()

    // Add focus indicators
    enhanceFocusIndicators()
  }, [])

  // Generate AI alt text for images
  const generateAltTextForImages = () => {
    if (typeof window === 'undefined') return

    const images = document.querySelectorAll('img:not([alt])')
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement
      // Simulate AI-generated alt text (in production, use AI service)
      const altText = generateAltTextFromImage(imageElement)
      if (altText) {
        imageElement.setAttribute('alt', altText)
        imageElement.setAttribute('data-ai-alt', 'true')
      }
    })
  }

  // Simulate AI alt text generation
  const generateAltTextFromImage = (img: HTMLImageElement): string => {
    // In production, this would call an AI service
    // For now, use image attributes and context
    const src = img.src || ''
    const className = img.className || ''
    
    if (src.includes('therapist') || className.includes('therapist')) {
      return 'Professional therapist providing speech therapy services'
    }
    if (src.includes('client') || className.includes('client')) {
      return 'Client receiving speech therapy session'
    }
    if (src.includes('logo')) {
      return 'Rooted Voices logo'
    }
    return 'Image related to speech and language therapy'
  }

  // Enhance keyboard navigation
  const enhanceKeyboardNavigation = () => {
    if (typeof window === 'undefined') return

    document.addEventListener('keydown', (e) => {
      // Skip navigation for input fields
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      // Arrow key navigation for cards/items
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const focusableElements = Array.from(
          document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
        ) as HTMLElement[]
        
        const currentIndex = focusableElements.indexOf(e.target as HTMLElement)
        if (currentIndex !== -1) {
          const nextIndex = e.key === 'ArrowRight' 
            ? (currentIndex + 1) % focusableElements.length
            : (currentIndex - 1 + focusableElements.length) % focusableElements.length
          focusableElements[nextIndex]?.focus()
          e.preventDefault()
        }
      }
    })
  }

  // Enhance focus indicators
  const enhanceFocusIndicators = () => {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = `
      *:focus-visible {
        outline: 3px solid #000 !important;
        outline-offset: 2px !important;
        border-radius: 4px;
      }
      .ai-focus-indicator {
        position: relative;
      }
      .ai-focus-indicator::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 3px solid #000;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }
      .ai-focus-indicator:focus-visible::after {
        opacity: 1;
      }
    `
    document.head.appendChild(style)
  }

  // Voice command handler
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()

    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      const page = lowerCommand.split('to')[1]?.trim()
      if (page) {
        const routes: { [key: string]: string } = {
          'home': '/',
          'dashboard': '/dashboard',
          'login': '/login',
          'signup': '/signup',
          'therapists': '/meet-our-therapists',
          'pricing': '/pricing',
          'services': '/services',
        }
        const route = routes[page] || routes[page.replace(/\s+/g, '-')]
        if (route) {
          window.location.href = route
        }
      }
    }

    // Action commands
    if (lowerCommand.includes('search')) {
      const searchTerm = lowerCommand.split('search')[1]?.trim()
      if (searchTerm) {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement
        if (searchInput) {
          searchInput.value = searchTerm
          searchInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    }

    // Help command
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      alert('Voice commands available:\n- "Go to [page name]" - Navigate\n- "Search [term]" - Search\n- "Help" - Show this message')
    }
  }

  // Initialize voice commands
  useEffect(() => {
    if (!speechRecognition) return

    const handleVoiceActivation = () => {
      if (voiceCommandsEnabled && speechRecognition) {
        speechRecognition.start()
      }
    }

    // Listen for "Hey Rooted Voices" activation
    const activationPhrase = 'hey rooted voices'
    let activationBuffer = ''

    const continuousRecognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
    continuousRecognition.continuous = true
    continuousRecognition.interimResults = true
    continuousRecognition.lang = 'en-US'

    continuousRecognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase()
        activationBuffer += transcript + ' '

        // Check for activation phrase
        if (activationBuffer.includes(activationPhrase)) {
          activationBuffer = ''
          handleVoiceActivation()
        }

        // Process final results
        if (event.results[i].isFinal) {
          handleVoiceCommand(transcript)
        }
      }
    }

    if (voiceCommandsEnabled) {
      continuousRecognition.start()
    }

    return () => {
      continuousRecognition.stop()
    }
  }, [voiceCommandsEnabled, speechRecognition])

  // Toggle voice commands
  const toggleVoiceCommands = () => {
    setVoiceCommandsEnabled(!voiceCommandsEnabled)
    if (!voiceCommandsEnabled) {
      alert('Voice commands enabled! Say "Hey Rooted Voices" followed by your command.')
    }
  }

  return (
    <div className="accessibility-controls" style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={toggleVoiceCommands}
        className="bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-gray-800 transition-colors"
        aria-label={voiceCommandsEnabled ? 'Disable voice commands' : 'Enable voice commands'}
        title={voiceCommandsEnabled ? 'Voice commands enabled. Say "Hey Rooted Voices" to activate.' : 'Enable voice commands'}
      >
        {voiceCommandsEnabled ? '🎤 Voice On' : '🎤 Voice Off'}
      </button>
    </div>
  )
}

