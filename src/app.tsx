import RouteAnalytics from '@/components/utils/route-analytics'
import AccessCode from '@/components/AccessCode'
import TransactionSidebar from 'components/transactions/manager/TransactionSidebar'
import mixpanel from 'mixpanel-browser/src/loaders/loader-module-core'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import ChainProvider from 'state/chain'
import Updater from 'state/updater'
import { ThemeUIProvider } from 'theme-ui'
import { getTokenRoute } from 'utils'
import AppRoutes from './app-routes'
import Layout from './components/layout'
import { Toaster } from './components/ui/sonner'
import { I18nProviderWrapper } from './i18n'
import { theme } from './theme'

// Initialize Mixpanel with safe defaults
const initMixpanel = () => {
  if (typeof mixpanel === 'undefined') {
    console.warn('Mixpanel not available')
    return
  }

  try {
    // Check if already initialized
    if (mixpanel.__loaded) {
      return
    }

    const MIXPANEL_KEY = import.meta.env.VITE_MIXPANEL_KEY
    if (!MIXPANEL_KEY) {
      console.warn('Mixpanel key not found in environment variables')
      return
    }

    const MIXPANEL_CONFIG = {
      debug: import.meta.env.DEV,
      track_pageview: true,
      persistence: 'localStorage',
      api_host: 'https://api-js.mixpanel.com',
      ignore_dnt: true,
      batch_requests: true,
      disable_all_events: false, // Ensure this is explicitly set
      loaded: (mixpanel: any) => {
        mixpanel.__loaded = true
      }
    }

    mixpanel.init(MIXPANEL_KEY, MIXPANEL_CONFIG)
  } catch (error) {
    console.warn('Mixpanel initialization failed:', error)
  }
}

// Initialize Mixpanel
if (typeof window !== 'undefined') {
  initMixpanel()
}

// Support for old routes redirects
const Redirects = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const search = new URL(window.location.href.replace('/#/', '/'))
      .searchParams
    const token = search.get('token')
    const chain = search.get('chainId')

    if (token && chain) {
      navigate(getTokenRoute(token, +chain))
    }
  }, [])

  return null
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    document.getElementById('app-container')?.scrollTo(0, 0)
  }, [pathname])

  return null
}

const handleError = (error: Error) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    window.location.reload()
  } else {
    console.error(error)
  }
}

function FallbackUI({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="bg-secondary flex flex-col gap-4 justify-center items-center">
      <div className="bg-card container rounded-3xl p-4">
        <h1 className="text-3xl text-center mb-2">
          An unexpected error ocurred
        </h1>
        <p className="text-destructive">Error: {error.message}</p>
        <div className="flex justify-center mt-4 items-center gap-2">
          <button
            onClick={() => {
              window.location.reload()
            }}
            className="bg-primary text-primary-foreground rounded-full px-4 py-2"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * App Entry point
 *
 * @returns {JSX.Element}
 */
const App = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(
    sessionStorage.getItem('venice_access_granted') === 'true'
  )

  // For all paths except explicit /access-code path
  // Force users to go through access code check if they don't have access
  if (!hasAccess) {
    return (
      <AccessCode onSuccess={() => {
        setHasAccess(true)
        sessionStorage.setItem('venice_access_granted', 'true')
      }} />
    )
  }

  return (
    <ErrorBoundary FallbackComponent={FallbackUI} onError={handleError}>
      <Router>
        <RouteAnalytics />
        <Redirects />
        <ScrollToTop />
        <ThemeUIProvider theme={theme}>
          <I18nProviderWrapper>
            <ChainProvider>
              <Updater />
              <Layout>
                <Toaster />
                <AppRoutes />
              </Layout>
            </ChainProvider>
          </I18nProviderWrapper>
        </ThemeUIProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
