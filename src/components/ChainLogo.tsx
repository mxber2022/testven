import { useState } from 'react';
import { ChainId } from '@/utils/chains';

interface ChainLogoProps {
  chainId: number;
  size?: number;
  className?: string;
}

// Chain colors for fallback avatars
const chainColors: Record<number, string> = {
  [ChainId.Mainnet]: '#627EEA', // Ethereum
  [ChainId.Arbitrum]: '#28A0F0', // Arbitrum
  [ChainId.Base]: '#0052FF', // Base
  [ChainId.Optimism]: '#FF0420', // Optimism
  // Default color
  0: '#7C4DFF'
};

// Chain symbols for fallback avatars
const chainSymbols: Record<number, string> = {
  [ChainId.Mainnet]: 'ETH',
  [ChainId.Arbitrum]: 'ARB',
  [ChainId.Base]: 'BASE',
  [ChainId.Optimism]: 'OP',
  // Default
  0: '?'
};

export const ChainLogo = ({ chainId, size = 16, className = '' }: ChainLogoProps) => {
  const [imgError, setImgError] = useState(false);
  
  const chainColor = chainColors[chainId] || chainColors[0];
  const symbol = chainSymbols[chainId] || chainSymbols[0];
  
  // Try to load from public directory
  const imgSrc = `/chains/${chainId}.png`;
  
  if (imgError) {
    // Fallback to a text avatar with the chain symbol
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: chainColor,
          color: 'white',
          fontSize: `${Math.max(size / 2.5, 8)}px`,
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
      alt={`Chain ID ${chainId} logo`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setImgError(true)}
    />
  );
};

export default ChainLogo; 