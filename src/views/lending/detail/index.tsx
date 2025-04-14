import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LendingProduct, LendingProductType } from '../types';
import TokenLogo from '@/components/TokenLogo';
import ChainLogo from '@/components/ChainLogo';
import { ChainId, getChainName } from '@/utils/chains';
import { allProducts, getFallbackData as getDefaultFallbackData } from '../data';

// Component for displaying statistics
interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  isPercentage?: boolean;
  isToken?: boolean;
  tokenSymbol?: string;
  isPositive?: boolean;
}

const StatCard = ({ title, value, subValue, isPercentage = false, isToken = false, tokenSymbol = '', isPositive = false }: StatCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="flex items-end">
        <div className="text-2xl font-semibold">
          {value}{isPercentage ? '%' : ''}
          {isToken && <span className="ml-1 text-lg">{tokenSymbol}</span>}
        </div>
        {subValue && (
          <div className={`ml-2 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};

// Component for managing liquidity
const LiquidityManagement = ({ product }: { product: LendingProduct }) => {
  const [action, setAction] = useState<'supply' | 'withdraw'>('supply');
  const [amount, setAmount] = useState<string>('');
  const [leverageValue, setLeverageValue] = useState<number>(
    product.type === 'margin-trading' ? 6 : 1
  );
  const [healthFactor, setHealthFactor] = useState<number>(1.8);
  
  const isLeveragedProduct = product.type === 'leveraged-farming' || product.type === 'margin-trading';
  
  // Calculate health factor based on leverage (simplified for demo)
  useEffect(() => {
    if (isLeveragedProduct) {
      setHealthFactor(2.5 - (leverageValue * 0.15));
    }
  }, [leverageValue, isLeveragedProduct]);
  
  const healthColor = healthFactor >= 1.5 ? 'bg-green-500' : 
                      healthFactor >= 1.1 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="bg-card rounded-xl p-6 border h-full">
      <h3 className="text-xl font-semibold mb-4">
        {isLeveragedProduct ? 'Open Position' : 'Liquidity Management'}
      </h3>
      
      {/* Deposit/Withdraw tabs */}
      <Tabs defaultValue={action} onValueChange={(v) => setAction(v as 'supply' | 'withdraw')}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="supply" className="flex-1">Supply</TabsTrigger>
          <TabsTrigger value="withdraw" className="flex-1">Withdraw</TabsTrigger>
        </TabsList>
        
        <TabsContent value="supply" className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-20 text-right text-lg"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <TokenLogo token={product.tokens[0] || {symbol: 'USDC'}} size={20} />
                  <span>{product.tokens[0]?.symbol || 'USDC'}</span>
                </div>
              </div>
            </div>
            
            {/* Leverage slider for leveraged products */}
            {isLeveragedProduct && (
              <div className="my-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Leverage</span>
                  <span className="font-medium">{leverageValue}x</span>
                </div>
                <Slider
                  min={1}
                  max={product.type === 'margin-trading' ? 10 : 3}
                  step={0.1}
                  value={[leverageValue]}
                  onValueChange={(values) => setLeverageValue(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1x</span>
                  <span>{product.type === 'margin-trading' ? '10x' : '3x'}</span>
                </div>
              </div>
            )}
            
            {/* Health factor indicator for leveraged products */}
            {isLeveragedProduct && (
              <div className="my-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Health Factor</span>
                  <span className={`font-medium ${
                    healthFactor >= 1.5 ? 'text-green-500' : 
                    healthFactor >= 1.1 ? 'text-yellow-500' : 'text-red-500'
                  }`}>{healthFactor.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${healthColor} transition-all`} 
                    style={{ width: `${Math.min(healthFactor / 2 * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Liquidation at &lt;1.0
                </div>
              </div>
            )}
            
            {/* Debt info for margin trading */}
            {product.type === 'margin-trading' && (
              <div className="bg-muted/50 rounded-lg p-4 my-6 space-y-3">
                <h4 className="text-sm font-medium">Position Info</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Debt</div>
                  <div className="text-right">{(parseFloat(amount || '0') * (leverageValue - 1)).toFixed(2)} {product.tokens[0]?.symbol || 'USDC'}</div>
                  
                  <div className="text-muted-foreground">Net Value</div>
                  <div className="text-right">{(parseFloat(amount || '0')).toFixed(2)} {product.tokens[0]?.symbol || 'USDC'}</div>
                  
                  <div className="text-muted-foreground">Borrow Rate</div>
                  <div className="text-right">{product.borrowRate?.toFixed(2) || '3.2'}%</div>
                </div>
              </div>
            )}
            
            <Button className="w-full">
              {action === 'supply' ? 'Supply' : 'Withdraw'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-20 text-right text-lg"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <TokenLogo token={product.tokens[0] || {symbol: 'USDC'}} size={20} />
                  <span>{product.tokens[0]?.symbol || 'USDC'}</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full">Withdraw</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for product details
const ProductDetails = ({ product }: { product: LendingProduct }) => {
  return (
    <div className="bg-card rounded-xl p-6 border h-full">
      <h3 className="text-xl font-semibold mb-4">Product Details</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Description</h4>
          <p className="text-sm">{product.description}</p>
        </div>
        
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Curator</h4>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs">{product.curator.charAt(0)}</span>
            </div>
            <span className="text-sm">{product.curator}</span>
          </div>
        </div>
        
        {product.type === 'passive-pool' && (
          <div>
            <h4 className="text-sm text-muted-foreground mb-1">Available Liquidity</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{product.availableLiquidity?.toLocaleString() || '1,234,567'}</span>
              <span className="text-sm">{product.tokens[0]?.symbol || 'USDC'}</span>
            </div>
          </div>
        )}
        
        {product.type === 'leveraged-farming' && (
          <div>
            <h4 className="text-sm text-muted-foreground mb-1">Contract</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <TokenLogo token={product.tokens[0] || {symbol: 'USDC'}} size={16} />
                {product.tokens[1] && <TokenLogo token={product.tokens[1]} size={16} />}
              </div>
              <span className="text-sm">
                {product.tokens[0]?.symbol || 'USDC'}{product.tokens[1] ? `-${product.tokens[1].symbol}` : ''}
              </span>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Protocol</h4>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs">V</span>
            </div>
            <span className="text-sm">{product.protocol || 'Venice'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header component for the lending product
const LendingProductHeader = ({ product }: { product: LendingProduct }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-card p-6 rounded-xl border">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex">
            {(product.tokens || []).map((token, i) => (
              <div key={i} className="relative" style={{ marginLeft: i > 0 ? '-10px' : '0' }}>
                <TokenLogo token={token} size={40} />
                {i === 0 && (
                  <div className="absolute -bottom-1 -right-1">
                    <ChainLogo chainId={product.chainId} size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-0.5 bg-secondary rounded text-xs">{product.type}</span>
            <span>•</span>
            <span>Chain: {getChainName(product.chainId)}</span>
            <span>•</span>
            <span>Curator: {product.curator}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="icon" onClick={() => {
          // Copy contract address to clipboard
          if (product.tokens?.[0]?.address) {
            navigator.clipboard.writeText(product.tokens[0].address);
          }
        }}>
          <Copy size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => {
          // Open etherscan
          if (product.tokens?.[0]?.address) {
            const baseUrl = product.chainId === ChainId.Mainnet 
              ? 'https://etherscan.io/token/' 
              : product.chainId === ChainId.Base
                ? 'https://basescan.org/token/'
                : 'https://arbiscan.io/token/';
            window.open(`${baseUrl}${product.tokens[0].address}`, '_blank');
          }
        }}>
          <ExternalLink size={16} />
        </Button>
      </div>
    </div>
  );
};

// Main component for the lending product detail page
const LendingProductDetail = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<LendingProduct | null>(null);
  
  // In a real app, you would fetch the specific product from an API or blockchain
  useEffect(() => {
    if (type && id) {
      try {
        // Try to find product in the static data first
        const foundProduct = allProducts.find(
          p => p.id === id && p.type === type as LendingProductType
        );
        
        if (foundProduct) {
          console.log("Product found:", foundProduct);
          setProductData(foundProduct);
        } else {
          console.warn("Product not found in static data, using fallback");
          // Use fallback data if not found
          setProductData(getDefaultFallbackData(id, type));
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setProductData(getDefaultFallbackData(id, type));
      }
    }
  }, [type, id, navigate]);
  
  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-card h-12 w-12 mb-4"></div>
          <div className="h-4 bg-card rounded w-48 mb-2"></div>
          <div className="h-3 bg-card rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/lending" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={16} />
        Back to lending
      </Link>
      
      <LendingProductHeader product={productData} />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard 
          title={productData.type === 'passive-pool' ? "Supply" : "Available Liquidity"} 
          value={productData.tvl.toLocaleString()} 
          isToken={productData.type === 'passive-pool' && productData.tokens.length > 0}
          tokenSymbol={productData.tokens[0]?.symbol || ''}
        />
        <StatCard 
          title="Supply APY" 
          value={productData.apy.toFixed(2)} 
          subValue="0.92%" 
          isPercentage={true}
          isPositive={true}
        />
        <StatCard 
          title="Utilization Rate" 
          value={productData.utilizationRate?.toFixed(2) || "64.84"} 
          isPercentage={true} 
        />
      </div>
      
      {/* Two-column layout for management and details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        <div className="md:col-span-5">
          <LiquidityManagement product={productData} />
        </div>
        <div className="md:col-span-7">
          <ProductDetails product={productData} />
        </div>
      </div>
      
      {/* Loan terms, risks, etc. */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Additional Information</h3>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="terms" className="border rounded-lg overflow-hidden mb-3">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">Terms and Conditions</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>By using this platform, you agree to the following terms and conditions:</p>
                <ul>
                  <li>Venice is a non-custodial protocol. You maintain control of your assets at all times.</li>
                  <li>Interest rates may vary based on market conditions and utilization.</li>
                  <li>In leveraged positions, ensure you understand the liquidation parameters.</li>
                  <li>Smart contract risk exists - although we've undergone multiple audits, no code is perfect.</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="risks" className="border rounded-lg overflow-hidden mb-3">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">Risks</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>Using this product involves several types of risk:</p>
                <ul>
                  <li><strong>Smart Contract Risk:</strong> All blockchain applications carry inherent smart contract risk.</li>
                  <li><strong>Liquidation Risk:</strong> For leveraged positions, price movements may cause liquidation.</li>
                  <li><strong>Market Risk:</strong> Asset prices and yields can fluctuate significantly.</li>
                  <li><strong>Oracle Risk:</strong> Price feeds can occasionally experience issues.</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {productData.type === 'leveraged-farming' && (
            <AccordionItem value="rewards" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">Reward Calculation</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p>Rewards are calculated based on:</p>
                  <ul>
                    <li>Base yield from the underlying protocol</li>
                    <li>Bonus rewards from liquidity mining programs</li>
                    <li>Compounding frequency</li>
                    <li>Your leverage multiplier</li>
                  </ul>
                  <p>Note that APYs are estimates and actual returns may vary.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default LendingProductDetail; 