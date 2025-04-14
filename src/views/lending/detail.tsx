import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Input, Button, Heading, Slider, Label, Card, Grid } from 'theme-ui';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  ChevronDown,
  Wallet,
  LineChart,
  BarChart3,
  ExternalLink,
  Clock,
  MoveRight,
  PlusCircle,
  MinusCircle,
  BatteryMedium,
  Shield,
  ChevronRight,
  Repeat,
  Plus,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Percent
} from 'lucide-react';
import SurveyOverlay from '../../components/SurveyOverlay';
import { LENDING_SURVEY_QUESTIONS, LENDING_SURVEY_METADATA } from '../../constants/surveyQuestions';
import useSurveyState from '../../hooks/useSurveyState';

// Mock data types
interface PoolStats {
  healthFactor: string;
  entryPrice: string;
  liquidationPrice: string;
  interestTriggeredLiquidation: string;
  curator: string;
  oraclesAndLTs: {
    name: string;
    value: string;
  }[];
  totalValue: string;
  debt: string;
  netValue: string;
  borrowRate: string;
  overallAPY: string;
  apy: {
    total: string;
    farming: string;
    trading: string;
    borrowing: string;
  };
  ltv: number;
  maxLeverage: number;
}

// Mock data
const poolStats: PoolStats = {
  healthFactor: 'N/A',
  entryPrice: 'N/A',
  liquidationPrice: 'N/A',
  interestTriggeredLiquidation: 'N/A',
  curator: 'VeniceLabs',
  oraclesAndLTs: [
    { name: 'Chainlink', value: 'Enabled' },
    { name: 'Pyth', value: 'Enabled' }
  ],
  totalValue: '0.00 USDC',
  debt: '0.00 USDC',
  netValue: '0.00 USDC',
  borrowRate: '0.00%',
  overallAPY: 'N/A',
  apy: {
    total: '12.5%',
    farming: '15.2%',
    trading: '4.8%',
    borrowing: '-7.5%'
  },
  ltv: 85,
  maxLeverage: 6
};

const availableTokens = [
  { symbol: 'USDC', name: 'USD Coin', logo: 'U', color: '#2775CA', balance: '1,250.00' },
  { symbol: 'WETH', name: 'Wrapped Ethereum', logo: 'W', color: '#627EEA', balance: '0.75' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', logo: 'B', color: '#F7931A', balance: '0.08' },
];

const DetailPage: React.FC = () => {
  const { type = 'pool', id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('0.0');
  const [leverage, setLeverage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [currentToken, setCurrentToken] = useState(availableTokens[0]);
  const [showApyBreakdown, setShowApyBreakdown] = useState(false);
  
  // Survey state
  const { shouldShowSurvey, completeSurvey, skipSurvey } = useSurveyState();
  const showLendingSurvey = shouldShowSurvey('lending');

  // Determine if this is a pool, farming or trading page
  const pageTitle = type === 'pool' 
    ? 'Long WETH / USDC' 
    : type === 'farm' 
      ? 'Deposit to stkUSDC' 
      : 'ETH V3 Pool';

  const handleBack = () => {
    navigate('/lending');
  };
  
  const selectToken = (token: typeof availableTokens[0]) => {
    setCurrentToken(token);
    setShowTokens(false);
  };

  // Handle survey completion
  const handleSurveyComplete = (responses: Record<string, string | string[]>) => {
    completeSurvey('lending', responses);
  };

  // Handle survey skip
  const handleSurveySkip = () => {
    skipSurvey('lending');
  };

  return (
    <Box sx={{ 
      bg: '#0B0B0F', 
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      px: 4,
      pt: 4,
      pb: 6,
      position: 'relative'
    }}>
      {/* Show survey overlay if needed */}
      {showLendingSurvey && (
        <SurveyOverlay
          title={LENDING_SURVEY_METADATA.title}
          description={LENDING_SURVEY_METADATA.description}
          questions={LENDING_SURVEY_QUESTIONS}
          onComplete={handleSurveyComplete}
          onSkip={handleSurveySkip}
        />
      )}

      {/* Header with Navigation */}
      <Flex
        sx={{
          alignItems: 'center',
          mb: 4
        }}
      >
        <Button
          onClick={handleBack}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bg: 'transparent',
            border: 'none',
            color: '#94A3B8',
            p: 0,
            cursor: 'pointer',
            '&:hover': {
              color: 'white'
            }
          }}
        >
          <ArrowLeft size={16} />
          <Text>Back to Lending</Text>
        </Button>
      </Flex>

      {/* Breadcrumb Navigation */}
      <Flex 
        sx={{ 
          alignItems: 'center', 
          mb: 4, 
          color: '#94A3B8'
        }}
      >
        <Text sx={{ fontSize: '14px', color: '#3B82F6', cursor: 'pointer' }} onClick={handleBack}>Lending</Text>
        <ChevronRight size={14} style={{ margin: '0 8px' }} />
        <Text sx={{ fontSize: '14px', color: '#3B82F6', cursor: 'pointer' }}>
          {type === 'pool' ? 'Trading' : type === 'farm' ? 'Farming' : 'Pools'}
        </Text>
        <ChevronRight size={14} style={{ margin: '0 8px' }} />
        <Text sx={{ fontSize: '14px', color: 'white' }}>{pageTitle}</Text>
      </Flex>

      {/* Page Title */}
      <Heading as="h1" sx={{ 
        mb: 4, 
        fontSize: '32px', 
        fontWeight: '700',
        letterSpacing: '-0.5px',
        fontFamily: '"Manrope", Inter, system-ui, sans-serif'
      }}>
        {pageTitle}
      </Heading>

      {/* Main Content */}
      <Flex sx={{ gap: 5 }}>
        {/* Left Column - Transaction Panel */}
        <Box sx={{ 
          width: '450px',
          bg: '#1C1C24',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Transaction Tabs */}
          <Flex sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box 
              sx={{ 
                flex: 1, 
                p: 3,
                textAlign: 'center',
                fontWeight: activeTab === 'deposit' ? '600' : '400',
                color: activeTab === 'deposit' ? 'white' : '#94A3B8',
                borderBottom: activeTab === 'deposit' ? '2px solid #f97316' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </Box>
            <Box 
              sx={{ 
                flex: 1, 
                p: 3,
                textAlign: 'center',
                fontWeight: activeTab === 'withdraw' ? '600' : '400',
                color: activeTab === 'withdraw' ? 'white' : '#94A3B8',
                borderBottom: activeTab === 'withdraw' ? '2px solid #f97316' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </Box>
          </Flex>

          {/* Amount Section */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Flex sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <Label htmlFor="deposit-amount">Amount</Label>
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Text sx={{ fontSize: '13px', color: '#94A3B8' }}>Balance:</Text>
                  <Text sx={{ fontSize: '13px', color: 'white' }}>{currentToken.balance} {currentToken.symbol}</Text>
                </Flex>
              </Flex>
              
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Input
                  id="deposit-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{
                    width: '100%',
                    p: 3,
                    pl: 4,
                    pr: '95px',
                    fontSize: '16px',
                    bg: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    '&:focus': {
                      borderColor: '#f97316',
                      outline: 'none'
                    }
                  }}
                />
                
                <Flex 
                  sx={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    bg: 'rgba(249, 115, 22, 0.1)',
                    borderRadius: '8px',
                    py: 1,
                    px: 2,
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowTokens(!showTokens)}
                >
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    bg: currentToken.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    mr: 1
                  }}>
                    {currentToken.logo}
                  </Box>
                  <Text sx={{ mr: 1, color: '#f97316', fontWeight: '500' }}>{currentToken.symbol}</Text>
                  <ChevronDown size={14} color="#f97316" />
                </Flex>
              </Box>
              
              {/* Token selector dropdown */}
              {showTokens && (
                <Box sx={{ 
                  position: 'absolute',
                  bg: '#1C1C24',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  width: '300px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                }}>
                  <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Text sx={{ fontWeight: '600' }}>Select Token</Text>
                  </Box>
                  {availableTokens.map((token, i) => (
                    <Flex 
                      key={i}
                      sx={{ 
                        p: 3, 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        '&:hover': {
                          bg: 'rgba(255, 255, 255, 0.05)'
                        },
                        borderBottom: i < availableTokens.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                      }}
                      onClick={() => selectToken(token)}
                    >
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bg: token.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 2
                      }}>
                        {token.logo}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Text sx={{ fontWeight: '500', fontSize: '14px' }}>{token.symbol}</Text>
                        <Text sx={{ color: '#94A3B8', fontSize: '12px' }}>{token.name}</Text>
                      </Box>
                      <Text sx={{ color: '#94A3B8', fontSize: '14px' }}>{token.balance}</Text>
                    </Flex>
                  ))}
                </Box>
              )}
              
              <Flex sx={{ mt: 2, gap: 2 }}>
                {['25%', '50%', '75%', '100%'].map(percent => (
                  <Button
                    key={percent}
                    sx={{
                      flex: 1,
                      bg: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      border: 'none',
                      borderRadius: '8px',
                      py: 1,
                      fontSize: '13px',
                      cursor: 'pointer',
                      '&:hover': {
                        bg: 'rgba(249, 115, 22, 0.15)'
                      }
                    }}
                  >
                    {percent}
                  </Button>
                ))}
              </Flex>
            </Box>
            
            {/* Borrowed Asset Section (for trading type) */}
            {type === 'pool' && (
              <Box sx={{ mb: 4 }}>
                <Flex sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label htmlFor="borrowed-asset">Trade Position</Label>
                  <Flex sx={{ alignItems: 'center', gap: 1 }}>
                    <Info size={14} color="#94A3B8" />
                    <Text sx={{ fontSize: '13px', color: '#94A3B8' }}>Credit Account</Text>
                  </Flex>
                </Flex>
                
                <Flex 
                  sx={{ 
                    p: 3,
                    bg: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bg: '#627EEA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      W
                    </Box>
                    <Box>
                      <Text>Long WETH</Text>
                      <Text sx={{ fontSize: '12px', color: '#94A3B8' }}>Collateral: USDC</Text>
                    </Box>
                  </Flex>
                  <ChevronDown size={16} color="#94A3B8" />
                </Flex>
              </Box>
            )}
            
            {/* Leverage Slider (for trading and farming) */}
            {(type === 'pool' || type === 'farm') && (
              <Box sx={{ mb: 4 }}>
                <Flex sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label>Leverage</Label>
                  <Flex
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 2,
                      py: '4px',
                      height: '24px',
                      bg: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {leverage.toFixed(1)}x
                  </Flex>
                </Flex>
                
                <Box sx={{ px: 1, position: 'relative' }}>
                  <Slider
                    min={1}
                    max={poolStats.maxLeverage}
                    step={0.1}
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                    sx={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '4px',
                      bg: 'rgba(255, 255, 255, 0.1)',
                      appearance: 'none',
                      outline: 'none',
                      '&::-webkit-slider-thumb': {
                        appearance: 'none',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        bg: '#f97316',
                        cursor: 'pointer',
                      },
                    }}
                  />
                  
                  {/* Leverage markers */}
                  <Flex sx={{ justifyContent: 'space-between', mt: 2 }}>
                    {[1, 2, 3, 4, 5, 6].map(level => (
                      <Text 
                        key={level} 
                        sx={{ 
                          fontSize: '12px', 
                          color: leverage >= level ? '#f97316' : '#94A3B8',
                          fontWeight: level === Math.floor(leverage) ? '600' : '400'
                        }}
                      >
                        {level}x
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </Box>
            )}
            
            {/* APY Calculator Display */}
            <Box sx={{ mb: 4 }}>
              <Flex 
                sx={{ 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer'
                }}
                onClick={() => setShowApyBreakdown(!showApyBreakdown)}
              >
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Percent size={16} color="#f97316" />
                  <Text sx={{ fontWeight: '600' }}>Estimated APY</Text>
                </Flex>
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Text sx={{ color: '#22c55e', fontWeight: '600', fontSize: '16px' }}>
                    {poolStats.apy.total}
                  </Text>
                  <ChevronDown 
                    size={16} 
                    color="#94A3B8" 
                    style={{ transform: showApyBreakdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
                  />
                </Flex>
              </Flex>
              
              {showApyBreakdown && (
                <Box sx={{ 
                  p: 3, 
                  bg: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '12px',
                  mb: 3
                }}>
                  <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                    <Text sx={{ color: '#94A3B8' }}>Farming Yield</Text>
                    <Text sx={{ color: '#22c55e' }}>{poolStats.apy.farming}</Text>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                    <Text sx={{ color: '#94A3B8' }}>Trading Fees</Text>
                    <Text sx={{ color: '#22c55e' }}>{poolStats.apy.trading}</Text>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                    <Text sx={{ color: '#94A3B8' }}>Borrowing Cost</Text>
                    <Text sx={{ color: '#ef4444' }}>{poolStats.apy.borrowing}</Text>
                  </Flex>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Flex sx={{ justifyContent: 'space-between' }}>
                      <Text sx={{ fontWeight: '600' }}>Net APY</Text>
                      <Text sx={{ color: '#22c55e', fontWeight: '600' }}>{poolStats.apy.total}</Text>
                    </Flex>
                  </Box>
                </Box>
              )}
            </Box>
            
            {/* Deposit Option (for farm type) */}
            {type === 'farm' && (
              <Box sx={{ mb: 4 }}>
                <Label sx={{ mb: 2, display: 'block' }}>Farming Strategy</Label>
                
                <Flex 
                  sx={{ 
                    p: 3,
                    bg: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Box>
                    <Text>Automated Yield Farming</Text>
                    <Text sx={{ fontSize: '12px', color: '#94A3B8' }}>24h auto-compounding</Text>
                  </Box>
                  <ChevronDown size={16} color="#94A3B8" />
                </Flex>
              </Box>
            )}
            
            {/* Market metrics */}
            <Box sx={{ 
              p: 3, 
              mb: 4, 
              bg: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '12px'
            }}>
              <Flex sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text sx={{ color: '#94A3B8' }}>Loan to Value</Text>
                <Text>{poolStats.ltv}%</Text>
              </Flex>
              
              <Flex sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text sx={{ color: '#94A3B8' }}>Max Leverage</Text>
                <Text>{poolStats.maxLeverage}x</Text>
              </Flex>
              
              <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text sx={{ color: '#94A3B8' }}>Borrow Rate</Text>
                <Text>{poolStats.borrowRate}</Text>
              </Flex>
            </Box>
            
            {/* Connect Wallet Button */}
            <Button
              sx={{
                width: '100%',
                bg: '#f97316',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 3,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  bg: '#ea580c',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Wallet size={18} />
              Connect Wallet
            </Button>
          </Box>
        </Box>
        
        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          {/* Credit Account Card */}
          <Card sx={{ 
            bg: '#1C1C24',
            borderRadius: '12px',
            mb: 4,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <Flex sx={{ 
              p: 3, 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bg: currentToken.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {currentToken.logo}
                </Box>
                <Text sx={{ 
                  fontWeight: '700', 
                  fontSize: '18px',
                  fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                }}>{currentToken.symbol} Credit Account</Text>
              </Flex>
              
              <Flex sx={{ alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bg: 'rgba(249, 115, 22, 0.1)',
                  px: 2,
                  py: 1,
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <Repeat size={14} color="#f97316" />
                  <Text sx={{ color: '#f97316', fontSize: '13px', fontWeight: '500' }}>Manage</Text>
                </Box>
                <HelpCircle size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
              </Flex>
            </Flex>
            
            <Box sx={{ p: 4 }}>
              {/* Health Factor Meter */}
              <Box sx={{ mb: 4 }}>
                <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 2 }}>Health Factor</Text>
                <Flex sx={{ alignItems: 'center', gap: 3 }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: '8px', 
                    bg: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '0%', // This would be dynamic based on health factor
                      height: '100%',
                      bg: 'linear-gradient(90deg, #22c55e 0%, #f97316 50%, #ef4444 100%)',
                      borderRadius: '4px'
                    }} />
                  </Box>
                  <Text sx={{ fontWeight: '500' }}>{poolStats.healthFactor}</Text>
                </Flex>
              </Box>
              
              <Grid columns={[1, 2, 3]} gap={3} mb={4}>
                <Box>
                  <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Entry Price</Text>
                  <Text sx={{ fontWeight: '500' }}>{poolStats.entryPrice}</Text>
                </Box>
                
                <Box>
                  <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Liquidation Price</Text>
                  <Text sx={{ fontWeight: '500' }}>{poolStats.liquidationPrice}</Text>
                </Box>
                
                <Box>
                  <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Interest-Triggered Liquidation</Text>
                  <Text sx={{ fontWeight: '500' }}>{poolStats.interestTriggeredLiquidation}</Text>
                </Box>
              </Grid>
              
              {/* Position Stats */}
              <Card sx={{ 
                bg: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: '12px', 
                p: 3,
                mb: 4
              }}>
                <Grid columns={4} gap={3}>
                  <Box>
                    <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Total Value</Text>
                    <Text sx={{ fontWeight: '500' }}>{poolStats.totalValue}</Text>
                  </Box>
                  
                  <Box>
                    <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Debt</Text>
                    <Text sx={{ fontWeight: '500' }}>{poolStats.debt}</Text>
                  </Box>
                  
                  <Box>
                    <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Net Value</Text>
                    <Text sx={{ fontWeight: '500' }}>{poolStats.netValue}</Text>
                  </Box>
                  
                  <Box>
                    <Text sx={{ color: '#94A3B8', fontSize: '13px', mb: 1 }}>Borrow Rate</Text>
                    <Text sx={{ fontWeight: '500' }}>{poolStats.borrowRate}</Text>
                  </Box>
                </Grid>
              </Card>
              
              <Box sx={{ mt: 3 }}>
                <Flex 
                  sx={{ 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    mb: 2
                  }}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Text sx={{ fontWeight: '600' }}>Oracles and Liquidation Thresholds</Text>
                  <ChevronDown 
                    size={16} 
                    color="#94A3B8" 
                    style={{ 
                      transform: showDetails ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s' 
                    }} 
                  />
                </Flex>
                
                {showDetails && (
                  <Box>
                    {poolStats.oraclesAndLTs.map((item, index) => (
                      <Flex 
                        key={index} 
                        sx={{ 
                          justifyContent: 'space-between',
                          py: 2,
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <Text sx={{ color: '#94A3B8', fontSize: '13px' }}>{item.name}</Text>
                        <Text sx={{ fontSize: '13px' }}>{item.value}</Text>
                      </Flex>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
          
          {/* Details Card */}
          <Card sx={{ 
            bg: '#1C1C24',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden'
          }}>
            <Flex sx={{ 
              p: 3,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Text sx={{ 
                fontWeight: '700', 
                fontSize: '18px',
                fontFamily: '"Manrope", Inter, system-ui, sans-serif'
              }}>Details</Text>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#94A3B8',
                  fontSize: '13px'
                }}>
                  <Shield size={14} color="#94A3B8" />
                  <Text>Audited by VeniceLabs</Text>
                </Box>
                <ExternalLink size={14} color="#94A3B8" style={{ cursor: 'pointer' }} />
              </Flex>
            </Flex>
            
            <Box sx={{ p: 4 }}>
              {type === 'pool' && (
                <>
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Collateral & Position Management</Text>
                  
                  <Flex sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    pb: 3,
                    mb: 3
                  }}>
                    <Text sx={{ color: '#94A3B8', flex: 1 }}>
                      This strategy enables you to open a leveraged long position on WETH using USDC as collateral. The position is backed by your initial deposit and borrowed funds, automatically managed through Venice's credit accounts.
                    </Text>
                  </Flex>
                  
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Leverage Impact</Text>
                  
                  <Flex sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    pb: 3,
                    mb: 3
                  }}>
                    <Text sx={{ color: '#94A3B8', flex: 1 }}>
                      Higher leverage amplifies both potential gains and losses. At 1x leverage, a 10% change in WETH results in a 10% change in position value. At 3x leverage, a 10% WETH move creates a 30% position value change.
                    </Text>
                  </Flex>
                  
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Liquidation Protection</Text>
                  
                  <Text sx={{ color: '#94A3B8', fontSize: '14px' }}>
                    Your position is protected by Venice's advanced liquidation system, which uses multiple price oracles and smooth liquidation mechanisms to prevent cascading liquidations during market volatility.
                  </Text>
                </>
              )}
              
              {type === 'farm' && (
                <>
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Yield Strategy</Text>
                  
                  <Flex sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    pb: 3,
                    mb: 3
                  }}>
                    <Text sx={{ color: '#94A3B8', flex: 1 }}>
                      This strategy automatically allocates your assets to the highest-yielding opportunities while managing risk through Venice's smart contract system. Yields are auto-compounded for maximum returns.
                    </Text>
                  </Flex>
                  
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Auto-Compounding</Text>
                  
                  <Flex sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    pb: 3,
                    mb: 3
                  }}>
                    <Text sx={{ color: '#94A3B8', flex: 1 }}>
                      Your yields are automatically harvested and reinvested every 24 hours, optimized for gas efficiency and maximum returns. This compounding effect significantly increases long-term yields compared to manual strategies.
                    </Text>
                  </Flex>
                  
                  <Text sx={{ 
                    fontWeight: '700', 
                    mb: 3,
                    fontSize: '16px',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>Risk Management</Text>
                  
                  <Text sx={{ color: '#94A3B8', fontSize: '14px' }}>
                    All DeFi strategies involve smart contract risk. Venice Labs has conducted extensive audits of this strategy, but users should understand that yields fluctuate based on market conditions and protocol performance.
                  </Text>
                </>
              )}
              
              {/* Strategy Audit Badge */}
              <Flex sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: '12px',
                bg: 'rgba(249, 115, 22, 0.05)',
                alignItems: 'center',
                gap: 3
              }}>
                <Shield size={20} color="#f97316" />
                <Box>
                  <Text sx={{ 
                    fontWeight: '700', 
                    color: '#f97316',
                    fontFamily: '"Manrope", Inter, system-ui, sans-serif'
                  }}>VeniceLabs Verified</Text>
                  <Text sx={{ fontSize: '13px', color: '#94A3B8' }}>This strategy has been audited and verified by VeniceLabs security team</Text>
                </Box>
              </Flex>
            </Box>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default DetailPage; 