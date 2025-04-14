import { ethers } from 'ethers';
import { ChainId } from './chains';
import { INFURA_KEY, ALCHEMY_KEY } from '@/config';

// Fallback RPC URLs that don't require API keys
const DEFAULT_RPC_URLS: Record<number, string[]> = {
  [ChainId.Mainnet]: [
    'https://eth.llamarpc.com',
    'https://ethereum.publicnode.com',
    'https://rpc.ankr.com/eth'
  ],
  [ChainId.Arbitrum]: [
    'https://arb1.arbitrum.io/rpc',
    'https://arbitrum-one.public.blastapi.io'
  ],
  [ChainId.Base]: [
    'https://base.llamarpc.com',
    'https://base.publicnode.com'
  ],
  [ChainId.Optimism]: [
    'https://mainnet.optimism.io',
    'https://optimism.publicnode.com'
  ]
};

// Get provider for a specific chain
export const getProvider = (chainId: ChainId = ChainId.Mainnet): ethers.providers.JsonRpcProvider => {
  // Use API keys from config
  const infuraKey = INFURA_KEY;
  const alchemyKey = ALCHEMY_KEY;
  
  // Prepare provider URLs with API keys if available
  const providers: string[] = [];
  
  if (infuraKey) {
    providers.push(`https://${chainId === ChainId.Mainnet ? 'mainnet' : ChainId[chainId].toLowerCase()}.infura.io/v3/${infuraKey}`);
  }
  
  if (alchemyKey) {
    providers.push(`https://eth-${chainId === ChainId.Mainnet ? 'mainnet' : ChainId[chainId].toLowerCase()}.alchemyapi.io/v2/${alchemyKey}`);
  }
  
  // Add default fallback RPC URLs
  providers.push(...(DEFAULT_RPC_URLS[chainId] || []));
  
  // Create a FallbackProvider if multiple providers are available
  if (providers.length > 1) {
    const fallbackProviders = providers.map((url, i) => ({
      provider: new ethers.providers.JsonRpcProvider(url),
      priority: i, // Lower index = higher priority
      stallTimeout: 3000
    }));
    
    return new ethers.providers.FallbackProvider(fallbackProviders);
  }
  
  // Otherwise use the first provider or a default one
  const rpcUrl = providers[0] || DEFAULT_RPC_URLS[chainId][0] || 'https://eth.llamarpc.com';
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Create a signer from a private key
export const getSignerFromPrivateKey = (privateKey: string, chainId: ChainId = ChainId.Mainnet): ethers.Wallet => {
  const provider = getProvider(chainId);
  return new ethers.Wallet(privateKey, provider);
};

export default {
  getProvider,
  getSignerFromPrivateKey
}; 