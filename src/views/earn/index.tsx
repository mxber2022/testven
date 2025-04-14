import React from 'react'
import { Box } from 'theme-ui'
import Trading from './components/trading/Trading'
import mixpanel from 'mixpanel-browser'

const TradingView = () => {
  React.useEffect(() => {
    try {
      // Track page view with Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: 'Trading View',
          page_location: window.location.href,
          page_path: window.location.pathname,
        })
      }
      
      // Track with Mixpanel
      if (mixpanel && typeof mixpanel.track === 'function') {
        mixpanel.track('Visited Trading Page')
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }, [])

  return (
    <Box className="h-screen">
      <Trading />
    </Box>
  )
}

// Add TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (command: string, action: string, params: any) => void
  }
}

export default TradingView
