import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text, Input, Button, Heading, Slider, Label } from 'theme-ui';
import { Search, ChevronDown, Percent, DollarSign, Info, Wallet, Settings, ChevronsUpDown, Star, ChevronUp } from 'lucide-react';
import SurveyOverlay from '../../components/SurveyOverlay';
import { RWA_SURVEY_QUESTIONS, RWA_SURVEY_METADATA } from '../../constants/surveyQuestions';
import useSurveyState from '../../hooks/useSurveyState';

// Asset categories
const CATEGORIES = ['All', 'Blue chip crypto', 'Tradfi', 'Coming soon'];

// Market data structure
interface Market {
  id: string;
  name: string;
  symbol: string;
  tradingViewSymbol: string;
  category: string;
  price?: number;
  change24h?: number;
  sentiment?: {
    long: number;
    short: number;
  };
  liquidity?: string;
  volume24h?: number;
  leverage?: number;
  incentives?: string[];
}

// Define markets
const MARKETS: Market[] = [
  // Blue chip crypto
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    symbol: 'BTC/USD', 
    tradingViewSymbol: 'BITSTAMP:BTCUSD', 
    category: 'Blue chip crypto', 
    price: 71235.48, 
    change24h: 1.23,
    sentiment: { long: 65, short: 35 },
    liquidity: '328,474.77',
    volume24h: 5690356,
    leverage: 100,
    incentives: ['Zero Slippage']
  },
  { 
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH/USD', 
    tradingViewSymbol: 'BITSTAMP:ETHUSD', 
    category: 'Blue chip crypto', 
    price: 3851.72, 
    change24h: -0.58,
    sentiment: { long: 51, short: 49 },
    liquidity: '257,961.04',
    volume24h: 993505.7,
    leverage: 100,
    incentives: []
  },
  { 
    id: 'sol', 
    name: 'Solana', 
    symbol: 'SOL/USD', 
    tradingViewSymbol: 'BINANCE:SOLUSD', 
    category: 'Blue chip crypto', 
    price: 172.39, 
    change24h: 2.34,
    sentiment: { long: 52, short: 48 },
    liquidity: '33,331.11',
    volume24h: 266676.7,
    leverage: 40,
    incentives: []
  },
  { 
    id: 'sui', 
    name: 'Sui', 
    symbol: 'SUI/USD', 
    tradingViewSymbol: 'BINANCE:SUIUSD', 
    category: 'Blue chip crypto', 
    price: 1.43, 
    change24h: -1.21,
    sentiment: { long: 49, short: 51 },
    liquidity: '12,500.00',
    volume24h: 158976.3,
    leverage: 40,
    incentives: []
  },
  { 
    id: 'doge', 
    name: 'Dogecoin', 
    symbol: 'DOGE/USD', 
    tradingViewSymbol: 'BINANCE:DOGEUSD', 
    category: 'Blue chip crypto', 
    price: 0.153, 
    change24h: 0.87,
    sentiment: { long: 60, short: 40 },
    liquidity: '15,400.00',
    volume24h: 145673.2,
    leverage: 40,
    incentives: ['Zero Slippage']
  },
  
  // Tradfi
  { 
    id: 'gold', 
    name: 'Gold', 
    symbol: 'GOLD', 
    tradingViewSymbol: 'OANDA:XAUUSD', 
    category: 'Tradfi', 
    price: 2327.80, 
    change24h: 0.45,
    sentiment: { long: 65, short: 35 },
    liquidity: '52,294.02',
    volume24h: 6494.57,
    leverage: 50
  },
  { 
    id: 'silver', 
    name: 'Silver', 
    symbol: 'SILVER', 
    tradingViewSymbol: 'OANDA:XAGUSD', 
    category: 'Tradfi', 
    price: 27.53, 
    change24h: 0.23,
    sentiment: { long: 60, short: 40 },
    liquidity: '12,345.67',
    volume24h: 5432.10,
    leverage: 50
  },
  { 
    id: 'crude-oil', 
    name: 'Crude Oil', 
    symbol: 'OIL', 
    tradingViewSymbol: 'OANDA:BCOUSD', 
    category: 'Tradfi', 
    price: 75.21, 
    change24h: -1.32,
    sentiment: { long: 14, short: 86 },
    liquidity: '5,143.85',
    volume24h: 0,
    leverage: 20
  },
  { 
    id: 'vix', 
    name: 'VIX', 
    symbol: 'VIX', 
    tradingViewSymbol: 'CAPITALCOM:VIX', 
    category: 'Tradfi', 
    price: 14.72, 
    change24h: 2.13,
    sentiment: { long: 40, short: 60 },
    liquidity: '9,876.54',
    volume24h: 4321.09,
    leverage: 20
  },
  { 
    id: 'sp500', 
    name: 'S&P 500', 
    symbol: 'SPX', 
    tradingViewSymbol: 'FOREXCOM:SPXUSD', 
    category: 'Tradfi', 
    price: 5431.15, 
    change24h: 0.68,
    sentiment: { long: 55, short: 45 },
    liquidity: '15,432.10',
    volume24h: 10987.65,
    leverage: 20
  },
  { 
    id: 'nasdaq', 
    name: 'Nasdaq', 
    symbol: 'NASDAQ', 
    tradingViewSymbol: 'NASDAQ:NDX', 
    category: 'Tradfi', 
    price: 19243.82, 
    change24h: 1.05,
    sentiment: { long: 60, short: 40 },
    liquidity: '18,765.43',
    volume24h: 12345.67,
    leverage: 20
  },
  { 
    id: 'qqq', 
    name: 'QQQ', 
    symbol: 'QQQ', 
    tradingViewSymbol: 'NASDAQ:QQQ', 
    category: 'Tradfi', 
    price: 432.75, 
    change24h: 0.89,
    sentiment: { long: 58, short: 42 },
    liquidity: '8,765.43',
    volume24h: 7654.32,
    leverage: 20
  },
  { 
    id: 'tesla', 
    name: 'Tesla', 
    symbol: 'TSLA', 
    tradingViewSymbol: 'NASDAQ:TSLA', 
    category: 'Tradfi', 
    price: 248.42, 
    change24h: -2.14,
    sentiment: { long: 45, short: 55 },
    liquidity: '7,654.32',
    volume24h: 6543.21,
    leverage: 20
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA', 
    symbol: 'NVDA', 
    tradingViewSymbol: 'NASDAQ:NVDA', 
    category: 'Tradfi', 
    price: 875.28, 
    change24h: 3.45,
    sentiment: { long: 62, short: 38 },
    liquidity: '9,876.54',
    volume24h: 8765.43,
    leverage: 20
  },
  { 
    id: 'apple', 
    name: 'Apple', 
    symbol: 'AAPL', 
    tradingViewSymbol: 'NASDAQ:AAPL', 
    category: 'Tradfi', 
    price: 189.82, 
    change24h: 0.34,
    sentiment: { long: 53, short: 47 },
    liquidity: '8,765.43',
    volume24h: 7654.32,
    leverage: 20
  },
  { 
    id: 'amazon', 
    name: 'Amazon', 
    symbol: 'AMZN', 
    tradingViewSymbol: 'NASDAQ:AMZN', 
    category: 'Tradfi', 
    price: 185.37, 
    change24h: 1.23,
    sentiment: { long: 57, short: 43 },
    liquidity: '7,654.32',
    volume24h: 6543.21,
    leverage: 20
  },
  { 
    id: 'google', 
    name: 'Google', 
    symbol: 'GOOGL', 
    tradingViewSymbol: 'NASDAQ:GOOGL', 
    category: 'Tradfi', 
    price: 169.54, 
    change24h: 0.78,
    sentiment: { long: 54, short: 46 },
    liquidity: '8,765.43',
    volume24h: 7654.32,
    leverage: 20
  },
];

// Trading type options
type TradeType = 'Long' | 'Short';
type OrderType = 'Market' | 'Limit';

// Recent trade interface
interface RecentTrade {
  type: 'OPEN' | 'CLOSE';
  price: number;
  size: number | string;
  time: string;
}

const RECENT_TRADES: RecentTrade[] = [
  { type: 'OPEN', price: 2089.83, size: 39.4, time: '2 mins' },
  { type: 'CLOSE', price: 2087.47, size: 487.2, time: '3 mins' },
  { type: 'OPEN', price: 2086.77, size: 2.5, time: '4 mins' },
  { type: 'OPEN', price: 2088.32, size: 77, time: '4 mins' },
  { type: 'CLOSE', price: 2088.02, size: 11.3, time: '6 mins' },
  { type: 'OPEN', price: 2088.75, size: 11.3, time: '8 mins' },
  { type: 'OPEN', price: 2089.96, size: 125, time: '9 mins' },
  { type: 'CLOSE', price: 2087.87, size: 112.7, time: '12 mins' },
  { type: 'CLOSE', price: 2086.27, size: 295.8, time: '16 mins' },
  { type: 'OPEN', price: 2090.89, size: 487.2, time: '21 mins' },
];

// Add new interface for positions
interface Position {
  value: number;
  entryPrice: number;
  liquidationPrice: number;
  size: number;
  collateral: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
}

// For the TradingView errors, ensure TradingView is imported or defined:
declare global {
  interface Window {
    TradingView: any;
  }
}

const RwaPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(MARKETS[0]);
  const [tradeType, setTradeType] = useState<TradeType>('Long');
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [leverage, setLeverage] = useState<number>(1);
  const [positionSize, setPositionSize] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'chart' | 'trades'>('chart');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showPositionsOnChart, setShowPositionsOnChart] = useState(false);
  const [activePositionsTab, setActivePositionsTab] = useState<'positions' | 'openOrders' | 'history'>('positions');

  // Survey state
  const { shouldShowSurvey, completeSurvey, skipSurvey } = useSurveyState();
  const showRwaSurvey = shouldShowSurvey('rwa');

  // Filter markets based on category and search query
  const filteredMarkets = MARKETS.filter(market => {
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
    const matchesSearch = 
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Load TradingView widget
  useEffect(() => {
    if (selectedMarket && chartContainerRef.current) {
      // Clear previous chart
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
      
      // Create the script element for TradingView widget
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined' && chartContainerRef.current) {
          new window.TradingView.widget({
            autosize: true,
            symbol: selectedMarket.tradingViewSymbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#1C1C24",
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            withdateranges: true,
            container_id: `tv_chart_${selectedMarket.id}`
          });
        }
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Clean up script when component unmounts or market changes
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [selectedMarket]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAssetDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle survey completion
  const handleSurveyComplete = (responses: Record<string, string | string[]>) => {
    completeSurvey('rwa', responses);
  };

  // Handle survey skip
  const handleSurveySkip = () => {
    skipSurvey('rwa');
  };

  return (
    <Box sx={{ 
      bg: '#0B0B0F', 
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      px: 4,
      pt: 4,
      pb: 6
    }}>
      {/* Top bar with asset selector and info */}
      <Flex sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Box sx={{ position: 'relative' }} ref={dropdownRef}>
          <Flex 
            sx={{ 
              alignItems: 'center', 
              gap: 2, 
              bg: 'rgba(255, 255, 255, 0.05)', 
              p: 2, 
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': {
                bg: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
          >
            {selectedMarket && (
              <>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bg: '#1C64F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {selectedMarket.symbol.charAt(0)}
                </Box>
                <Text sx={{ fontWeight: '500' }}>{selectedMarket.symbol}</Text>
                <Text sx={{ color: '#6B7280', fontSize: '14px' }}>{selectedMarket.leverage}x</Text>
                <ChevronDown size={16} color="#6B7280" />
              </>
            )}
          </Flex>

          {/* Asset selection dropdown */}
          {isAssetDropdownOpen && (
            <Box sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: 'min(1200px, 90vw)',
              maxWidth: '90vw',
              bg: '#1C1C24',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 1000,
              mt: 2,
              overflow: 'hidden'
            }}>
              {/* Categories - move above the market list */}
              <Flex 
                sx={{ 
                  p: 3,
                  overflowX: 'auto',
                  gap: 2
                }}
              >
                {CATEGORIES.map(category => (
                  <Box
                    key={category}
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: '24px',
                      bg: selectedCategory === category ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: selectedCategory === category ? '#3B82F6' : '#94A3B8',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bg: selectedCategory === category ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                        color: selectedCategory === category ? '#3B82F6' : '#fff'
                      }
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Box>
                ))}
              </Flex>

              {/* Search input */}
              <Box sx={{ px: 3, pb: 3 }}>
                <Box sx={{ 
                  position: 'relative',
                  width: '100%'
                }}>
                  <Input
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      pl: '36px',
                      py: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      bg: 'rgba(255, 255, 255, 0.03)',
                      color: 'white',
                      width: '100%',
                      fontSize: '13px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#3B82F6',
                        bg: 'rgba(59, 130, 246, 0.05)'
                      },
                      '&::placeholder': {
                        color: '#94A3B8'
                      }
                    }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)'
                  }}>
                    <Search size={14} color="#94A3B8" />
                  </Box>
                </Box>
              </Box>

              {/* Market list */}
              <Box sx={{
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '400px',
                bg: '#0B0B0F',
                width: '100%',
                mx: 'auto',
                fontSize: '12px',
                position: 'relative'
              }}>
                {/* Header */}
                <Flex sx={{
                  minWidth: '1000px',
                  px: 4,
                  py: '7px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  fontWeight: '600',
                  position: 'sticky',
                  top: 0,
                  bg: '#0B0B0F',
                  zIndex: 2,
                  letterSpacing: '0.03em',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}>
                  <Box sx={{ 
                    width: '30%', 
                    minWidth: '250px',
                    position: 'sticky',
                    left: 0,
                    bg: '#0B0B0F',
                    zIndex: 2,
                    paddingRight: 3
                  }}>PAIR</Box>
                  <Box sx={{ width: '13%', minWidth: '100px', textAlign: 'right' }}>PRICE</Box>
                  <Box sx={{ width: '11%', minWidth: '100px', textAlign: 'right' }}>24H CHANGE</Box>
                  <Box sx={{ width: '16%', minWidth: '120px', textAlign: 'right' }}>24H VOLUME</Box>
                  <Box sx={{ width: '14%', minWidth: '120px', textAlign: 'right' }}>OPEN INTEREST</Box>
                  <Box sx={{ width: '16%', minWidth: '180px', textAlign: 'right' }}>MARKET SENTIMENT</Box>
                </Flex>

                {/* Market rows */}
                {MARKETS.filter(market => 
                  selectedCategory === 'All' || market.category === selectedCategory
                ).map(market => (
                  <Flex
                    key={market.id}
                    sx={{
                      minWidth: '1000px',
                      px: 4,
                      py: '8px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        bg: 'rgba(255, 255, 255, 0.02)'
                      },
                      fontSize: '13px'
                    }}
                    onClick={() => {
                      setSelectedMarket(market);
                      setIsAssetDropdownOpen(false);
                    }}
                  >
                    {/* Pair - Sticky column */}
                    <Flex sx={{ 
                      width: '30%', 
                      minWidth: '250px',
                      alignItems: 'center', 
                      gap: 2,
                      position: 'sticky',
                      left: 0,
                      bg: '#0B0B0F',
                      zIndex: 1,
                      paddingRight: 3
                    }}>
                      <Star 
                        size={14} 
                        color="#94A3B8" 
                        strokeWidth={1.5}
                        style={{ opacity: 0.5, marginRight: '4px' }}
                      />
                      <Box sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        bg: '#1C1C24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#3B82F6',
                        fontSize: '13px',
                        mr: 2
                      }}>
                        {market.symbol.split('/')[0].charAt(0)}
                      </Box>
                      <Box>
                        <Text sx={{ 
                          fontWeight: '500',
                          fontSize: '13px',
                          color: 'white'
                        }}>
                          {market.symbol}
                        </Text>
                        <Text sx={{
                          fontSize: '11px',
                          color: '#94A3B8',
                          mt: '1px'
                        }}>
                          {market.name}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Rest of content is scrollable */}
                    <Box sx={{ 
                      width: '13%',
                      minWidth: '100px', 
                      textAlign: 'right',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '-0.01em',
                      color: 'white'
                    }}>
                      {market.price !== undefined ? market.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: market.price < 10 ? 4 : 2}) : '—'}
                    </Box>

                    <Flex sx={{ 
                      width: '11%',
                      minWidth: '100px',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      color: market.change24h !== undefined && market.change24h >= 0 ? '#22c55e' : '#ef4444',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}>
                      {market.change24h !== undefined && market.change24h >= 0 ? (
                        <Text sx={{ color: '#22c55e' }}>+{market.change24h.toFixed(2)}%</Text>
                      ) : market.change24h !== undefined ? (
                        <Text sx={{ color: '#ef4444' }}>{market.change24h.toFixed(2)}%</Text>
                      ) : (
                        <Text sx={{ color: 'gray' }}>—</Text>
                      )}
                    </Flex>

                    <Box sx={{ 
                      width: '16%',
                      minWidth: '120px', 
                      textAlign: 'right',
                      color: '#94A3B8',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      letterSpacing: '-0.01em'
                    }}>
                      {market.volume24h !== undefined ? market.volume24h.toLocaleString() : '—'}
                    </Box>

                    <Box sx={{ 
                      width: '14%',
                      minWidth: '120px', 
                      textAlign: 'right',
                      color: '#94A3B8',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      letterSpacing: '-0.01em'
                    }}>
                      {market.liquidity !== undefined ? market.liquidity : '—'}
                    </Box>

                    <Flex sx={{ 
                      width: '16%',
                      minWidth: '180px',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Flex sx={{ 
                        width: '80px', 
                        height: '4px', 
                        bg: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: '2px', 
                        overflow: 'hidden' 
                      }}>
                        <Box sx={{ 
                          width: `${market.sentiment?.long || 50}%`, 
                          bg: '#22c55e', 
                          height: '100%'
                        }} />
                        <Box sx={{ 
                          width: `${market.sentiment?.short || 50}%`, 
                          bg: '#ef4444', 
                          height: '100%'
                        }} />
                      </Flex>
                      <Text sx={{ 
                        fontSize: '12px', 
                        color: '#94A3B8',
                        fontFamily: 'IBM Plex Mono, monospace',
                        whiteSpace: 'nowrap',
                        fontWeight: '500',
                        letterSpacing: '-0.01em'
                      }}>
                        {market.sentiment?.long || 50}% / {market.sentiment?.short || 50}%
                      </Text>
                      <Box sx={{
                        px: 2,
                        py: '2px',
                        bg: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#3B82F6',
                        fontFamily: 'IBM Plex Mono, monospace',
                        letterSpacing: '-0.01em',
                        ml: 'auto'
                      }}>
                        {market.leverage}x
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Market info */}
        {selectedMarket && (
          <Flex sx={{ ml: 4, gap: 4 }}>
            <Box>
              <Text sx={{ color: '#6B7280', fontSize: '12px' }}>24H VOLUME</Text>
              <Text>${selectedMarket.volume24h?.toLocaleString()}</Text>
            </Box>
            <Box>
              <Text sx={{ color: '#6B7280', fontSize: '12px' }}>OPEN INTEREST</Text>
              <Text>${selectedMarket.liquidity}</Text>
            </Box>
            <Box>
              <Text sx={{ color: '#6B7280', fontSize: '12px' }}>SENTIMENT</Text>
              <Text>{selectedMarket.sentiment?.long}% Long / {selectedMarket.sentiment?.short}% Short</Text>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* Main content */}
      <Flex>
        {/* Left sidebar - Trading panel */}
        <Box sx={{ 
          width: '300px',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          height: 'calc(100vh - 64px)',
          p: 3
        }}>
          {/* Trade type selector */}
          <Flex sx={{ mb: 4 }}>
            <Button 
              sx={{ 
                flex: 1, 
                py: 2,
                bg: tradeType === 'Long' ? '#10B981' : 'transparent',
                color: tradeType === 'Long' ? 'white' : '#6B7280',
                border: '1px solid',
                borderColor: tradeType === 'Long' ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px 0 0 8px',
                '&:hover': {
                  bg: tradeType === 'Long' ? '#059669' : 'rgba(255, 255, 255, 0.05)'
                }
              }}
              onClick={() => setTradeType('Long')}
            >
              Long
            </Button>
            <Button 
              sx={{ 
                flex: 1, 
                py: 2,
                bg: tradeType === 'Short' ? '#EF4444' : 'transparent',
                color: tradeType === 'Short' ? 'white' : '#6B7280',
                border: '1px solid',
                borderColor: tradeType === 'Short' ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0 8px 8px 0',
                '&:hover': {
                  bg: tradeType === 'Short' ? '#DC2626' : 'rgba(255, 255, 255, 0.05)'
                }
              }}
              onClick={() => setTradeType('Short')}
            >
              Short
            </Button>
          </Flex>
          
          {/* Order type */}
          <Box sx={{ mb: 3 }}>
            <Label>Order type</Label>
            <Box sx={{ 
              border: '1px solid #333',
              borderRadius: '8px',
              p: 2,
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <Text>{orderType}</Text>
              <ChevronDown size={16} />
            </Box>
          </Box>
          
          {/* Current Price */}
          <Box sx={{ mb: 3 }}>
            <Label>Current Price</Label>
            <Flex sx={{ 
              border: '1px solid #333',
              borderRadius: '8px',
              p: 2,
              mt: 1,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text sx={{ fontWeight: 'bold' }}>{selectedMarket?.price?.toLocaleString()}</Text>
              <Text sx={{ color: 'gray' }}>USD</Text>
            </Flex>
          </Box>
          
          {/* Collateral */}
          <Box sx={{ mb: 3 }}>
            <Label>Collateral</Label>
            <Flex sx={{ 
              border: '1px solid #333',
              borderRadius: '8px',
              p: 2,
              mt: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bg: '#2775CA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>$</Box>
                <Text>USDC</Text>
              </Flex>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Text>0</Text>
                <Text sx={{ color: 'gray' }}>Max</Text>
              </Flex>
            </Flex>
          </Box>
          
          {/* Leverage slider */}
          <Box sx={{ mb: 3 }}>
            <Label>Leverage</Label>
            <Flex sx={{ mt: 2, mb: 1, justifyContent: 'space-between' }}>
              <Button 
                sx={{ 
                  py: 1, 
                  px: 2, 
                  bg: 'transparent', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontSize: 0
                }}
              >
                10%
              </Button>
              <Button 
                sx={{ 
                  py: 1, 
                  px: 2, 
                  bg: 'transparent', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontSize: 0
                }}
              >
                25%
              </Button>
              <Button 
                sx={{ 
                  py: 1, 
                  px: 2, 
                  bg: 'transparent', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontSize: 0
                }}
              >
                50%
              </Button>
              <Button 
                sx={{ 
                  py: 1, 
                  px: 2, 
                  bg: 'transparent', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontSize: 0
                }}
              >
                75%
              </Button>
              <Button 
                sx={{ 
                  py: 1, 
                  px: 2, 
                  bg: 'transparent', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontSize: 0
                }}
              >
                100%
              </Button>
            </Flex>
            <Slider
              min={1}
              max={20}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              sx={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                bg: '#333',
                '&::-webkit-slider-thumb': {
                  appearance: 'none',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  bg: 'white',
                  cursor: 'pointer',
                },
              }}
            />
            <Flex sx={{ mt: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text sx={{ fontWeight: 'bold' }}>{leverage}x</Text>
              <Text sx={{ color: 'gray', fontSize: 0 }}>Max: {selectedMarket?.leverage || 20}x</Text>
            </Flex>
          </Box>
          
          {/* Position Size */}
          <Box sx={{ mt: 4 }}>
            <Text sx={{ 
              fontSize: '14px', 
              color: '#94A3B8', 
              mb: 2,
              fontWeight: '500'
            }}>
              Position Size
            </Text>
            <Box sx={{
              bg: 'rgba(59, 130, 246, 0.02)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              p: 3
            }}>
              <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Text sx={{ color: 'white', fontSize: '14px' }}>Amount</Text>
                <Text sx={{ color: '#94A3B8', fontSize: '14px' }}>Balance: 0 USDC</Text>
              </Flex>
              <Input
                type="number"
                placeholder="0.00"
                sx={{
                  width: '100%',
                  bg: 'transparent',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  p: 2,
                  color: 'white',
                  fontSize: '14px',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#3B82F6'
                  },
                  '&::placeholder': {
                    color: '#94A3B8'
                  }
                }}
              />
              <Flex sx={{ mt: 3, gap: 2 }}>
                {['25%', '50%', '75%', '100%'].map(percent => (
                  <Button
                    key={percent}
                    sx={{
                      flex: 1,
                      bg: 'rgba(59, 130, 246, 0.1)',
                      color: '#3B82F6',
                      border: 'none',
                      borderRadius: '6px',
                      py: 1,
                      fontSize: '13px',
                      cursor: 'pointer',
                      '&:hover': {
                        bg: 'rgba(59, 130, 246, 0.15)'
                      }
                    }}
                  >
                    {percent}
                  </Button>
                ))}
              </Flex>
            </Box>
          </Box>
          
          {/* Connect wallet button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              onClick={() => {/* Add connect wallet logic */}}
              sx={{
                bg: '#f97316',
                color: 'white',
                px: 4,
                py: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: 'none',
                '&:hover': {
                  bg: '#ea580c',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                },
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Wallet size={16} />
              Connect Wallet
            </Button>
          </Box>
          
          {/* Additional info at the bottom */}
          <Box sx={{ mt: 4 }}>
            <Text sx={{ fontSize: 0, color: 'gray' }}>Borrow USDC with ETH, cbBTC, cbETH or wsETH</Text>
            
            <Flex sx={{ mt: 3, justifyContent: 'space-between', fontSize: 0 }}>
              <Text sx={{ color: 'gray' }}>Est. Liquidation Price</Text>
              <Text>0</Text>
            </Flex>
            
            <Flex sx={{ mt: 2, justifyContent: 'space-between', fontSize: 0 }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text sx={{ color: 'gray' }}>Loss Rebate</Text>
                <Info size={12} color="gray" />
              </Flex>
              <Text sx={{ color: 'green' }}>+ 0 USDC</Text>
            </Flex>
            
            <Flex sx={{ mt: 2, justifyContent: 'space-between', fontSize: 0 }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text sx={{ color: 'gray' }}>Avg. Spread</Text>
                <Info size={12} color="gray" />
              </Flex>
              <Text>0.0050%</Text>
            </Flex>
            
            <Flex sx={{ mt: 2, justifyContent: 'space-between', fontSize: 0 }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text sx={{ color: 'gray' }}>Est. Hourly Borrow Fee</Text>
              </Flex>
              <Text>0.00 USDC</Text>
            </Flex>
            
            <Flex sx={{ mt: 2, justifyContent: 'space-between', fontSize: 0 }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text sx={{ color: 'gray' }}>Open Fee</Text>
                <Info size={12} color="gray" />
              </Flex>
              <Text>0.12 USDC</Text>
            </Flex>
          </Box>
        </Box>
        
        {/* Main chart and positions area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chart */}
          <Box
            id={`tv_chart_${selectedMarket?.id}`}
            ref={chartContainerRef}
            sx={{
              width: '100%',
              height: '60vh',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />

          {/* Positions section */}
          <Box sx={{ p: 3, flex: 1 }}>
            {/* Tabs and Show Positions toggle */}
            <Flex sx={{ 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Flex sx={{ gap: 3 }}>
                <Text
                  sx={{
                    color: activePositionsTab === 'positions' ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    fontWeight: activePositionsTab === 'positions' ? '500' : 'normal'
                  }}
                  onClick={() => setActivePositionsTab('positions')}
                >
                  Positions
                </Text>
                <Text
                  sx={{
                    color: activePositionsTab === 'openOrders' ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    fontWeight: activePositionsTab === 'openOrders' ? '500' : 'normal'
                  }}
                  onClick={() => setActivePositionsTab('openOrders')}
                >
                  Open Orders
                </Text>
                <Text
                  sx={{
                    color: activePositionsTab === 'history' ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    fontWeight: activePositionsTab === 'history' ? '500' : 'normal'
                  }}
                  onClick={() => setActivePositionsTab('history')}
                >
                  History
                </Text>
              </Flex>
              
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Text sx={{ color: '#6B7280', fontSize: '14px' }}>Show Positions on Chart</Text>
                <Box
                  sx={{
                    width: '36px',
                    height: '20px',
                    bg: showPositionsOnChart ? '#10B981' : '#374151',
                    borderRadius: '10px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => setShowPositionsOnChart(!showPositionsOnChart)}
                >
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      bg: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: showPositionsOnChart ? '18px' : '2px',
                      transition: 'left 0.2s'
                    }}
                  />
                </Box>
              </Flex>
            </Flex>

            {/* Table header */}
            <Flex sx={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              py: 2,
              color: '#6B7280',
              fontSize: '12px'
            }}>
              <Box sx={{ width: '25%' }}>
                Value
                <Text sx={{ fontSize: '10px' }}>(Ex. open/close/borrow fees)</Text>
              </Box>
              <Box sx={{ width: '15%' }}>Entry / Mark Price</Box>
              <Box sx={{ width: '15%' }}>Liq. Price</Box>
              <Box sx={{ width: '15%' }}>Size</Box>
              <Box sx={{ width: '15%' }}>Collateral</Box>
              <Box sx={{ width: '15%' }}>TP / SL</Box>
            </Flex>

            {/* Connect wallet message */}
            <Flex 
              sx={{ 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 5,
                color: '#6B7280'
              }}
            >
              <Text sx={{ mb: 3 }}>Connect your wallet to see your trades</Text>
              <Button
                sx={{
                  bg: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  border: '1px solid #10B981',
                  borderRadius: '8px',
                  px: 4,
                  py: 2,
                  '&:hover': {
                    bg: 'rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Connect Wallet
              </Button>
            </Flex>
          </Box>
        </Box>
      </Flex>

      {/* Right Column - Order Entry */}
      <Box sx={{ 
        width: '350px',
        position: 'relative'
      }}>
        {/* Order Entry Panel */}
        <Box sx={{ 
          bg: '#1C1C24',
          borderRadius: '12px',
          p: 3,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}>
          {/* Survey Overlay for RWA */}
          {showRwaSurvey && (
            <SurveyOverlay
              title={RWA_SURVEY_METADATA.title}
              description={RWA_SURVEY_METADATA.description}
              questions={RWA_SURVEY_QUESTIONS}
              onComplete={handleSurveyComplete}
              onSkip={handleSurveySkip}
            />
          )}
          
          {/* ... existing order entry code ... */}
        </Box>
        
        {/* Position Panel */}
        <Box sx={{ 
          bg: '#1C1C24',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* ... existing position panel code ... */}
        </Box>
      </Box>
    </Box>
  );
};

export default RwaPage; 