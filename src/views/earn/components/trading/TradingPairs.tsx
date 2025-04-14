import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { TradingPair } from './types'
import { cn } from '@/lib/utils'

interface TradingPairsProps {
  isOpen: boolean
  onClose: () => void
  onSelectPair: (pair: TradingPair) => void
  className?: string
}

const TRADING_PAIRS: TradingPair[] = [
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    price: 87318.2,
    change24h: 3.53,
    volume24h: 5690356.82,
    openInterest: 758474.77,
    maxLeverage: 100,
    category: 'blue-chip'
  },
  {
    symbol: 'ETH-USD',
    name: 'Ethereum',
    price: 2088.36,
    change24h: 3.71,
    volume24h: 993505.73,
    openInterest: 257921.56,
    maxLeverage: 100,
    category: 'blue-chip'
  },
  {
    symbol: 'SOL-USD',
    name: 'Solana',
    price: 140.05,
    change24h: 6.52,
    volume24h: 266675.76,
    openInterest: 33331.1,
    maxLeverage: 40,
    category: 'blue-chip'
  },
]

const TradingPairs: React.FC<TradingPairsProps> = ({
  isOpen,
  onClose,
  onSelectPair,
  className
}) => {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'blue-chip', label: 'Blue Chip Crypto' },
    { id: 'memes', label: 'Memes' },
    { id: 'l1s-l2s', label: 'L1s/L2s' },
    { id: 'ai', label: 'AI' },
    { id: 'defi', label: 'DeFi' },
    { id: 'bitcoin-eco', label: 'Bitcoin Eco' },
    { id: 'forex', label: 'Forex' },
    { id: 'commodities', label: 'Commodities' },
  ]

  const filteredPairs = TRADING_PAIRS.filter(pair => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'favorites') return favorites.includes(pair.symbol)
    return pair.category === selectedCategory
  })

  if (!isOpen) return null

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Categories */}
      <div className="flex gap-1 p-2 overflow-x-auto hide-scrollbar border-b border-border">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-3 py-1 text-sm rounded-md whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-border">
        <div></div>
        <div>Pair</div>
        <div className="text-right">Price</div>
        <div className="text-right">24h Change</div>
        <div className="text-right">Market Sentiment</div>
      </div>

      {/* Pairs List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPairs.map(pair => (
          <button
            key={pair.symbol}
            onClick={() => onSelectPair(pair)}
            className="w-full grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-sm hover:bg-accent/50 border-b border-border last:border-0"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(pair.symbol)
              }}
              className={cn(
                "p-1 rounded-md hover:bg-accent/50",
                favorites.includes(pair.symbol) ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Star className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={`/assets/coins/${pair.symbol.split('-')[0].toLowerCase()}.svg`}
                alt={pair.name}
                className="w-5 h-5"
                onError={(e) => {
                  e.currentTarget.src = '/assets/coins/generic.svg'
                }}
              />
              <div className="flex flex-col items-start">
                <span>{pair.symbol}</span>
                <span className="text-xs text-muted-foreground">{pair.name}</span>
              </div>
            </div>
            <div className="text-right font-mono">
              ${pair.price.toLocaleString()}
            </div>
            <div className={cn(
              "text-right",
              pair.change24h >= 0 ? "text-success" : "text-destructive"
            )}>
              {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
            </div>
            <div className="flex items-center justify-end gap-1">
              <div className="flex h-1.5 w-16 rounded-full overflow-hidden bg-destructive/20">
                <div
                  className="bg-success"
                  style={{ width: '51%' }}
                />
              </div>
              <span className="text-xs text-muted-foreground">51%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TradingPairs 