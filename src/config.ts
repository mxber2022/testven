// API endpoints
export const API_BASE_URL = 'https://api.venice.netlify.app';
export const LENDING_API_URL = `${API_BASE_URL}/lending`;
export const PROTOCOL_API_URL = `${API_BASE_URL}/protocol`;
export const DISCOVER_API_URL = `${API_BASE_URL}/discover`;
export const DTF_API_URL = `${API_BASE_URL}/dtf`;

// API keys with defaults
export const INFURA_KEY = import.meta.env.VITE_INFURA_KEY || 'f36f7f706a58477884ce6fe89165666c';
export const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY || 'E_2Ksy_iQIKEZTvjNnKaiQZImOQMWO94';
export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fcc6bba6f1de962d911bb5b5c3dba68';
export const CONTENTFUL_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
export const CONTENTFUL_ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '';

// Chain RPC URLs
export const RPC_URLS = {
  mainnet: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  base: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  optimism: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
}

// Fallback RPC URLs
export const FALLBACK_RPC_URLS = {
  mainnet: [
    'https://eth.llamarpc.com',
    'https://rpc.ankr.com/eth',
    'https://ethereum.publicnode.com',
  ],
  arbitrum: [
    'https://arb1.arbitrum.io/rpc',
    'https://rpc.ankr.com/arbitrum',
    'https://arbitrum-one.public.blastapi.io',
  ],
  base: [
    'https://base.llamarpc.com',
    'https://base.publicnode.com',
    'https://rpc.ankr.com/base',
  ],
  optimism: [
    'https://mainnet.optimism.io',
    'https://optimism.publicnode.com',
    'https://rpc.ankr.com/optimism',
  ],
} 