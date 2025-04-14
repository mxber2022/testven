import React, { useState } from 'react'
import { ChevronDown, Save, RotateCcw, Maximize2, Share2, Search } from 'lucide-react'
import TradingChart from './TradingChart'
import TradingPairs from './TradingPairs'
import TradingForm from './TradingForm'
import { TradingPair } from './types'
import { cn } from '@/lib/utils'

const Trading: React.FC = () => {
  const [isSelectingPair, setIsSelectingPair] = useState(false)
  const [selectedPair, setSelectedPair] = useState<TradingPair>({
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    price: 87318.2,
    change24h: 3.53,
    volume24h: 5690356.82,
    openInterest: 758474.77,
    maxLeverage: 100,
    category: 'blue-chip'
  })
  const [timeframe, setTimeframe] = useState('1m')

  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair)
    setIsSelectingPair(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          {/* Asset Selector */}
          <div className="relative">
            <button
              onClick={() => setIsSelectingPair(!isSelectingPair)}
              className="flex items-center gap-2 hover:bg-accent/50 rounded-md px-2 py-1.5"
            >
              <img 
                src={`/assets/coins/${selectedPair.symbol.split('-')[0].toLowerCase()}.svg`}
                alt={selectedPair.name}
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.src = '/assets/coins/generic.svg'
                }}
              />
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedPair.symbol}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn(
                    selectedPair.change24h >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {selectedPair.change24h >= 0 ? '+' : ''}{selectedPair.change24h}%
                  </span>
                  <span className="text-muted-foreground">
                    ${selectedPair.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {isSelectingPair && (
              <div className="absolute top-full left-0 mt-1 w-[calc(100vw-350px)] bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search markets..."
                      className="w-full pl-8 pr-4 py-1.5 bg-accent/50 border-0 rounded-md text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <TradingPairs
                  isOpen={true}
                  onClose={() => setIsSelectingPair(false)}
                  onSelectPair={handleSelectPair}
                  className="max-h-[calc(100vh-16rem)] overflow-y-auto"
                />
              </div>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 text-sm">
            {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-2 py-1 rounded-md",
                  timeframe === tf 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Chart */}
        <div className="flex-1 relative">
          <TradingChart 
            symbol={selectedPair.symbol} 
            timeframe={timeframe}
          />
        </div>

        {/* Trading Form */}
        <div className="w-[350px] border-l border-border overflow-y-auto">
          <TradingForm pair={selectedPair} />
        </div>
      </div>

      {/* Market Stats */}
      <div className="flex items-center justify-between px-4 h-10 border-t border-border text-sm shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-muted-foreground">24h Volume:</span>{' '}
            <span>${(selectedPair.volume24h/1000).toFixed(1)}K</span>
          </div>
          <div>
            <span className="text-muted-foreground">Open Interest:</span>{' '}
            <span>${(selectedPair.openInterest/1000).toFixed(1)}K</span>
          </div>
          <div>
            <span className="text-muted-foreground">Funding Rate:</span>{' '}
            <span>0.01%</span>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Market Sentiment:</span>{' '}
          <span className="text-success">51%</span> / <span className="text-destructive">49%</span>
        </div>
      </div>
    </div>
  )
}

export default Trading 