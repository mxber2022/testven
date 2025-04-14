import { useState, useEffect } from 'react';

interface TokenProps {
  token: {
    symbol?: string;
    address?: string;
  };
  size?: number;
  className?: string;
}

// Map of token addresses to their symbols for fallback display
const tokenSymbolMap: Record<string, string> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'ETH',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'MATIC',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI'
};

// Token colors for fallback avatars
const tokenColors: Record<string, string> = {
  'USDC': '#2775CA',
  'ETH': '#627EEA',
  'USDT': '#26A17B',
  'MATIC': '#8247E5',
  'WBTC': '#F7931A',
  'DAI': '#F5AC37',
  // Default color
  'DEFAULT': '#7C4DFF'
};

export const TokenLogo = ({ token, size = 24, className = '' }: TokenProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  
  const symbol = token?.symbol || (token?.address ? tokenSymbolMap[token.address.toLowerCase()] : '') || '?';
  const bgColor = tokenColors[symbol] || tokenColors.DEFAULT;
  
  useEffect(() => {
    // Reset state when token changes
    setImgError(false);
    
    if (token?.address) {
      // Try to load from public directory first
      setImgSrc(`/tokens/${token.address.toLowerCase()}.png`);
    } else {
      setImgError(true);
    }
  }, [token]);
  
  const handleError = () => {
    // If public directory image fails, try a different source
    if (imgSrc?.startsWith('/tokens/') && token?.address) {
      // Try remote API as backup
      setImgSrc(null);
      setImgError(true);
    } else {
      setImgError(true);
    }
  };
  
  if (imgError || !imgSrc) {
    // Fallback to a text avatar with the token symbol
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: bgColor,
          color: 'white',
          fontSize: `${Math.max(size / 2.5, 9)}px`,
          fontWeight: 'bold'
        }}
      >
        {symbol.substring(0, 1)}
      </div>
    );
  }
  
  return (
    <img 
      src={imgSrc}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={handleError}
    />
  );
};

export default TokenLogo; 