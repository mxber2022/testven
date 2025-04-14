import { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import TokenLogo from '@/components/token-logo'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp, ArrowRight, Info, Globe, Lock, BarChart3, 
  ArrowUpRight, TrendingDown, Zap, PieChart, 
  LineChart, Leaf, Layers, Eye, Settings, ChevronRight, Wallet, Search, ChevronDown, Filter, Clock, Shield, Cable
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { chainIdAtom } from '@/state/atoms'
import { useAtomValue } from 'jotai'
import { ChainId } from '@/utils/chains'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

// Interface for different lending products
interface BaseLendingProduct {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  chainId: typeof ChainId[keyof typeof ChainId];
  type: 'pool' | 'farm' | 'margin';
  risk: 'low' | 'medium' | 'high';
  tokens: {
    address: string;
    symbol: string;
    name: string;
    allocation?: number;
  }[];
}

interface LendingPool extends BaseLendingProduct {
  type: 'pool';
  utilization: number;
  borrowRate: number;
}

interface FarmingStrategy extends BaseLendingProduct {
  type: 'farm';
  leverage: number;
  protocol: string;
  harvestFrequency: string;
  underlyingApy: number;
}

interface MarginStrategy extends BaseLendingProduct {
  type: 'margin';
  leverage: number;
  longToken: {
    address: string;
    symbol: string;
    name: string;
  };
  shortToken?: {
    address: string;
    symbol: string;
    name: string;
  };
  liquidationThreshold: number;
}

type LendingProduct = LendingPool | FarmingStrategy | MarginStrategy;

// Mock data - in a real app this would come from an API or blockchain
const mockLendingPools: LendingPool[] = [
  {
    id: 'pool-1',
    name: 'USDC Lending Pool',
    apy: 4.5,
    tvl: 8500000,
    tokens: [{
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'low',
    utilization: 65,
    borrowRate: 6.2
  },
  {
    id: 'pool-2',
    name: 'ETH Lending Pool',
    apy: 2.8,
    tvl: 12300000,
    tokens: [{
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'ETH',
      name: 'Ethereum'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'low',
    utilization: 72,
    borrowRate: 3.5
  },
  {
    id: 'pool-3',
    name: 'USDT Lending Pool',
    apy: 4.8,
    tvl: 7500000,
    tokens: [{
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'low',
    utilization: 68,
    borrowRate: 6.5
  },
  {
    id: 'pool-4',
    name: 'MATIC Lending Pool',
    apy: 3.6,
    tvl: 2800000,
    tokens: [{
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      symbol: 'MATIC',
      name: 'Polygon'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'medium',
    utilization: 58,
    borrowRate: 4.9
  },
  {
    id: 'pool-5',
    name: 'WBTC Lending Pool',
    apy: 1.7,
    tvl: 9400000,
    tokens: [{
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'low',
    utilization: 45,
    borrowRate: 2.4
  },
  {
    id: 'pool-6',
    name: 'DAI Lending Pool',
    apy: 4.2,
    tvl: 6100000,
    tokens: [{
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      name: 'Dai Stablecoin'
    }],
    chainId: ChainId.Mainnet,
    type: 'pool',
    risk: 'low',
    utilization: 62,
    borrowRate: 5.8
  }
];

const mockFarmingStrategies: FarmingStrategy[] = [
  {
    id: 'farm-1',
    name: 'ETH/USDC Leveraged Yield',
    apy: 18.4,
    tvl: 7200000,
    tokens: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        name: 'Ethereum',
        allocation: 50
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        name: 'USD Coin',
        allocation: 50
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'farm',
    risk: 'medium',
    leverage: 3,
    protocol: 'Uniswap V3',
    harvestFrequency: '24 hours',
    underlyingApy: 6.2
  },
  {
    id: 'farm-2',
    name: 'ETH/WBTC Yield Strategy',
    apy: 14.2,
    tvl: 6500000,
    tokens: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        name: 'Ethereum',
        allocation: 50
      },
      {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        allocation: 50
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'farm',
    risk: 'medium',
    leverage: 2.5,
    protocol: 'Curve Finance',
    harvestFrequency: '12 hours',
    underlyingApy: 5.7
  },
  {
    id: 'farm-3',
    name: 'Stablecoin Yield Strategy',
    apy: 12.6,
    tvl: 9100000,
    tokens: [
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        name: 'USD Coin',
        allocation: 33
      },
      {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        allocation: 33
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        allocation: 34
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'farm',
    risk: 'low',
    leverage: 2,
    protocol: 'Convex Finance',
    harvestFrequency: '24 hours',
    underlyingApy: 6.3
  },
  {
    id: 'farm-4',
    name: 'MATIC/ETH Leverage Yield',
    apy: 22.5,
    tvl: 4800000,
    tokens: [
      {
        address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        symbol: 'MATIC',
        name: 'Polygon',
        allocation: 50
      },
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        name: 'Ethereum',
        allocation: 50
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'farm',
    risk: 'high',
    leverage: 4,
    protocol: 'Balancer',
    harvestFrequency: '12 hours',
    underlyingApy: 5.6
  }
];

const mockMarginStrategies: MarginStrategy[] = [
  {
    id: 'margin-1',
    name: 'ETH Long Position',
    apy: 24.3,
    tvl: 6300000,
    tokens: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        name: 'Ethereum'
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'margin',
    risk: 'high',
    leverage: 5,
    longToken: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'ETH',
      name: 'Ethereum'
    },
    liquidationThreshold: 82
  },
  {
    id: 'margin-2',
    name: 'BTC Long Position',
    apy: 20.8,
    tvl: 5700000,
    tokens: [
      {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'margin',
    risk: 'high',
    leverage: 4,
    longToken: {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin'
    },
    liquidationThreshold: 85
  },
  {
    id: 'margin-3',
    name: 'ETH/USDC Long-Short',
    apy: 28.5,
    tvl: 4200000,
    tokens: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        name: 'Ethereum'
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    ],
    chainId: ChainId.Mainnet,
    type: 'margin',
    risk: 'high',
    leverage: 3,
    longToken: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'ETH',
      name: 'Ethereum'
    },
    shortToken: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin'
    },
    liquidationThreshold: 78
  }
];

// Combine all products
const allProducts: LendingProduct[] = [
  ...mockLendingPools,
  ...mockFarmingStrategies,
  ...mockMarginStrategies
];

const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
  const colors = {
    low: "bg-success/20 text-success",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive"
  };
  
  return (
    <div className={`${colors[risk]} border-none text-sm font-medium`}>
      {risk === 'low' ? 'Low Risk' : risk === 'medium' ? 'Medium Risk' : 'High Risk'}
    </div>
  );
};

const getTypeIcon = (type: 'pool' | 'farm' | 'margin') => {
  if (type === 'pool') return <PieChart size={18} className="text-primary" />;
  if (type === 'farm') return <Leaf size={18} className="text-primary" />;
  return <BarChart3 size={18} className="text-primary" />;
};

// Lending Pool Card Component
const LendingProductCard = ({ product }: { product: LendingProduct }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/lending/${product.type}/${product.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex -space-x-2">
            {product.tokens.map((token, i) => (
              <TokenLogo 
                key={i}
                size="lg" 
                address={token.address} 
                chain={product.chainId} 
                className={i > 0 ? "border-2 border-background" : ""}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {getRiskBadge(product.risk)}
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          {getTypeIcon(product.type)}
          <span>
            {product.type === 'pool' ? 'Passive Lending Pool' : 
             product.type === 'farm' ? 'Leveraged Farming Strategy' : 'Margin Trading Strategy'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-muted-foreground text-xs mb-1">APY</div>
            <div className="text-xl font-medium flex items-center gap-1">
              <TrendingUp size={16} className="text-primary" />
              {product.apy.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">TVL</div>
            <div className="text-xl font-medium">
              ${(product.tvl / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>
        
        {product.type === 'farm' && (
          <div className="mt-2 text-xs text-muted-foreground">
            {(product as FarmingStrategy).leverage}x leverage on {(product as FarmingStrategy).protocol}
          </div>
        )}
        
        {product.type === 'margin' && (
          <div className="mt-2 text-xs text-muted-foreground">
            {(product as MarginStrategy).leverage}x leverage {(product as MarginStrategy).shortToken ? 'long-short' : 'long only'} position
          </div>
        )}
      </div>
      
      <div className="bg-muted p-3 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {ChainId[product.chainId]}
        </span>
        <Button variant="ghost" size="sm" className="text-primary">
          View Details <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  )
}

// Component for the market overview stats
const LendingMarketStats = () => {
  const totalTVL = allProducts.reduce((acc, product) => acc + product.tvl, 0);
  const avgAPY = allProducts.reduce((acc, product) => acc + product.apy, 0) / allProducts.length;
  const totalProducts = allProducts.length;
  
  return (
    <Card className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Total Value Locked</span>
          <span className="text-2xl font-semibold">${(totalTVL / 1000000).toFixed(2)}M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Average APY</span>
          <span className="text-2xl font-semibold">{avgAPY.toFixed(2)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Total Products</span>
          <span className="text-2xl font-semibold">{totalProducts}</span>
        </div>
      </div>
    </Card>
  );
};

// Main Lending View
const LendingView = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on selected chain, tab, and search term
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    // Filter by chain
    if (selectedChain !== 'all') {
      filtered = filtered.filter(
        p => p.chainId === parseInt(selectedChain)
      );
    }
    
    // Filter by tab (product type)
    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.type === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.tokens.some(t => 
          t.symbol.toLowerCase().includes(term) || 
          t.name.toLowerCase().includes(term)
        )
      );
    }
    
    return filtered;
  }, [selectedChain, activeTab, searchTerm]);

  return (
    <div className="container mx-auto px-4">
      <div className="my-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Fink Lending</h1>
        <p className="text-muted-foreground mb-6">
          Lend assets, earn yield, and explore leveraged strategies.
        </p>
        
        <LendingMarketStats />
        
        {/* Filters and Tabs */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pool">Pools</TabsTrigger>
              <TabsTrigger value="farm">Farming</TabsTrigger>
              <TabsTrigger value="margin">Margin</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-48">
              <Search size={16} className="absolute left-2 top-2 text-muted-foreground" />
              <Input 
                placeholder="Search assets..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              value={selectedChain} 
              onChange={(e) => setSelectedChain(e.target.value)}
              className="h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Networks</option>
              <option value={ChainId.Mainnet.toString()}>Ethereum</option>
              <option value={ChainId.Base.toString()}>Base</option>
              <option value={ChainId.Arbitrum.toString()}>Arbitrum</option>
            </select>
          </div>
        </div>
        
        {/* My Positions Section */}
        <Card className="mb-6">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={18} />
                <h2 className="text-lg font-medium">My Positions</h2>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <div className="mb-2 text-muted-foreground">No active positions</div>
            <div className="text-sm text-muted-foreground mb-4">
              Explore passive pools, leveraged farming strategies, and margin positions below.
            </div>
            <Button variant="outline">Connect Wallet</Button>
          </div>
        </Card>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <LendingProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="text-muted-foreground mb-2">No products match your filters</div>
            <Button variant="outline" onClick={() => {
              setActiveTab('all');
              setSelectedChain('all');
              setSearchTerm('');
            }}>Clear Filters</Button>
          </Card>
        )}
      </div>
    </div>
  )
}

export default LendingView 