import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'

/**
 * Component that will trigger analytics data on route changes
 */
const RouteAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page view in Mixpanel
    try {
      if (mixpanel && typeof mixpanel.track === 'function') {
        mixpanel.track('Page View', {
          page: location.pathname,
          url: window.location.href,
        })
      }

      // Track for Google Analytics if it exists
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_title: document.title,
        })
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }, [location])

  return null
}

export default RouteAnalytics

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
