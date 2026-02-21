'use client'

import { useEffect, useState, useRef } from 'react'
import { Globe, X } from 'lucide-react'

declare global {
    interface Window {
        google?: any
        googleTranslateElementInit?: () => void
    }
}

export default function GoogleTranslateWidget() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const widgetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Load Google Translate script
        const addScript = () => {
            if (document.getElementById('google-translate-script')) {
                return
            }

            const script = document.createElement('script')
            script.id = 'google-translate-script'
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.body.appendChild(script)
        }

        // Initialize Google Translate Element
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,es,fr,de,zh-CN,ja,ko,ar,pt,hi,ru,it,nl,pl,tr,vi,bn,ta,te,mr,ur,pa',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                )
                setIsLoaded(true)
            }
        }

        // Add script after component mounts
        addScript()

        // Cleanup function
        return () => {
            // Remove the script if component unmounts
            const script = document.getElementById('google-translate-script')
            if (script) {
                script.remove()
            }
            delete window.googleTranslateElementInit
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={widgetRef}
            className={`google-translate-widget ${isOpen ? 'is-open' : 'is-closed'}`}
            onClick={() => !isOpen && setIsOpen(true)}
        >
            <div className="translate-widget-header" onClick={() => isOpen && setIsOpen(false)}>
                <Globe className="translate-icon" />
                {isOpen && (
                    <>
                        <span className="translate-label">Translate</span>
                        <button
                            className="ml-auto p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
            <div id="google_translate_element" className={isOpen ? 'block' : 'hidden'}></div>
        </div>
    )
}
