import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout'
import { ROUTES } from '@/utils/constants'

// Lazy load views
const LoginView = lazy(() => import('@/views/login'))
const TokensView = lazy(() => import('@/views/tokens'))
const TokenView = lazy(() => import('@/views/token'))
const DtfsView = lazy(() => import('@/views/dtfs'))
const IndexDtfView = lazy(() => import('@/views/index-dtf'))
const YieldDtfView = lazy(() => import('@/views/yield-dtf'))
const WalletConnectionView = lazy(() => import('@/views/wallet'))
const PortfolioView = lazy(() => import('@/views/portfolio'))
const EarnView = lazy(() => import('@/views/earn'))
const ContractRegistryView = lazy(() => import('@/views/contract-registry'))
const TermsView = lazy(() => import('@/views/terms'))
const LendingView = lazy(() => import('@/views/lending'))
const LendingDetailView = lazy(() => import('@/views/lending/detail'))
const CreateNewDTFView = lazy(() => import('@/views/create-new-dtf'))

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginView />} />
      <Route path={ROUTES.TERMS} element={<TermsView />} />
      <Route element={<Layout />}>
        <Route path={ROUTES.WALLET} element={<WalletConnectionView />} />
        <Route path={ROUTES.TOKENS} element={<TokensView />} />
        <Route path={`${ROUTES.TOKENS}/:symbol`} element={<TokenView />} />
        <Route path={ROUTES.DTFS} element={<DtfsView />} />
        <Route path={`${ROUTES.INDEX_DTF}/:dtf`} element={<IndexDtfView />} />
        <Route path={`${ROUTES.YIELD_DTF}/:dtf`} element={<YieldDtfView />} />
        <Route path={ROUTES.PORTFOLIO} element={<PortfolioView />} />
        <Route path={ROUTES.EARN} element={<EarnView />} />
        <Route path={ROUTES.REGISTRY} element={<ContractRegistryView />} />
        <Route path={ROUTES.LENDING} element={<LendingView />} />
        <Route path={`${ROUTES.LENDING}/:type/:id`} element={<LendingDetailView />} />
        <Route path={ROUTES.CREATE_DTF} element={<CreateNewDTFView />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes 