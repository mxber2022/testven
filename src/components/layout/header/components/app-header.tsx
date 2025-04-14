import Account from 'components/account'
import Brand from './Brand'
import CoinbaseSubscribe from './CoinbaseSubscribe'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppNavigation from './app-navigation'
import { useColorMode } from 'theme-ui'

const Container = ({ children }: { children: ReactNode }) => {
  // Check if the route is a "index-dtf" route
  const { pathname } = useLocation()

  const border = !pathname.includes('index-dtf') || pathname.includes('deploy')

  return (
    <div className={cn('w-full flex-shrink-0', border && 'border-b')}>
      {children}
    </div>
  )
}

/**
 * Application header
 */
const AppHeader = () => (
  <Container>
    <div className="container flex items-center h-[56px] md:h-[72px] px-4 sm:px-6">
      <Brand className="text-primary mr-2 sm:mr-4 cursor-pointer md:-mt-1" />
      <AppNavigation />
      <div className="ml-auto"></div>
      <Account />
    </div>
  </Container>
)

export default AppHeader
