import mixpanel from 'mixpanel-browser/src/loaders/loader-module-core'
import { useEffect } from 'react'

const isMixpanelInitialized = () => {
  try {
    return mixpanel && typeof mixpanel.track === 'function'
  } catch {
    return false
  }
}

export const trackClick = (
  page: string,
  ctaLabel: string,
  ca?: string,
  ticker?: string,
  chain?: string | number
) => {
  if (!isMixpanelInitialized()) return

  try {
    mixpanel.track('tap', {
      page,
      cta: ctaLabel,
      ca,
      ticker,
      chain,
    })
  } catch (error) {
    console.warn('Failed to track click:', error)
  }
}

const useTrackPage = (page: string, subpage?: string) => {
  useEffect(() => {
    if (!isMixpanelInitialized()) return

    try {
      mixpanel.track_pageview({
        page,
        subpage,
      })
    } catch (error) {
      console.warn('Failed to track page view:', error)
    }
  }, [page, subpage])

  return null
}

export default useTrackPage
