import { ChainId } from '@/utils/chains'
import { RESERVE_API } from '@/utils/constants'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

type Performance = { timestamp: number; value: number }

export type IndexDTFItem = {
  address: Address
  symbol: string
  name: string
  price: number
  fee: number
  marketCap: number
  basket: { address: Address; symbol: string; name?: string; weight?: string }[]
  performance: Performance[]
  performancePercent: number
  chainId: number
  brand?: {
    icon?: string
    cover?: string
    tags?: string[]
  }
}

const calculatePercentageChange = (performance: Performance[]) => {
  if (performance.length === 0) {
    return 0
  }
  const firstValue = performance[0].value
  const lastValue = performance[performance.length - 1].value
  return ((lastValue - firstValue) / firstValue) * 100
}

// Mock data for when API calls fail
const generateMockPerformance = (basePrice: number, days = 7) => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const result: Performance[] = [];

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs;
    const randomVariation = (Math.random() * 0.1 - 0.05) * basePrice; // +/- 5%
    const value = basePrice + randomVariation;
    result.push({ timestamp, value });
  }
  
  return result;
};

const MOCK_INDEX_DTFS: IndexDTFItem[] = [
  {
    address: "0x1234567890123456789012345678901234567890" as Address,
    symbol: "DEFI",
    name: "DeFi Index",
    price: 125.75,
    fee: 1.5,
    marketCap: 15000000,
    basket: [
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address, symbol: "USDC", weight: "30%" },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address, symbol: "WETH", weight: "30%" },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address, symbol: "WBTC", weight: "20%" },
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address, symbol: "DAI", weight: "10%" },
      { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" as Address, symbol: "AAVE", weight: "10%" }
    ],
    performance: generateMockPerformance(125.75),
    performancePercent: 5.2,
    chainId: ChainId.Mainnet,
    brand: {
      tags: ["DeFi", "Index", "Yield"]
    }
  },
  {
    address: "0x2345678901234567890123456789012345678901" as Address,
    symbol: "NFTI",
    name: "NFT Index",
    price: 75.25,
    fee: 2.0,
    marketCap: 8500000,
    basket: [
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address, symbol: "WETH", weight: "35%" },
      { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" as Address, symbol: "UNI", weight: "20%" },
      { address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e" as Address, symbol: "YFI", weight: "20%" },
      { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" as Address, symbol: "AAVE", weight: "15%" },
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address, symbol: "USDC", weight: "10%" }
    ],
    performance: generateMockPerformance(75.25),
    performancePercent: -2.8,
    chainId: ChainId.Base,
    brand: {
      tags: ["NFT", "Gaming", "Metaverse"]
    }
  },
  {
    address: "0x3456789012345678901234567890123456789012" as Address,
    symbol: "LAYER1",
    name: "Layer 1 Index",
    price: 218.50,
    fee: 1.25,
    marketCap: 22000000,
    basket: [
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address, symbol: "WETH", weight: "40%" },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address, symbol: "WBTC", weight: "30%" },
      { address: "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb" as Address, symbol: "OPT", weight: "15%" },
      { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" as Address, symbol: "UNI", weight: "10%" },
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address, symbol: "DAI", weight: "5%" }
    ],
    performance: generateMockPerformance(218.50),
    performancePercent: 8.7,
    chainId: ChainId.Mainnet,
    brand: {
      tags: ["Layer 1", "Infrastructure", "Blue Chip"]
    }
  }
];

const REFRESH_INTERVAL = 1000 * 60 * 10 // 10 minutes

// TODO: Top 100 only, worry about pagination later
// TODO: Pagination may become a problem sooner? need to fetch analytics/pricing here as well!
// TODO: Mock data for what should come from the API
const useIndexDTFList = () => {
  return useQuery({
    queryKey: ['index-dtf-list'],
    queryFn: async (): Promise<IndexDTFItem[]> => {
      try {
        const f = async (chain: number) => {
          try {
            const response = await fetch(
              `${RESERVE_API}discover/dtf?chainId=${chain}&limit=100`
            )

            if (!response.ok) {
              throw new Error('Failed to fetch dtf list')
            }

            const data = await response.json()

            return data.map((item: any) => ({
              ...item,
              performancePercent: calculatePercentageChange(item.performance),
              performance: [
                ...item.performance,
                {
                  timestamp: Date.now(),
                  value: item.price,
                },
              ],
            })) as IndexDTFItem[]
          } catch (error) {
            console.warn(`Error fetching DTFs for chain ${chain}:`, error);
            // Return empty array for this chain
            return [];
          }
        }

        const responses = await Promise.all(
          [ChainId.Base, ChainId.Mainnet].map(f)
        )

        const result = responses.flat().sort((x, y) => y.marketCap - x.marketCap);
        
        // If no data was returned from the API, use mock data
        if (result.length === 0) {
          console.log("No DTFs found from API, using mock data");
          return MOCK_INDEX_DTFS;
        }
        
        return result;
      } catch (error) {
        console.error("Failed to fetch DTFs:", error);
        return MOCK_INDEX_DTFS;
      }
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  })
}

export default useIndexDTFList
