import { ChainId } from '@/utils/chains';
import { LendingProduct, LendingProductType } from './types';

// Dummy data for when API is not available
export const allProducts: LendingProduct[] = [
  {
    id: 'pool-1',
    name: 'USDC Lending Pool',
    type: 'passive-pool',
    description: "Earn passive yield by supplying assets to this lending pool. Your assets are used to provide liquidity for margin traders and leveraged farmers.",
    tokens: [{ symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }],
    tvl: 8500000,
    apy: 4.5,
    chainId: ChainId.Mainnet,
    curator: "Venice",
    protocol: "Venice",
    utilizationRate: 65,
    borrowRate: 6.2,
    availableLiquidity: 1234567,
    maxLeverage: 1
  },
  {
    id: 'pool-2',
    name: 'ETH Lending Pool',
    type: 'passive-pool',
    description: "Earn interest on your ETH. Your assets are used to provide liquidity for margin traders and leveraged yield farmers.",
    tokens: [{ symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }],
    tvl: 12300000,
    apy: 2.8,
    chainId: ChainId.Mainnet,
    curator: "Venice",
    protocol: "Venice",
    utilizationRate: 72,
    borrowRate: 3.5,
    availableLiquidity: 2345678,
    maxLeverage: 1
  },
  {
    id: 'farm-1',
    name: 'ETH/USDC Leveraged Yield',
    type: 'leveraged-farming',
    description: "Boost your yield by leveraging your position in this ETH/USDC liquidity pool. Automatic compounding gives you the best APY.",
    tokens: [
      { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
    ],
    tvl: 7200000,
    apy: 18.4,
    chainId: ChainId.Mainnet,
    curator: "Venice",
    protocol: "Uniswap V3",
    utilizationRate: 85,
    borrowRate: 4.5,
    availableLiquidity: 1800000,
    maxLeverage: 3
  },
  {
    id: 'margin-1',
    name: 'ETH Long Position',
    type: 'margin-trading',
    description: "Open a leveraged long position on ETH. Get up to 10x leverage on your crypto trading strategy.",
    tokens: [{ symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }],
    tvl: 6300000,
    apy: 0,
    chainId: ChainId.Mainnet,
    curator: "Venice",
    protocol: "Venice",
    utilizationRate: 78,
    borrowRate: 5.2,
    availableLiquidity: 1500000,
    maxLeverage: 10
  },
  {
    id: 'pool-3',
    name: 'USDT Lending Pool',
    type: 'passive-pool',
    description: "Earn stable yield on your USDT. Your assets are used to provide liquidity for margin traders.",
    tokens: [{ symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }],
    tvl: 7500000,
    apy: 4.8,
    chainId: ChainId.Mainnet,
    curator: "Venice",
    protocol: "Venice",
    utilizationRate: 68,
    borrowRate: 6.5,
    availableLiquidity: 2400000,
    maxLeverage: 1
  }
];

// Helper to find products by type
export const getProductsByType = (type: LendingProductType) => 
  allProducts.filter(product => product.type === type);

// Helper to find a specific product
export const getProductById = (id: string, type: LendingProductType) =>
  allProducts.find(product => product.id === id && product.type === type);

// If API can't be reached, this function provides fallback data
export const getFallbackData = (id: string, type: string): LendingProduct => {
  return {
    id: id || 'default-id',
    name: id === 'pool-1' ? 'USDC Lending Pool' : `${id?.charAt(0).toUpperCase() + id?.slice(1) || 'Default'} Pool`,
    type: (type || 'passive-pool') as LendingProductType,
    description: "Earn passive yield by supplying assets to this lending pool. Your assets are used to provide liquidity for margin traders and leveraged farmers.",
    tokens: [{ symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }],
    tvl: 1234567,
    apy: 3.5,
    chainId: 1, // Ethereum mainnet
    curator: "Venice",
    protocol: "Venice",
    utilizationRate: 64.84,
    borrowRate: 4.2,
    availableLiquidity: 435678,
    maxLeverage: 10
  };
}; 