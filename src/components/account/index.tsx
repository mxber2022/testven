import Button from '@/components/old/button'
import { MouseoverTooltipContent } from '@/components/old/tooltip'
import Staking from '@/views/index-dtf/overview/components/staking'
import PortfolioSidebar from '@/views/portfolio/sidebar'
import { Trans } from '@lingui/macro'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ChainLogo from 'components/icons/ChainLogo'
import { useAtomValue } from 'jotai'
import { AlertCircle, Menu, Wallet, Power } from 'lucide-react'
import { ReactNode } from 'react'
import { chainIdAtom, selectedRTokenAtom } from 'state/atoms'
import { Box, Card, Flex, Text } from 'theme-ui'

const ErrorWrapper = ({
  chainId,
  children,
  isValid,
  currentChain,
}: {
  isValid: boolean
  chainId?: number
  children: ReactNode
  currentChain: number
}) =>
  isValid ? (
    <>{children}</>
  ) : (
    <MouseoverTooltipContent
      content={
        <Card sx={{ width: 320, border: '1px solid black' }}>
          <Text sx={{ fontWeight: 400 }} variant="legend">
            <Trans>Network</Trans>
          </Text>
          <Flex my={2} variant="layout.verticalAlign">
            <AlertCircle size={18} color="#FF0000" />
            <Text ml={2}>Chain: {chainId}</Text>
            <Text ml="auto" sx={{ fontWeight: 500 }}>
              <Trans>Unsupported</Trans>
            </Text>
          </Flex>
          <Text variant="legend" sx={{ fontSize: 1 }}>
            <Trans>
              The configured network "{currentChain}" is different from the
              wallet selected network "{chainId}"". Change your network in the
              connected wallet.
            </Trans>
          </Text>
        </Card>
      }
    >
      {children}
    </MouseoverTooltipContent>
  )

/**
 * Account
 *
 * Handles wallet interaction
 */
const Account = () => {
  const chainId = useAtomValue(chainIdAtom)
  const isTokenSelected = !!useAtomValue(selectedRTokenAtom)

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain
        const invalidChain =
          isTokenSelected && connected && chain.id !== chainId

        return (
          <Box
            {...(!ready && {
              'aria-hidden': true,
              sx: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    <span className="hidden md:inline">Connect</span>
                    <span className="md:hidden">
                      <Power size={16} />
                    </span>
                  </button>
                )
              }

              return (
                <ErrorWrapper
                  isValid={!invalidChain}
                  chainId={chain.id}
                  currentChain={chainId}
                >
                  <PortfolioSidebar>
                    <div className="flex items-center cursor-pointer">
                      <div className="flex items-center relative">
                        <div className="flex items-center absolute lg:relative -bottom-1 -right-1 lg:bottom-0 lg:right-0">
                          {!invalidChain ? (
                            <ChainLogo
                              chain={chain.id}
                              className="w-3 h-3 lg:w-4 lg:h-4"
                            />
                          ) : (
                            <AlertCircle
                              fill="#FF0000"
                              color="#fff"
                              className="w-3 h-3 lg:w-4 lg:h-4"
                            />
                          )}
                        </div>

                        <span className="hidden lg:inline ml-2 text-foreground">
                          {account.displayName}
                        </span>

                        <div className="lg:ml-3 p-2 border border-border bg-card rounded-xl text-foreground">
                          <Wallet size={16} />
                        </div>
                      </div>
                    </div>
                  </PortfolioSidebar>
                  <Staking />
                </ErrorWrapper>
              )
            })()}
          </Box>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default Account
