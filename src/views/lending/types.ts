export type LendingProductType = 'passive-pool' | 'leveraged-farming' | 'margin-trading';

export interface Token {
  symbol: string;
  address?: string;
  decimals?: number;
  name?: string;
  logoURI?: string;
}

export interface LendingProduct {
  id: string;
  name: string;
  type: LendingProductType;
  description: string;
  tokens: Token[];
  tvl: number;
  apy: number;
  chainId: number;
  curator: string;
  protocol?: string;
  utilizationRate?: number;
  borrowRate?: number;
  availableLiquidity?: number;
  maxLeverage?: number;
}

export interface Chain {
  id: number;
  name: string;
  logoURI?: string;
} 