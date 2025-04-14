import React, { useState } from 'react'
import { TradingPair } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Info } from 'lucide-react'

interface TradingFormProps {
  pair: TradingPair
}

const TradingForm: React.FC<TradingFormProps> = ({ pair }) => {
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [leverage, setLeverage] = useState(1)
  const [collateral, setCollateral] = useState('10')
  const [orderType, setOrderType] = useState('market')
  const [tpslEnabled, setTpslEnabled] = useState(false)

  const leverageOptions = [1, 2, 5, 10, 25, 50, 100]
  const maxLeverage = pair.maxLeverage || 100

  return (
    <div className="flex flex-col h-full">
      {/* Position Type Selector */}
      <div className="flex p-2 gap-1">
        <Button
          variant="ghost"
          className={cn(
            "flex-1 font-normal",
            positionType === 'long' && "bg-success/10 text-success hover:bg-success/20"
          )}
          onClick={() => setPositionType('long')}
        >
          Long
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex-1 font-normal",
            positionType === 'short' && "bg-destructive/10 text-destructive hover:bg-destructive/20"
          )}
          onClick={() => setPositionType('short')}
        >
          Short
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Type */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Order Type</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(orderType === 'market' && "bg-accent")}
              onClick={() => setOrderType('market')}
            >
              Market
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(orderType === 'limit' && "bg-accent")}
              onClick={() => setOrderType('limit')}
            >
              Limit
            </Button>
          </div>
        </div>

        {/* Collateral */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">Collateral (USDC)</label>
            <div className="flex gap-2">
              {['25%', '50%', '75%', '100%'].map((percent) => (
                <button
                  key={percent}
                  className="text-xs text-primary hover:text-primary/80"
                  onClick={() => setCollateral((parseFloat(percent) * 100).toString())}
                >
                  {percent}
                </button>
              ))}
            </div>
          </div>
          <Input
            type="number"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Leverage */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">
              Leverage: {leverage}x
            </label>
            <span className="text-sm text-muted-foreground">
              Max {maxLeverage}x
            </span>
          </div>
          <div className="space-y-2">
            <Slider
              value={[leverage]}
              min={1}
              max={maxLeverage}
              step={1}
              onValueChange={([value]) => setLeverage(value)}
              className="my-4"
            />
            <div className="flex gap-1">
              {leverageOptions.filter(x => x <= maxLeverage).map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  className={cn("flex-1 font-mono", leverage === value && "bg-accent")}
                  onClick={() => setLeverage(value)}
                >
                  {value}x
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* TP/SL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground">Set TP/SL</label>
            <Switch
              checked={tpslEnabled}
              onCheckedChange={setTpslEnabled}
            />
          </div>
          {tpslEnabled && (
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Take Profit Price"
                className="font-mono"
              />
              <Input
                type="number"
                placeholder="Stop Loss Price"
                className="font-mono"
              />
            </div>
          )}
        </div>

        {/* Position Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entry Price</span>
            <span>${pair.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Position Size</span>
            <span>${(parseFloat(collateral) * leverage).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fees</span>
            <span>$0.00</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto p-4 border-t border-border">
        <Button
          className={cn(
            "w-full font-semibold",
            positionType === 'long' ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
          )}
        >
          {positionType === 'long' ? 'Long' : 'Short'} {pair.symbol}
        </Button>
      </div>
    </div>
  )
}

export default TradingForm 