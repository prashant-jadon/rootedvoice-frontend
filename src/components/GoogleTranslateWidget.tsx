'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

declare global {
    interface Window {
        google?: any
        googleTranslateElementInit?: () => void
    }
}

export default function GoogleTranslateWidget() {
    const [isLoaded, setIsLoaded] = useState(false)

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

    return (
        <div className="google-translate-widget">
            <div className="translate-widget-header">
                <Globe className="translate-icon" />
                <span className="translate-label">Translate</span>
            </div>
            <div id="google_translate_element"></div>
        </div>
    )
}
