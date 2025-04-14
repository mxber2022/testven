import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ReactNode, useEffect } from 'react'

// Set up default messages
i18n.load({
  en: {} 
})
i18n.activate('en')

interface I18nProviderWrapperProps {
  children: ReactNode
}

export const I18nProviderWrapper = ({ children }: I18nProviderWrapperProps) => {
  useEffect(() => {
    // Load messages on component mount
    const loadMessages = async () => {
      try {
        // Import dynamically
        const englishMessages = await fetch('/locales/en.js')
          .then(response => response.text())
          .then(text => {
            // Extract the JSON from the CommonJS module
            const jsonStr = text.match(/JSON\.parse\((.*?)\)\}\;/)?.[1]
            if (jsonStr) {
              return JSON.parse(JSON.parse(jsonStr))
            }
            return {}
          })
          .catch(error => {
            console.error('Failed to parse messages:', error)
            return {}
          })

        // Load the messages
        i18n.load({
          en: englishMessages
        })
        i18n.activate('en')
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }

    loadMessages()
  }, [])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}

export default i18n
