import React, { useEffect, useRef, useState } from 'react'
import { TimeFrame } from './types'
import Datafeed from './datafeeds/datafeed'

declare global {
  interface Window {
    TradingView: {
      widget: any
    }
  }
}

interface TradingChartProps {
  symbol?: string
  timeframe?: TimeFrame
  onTimeframeChange?: (tf: TimeFrame) => void
}

// Venice Finance theme colors
const UP_COLOR = 'hsl(164, 83%, 40%)'  // --success
const DOWN_COLOR = 'hsl(0, 84.2%, 60.2%)'  // --destructive
const CHART_BG = 'hsl(212, 20%, 6%)'  // --background
const GRID_COLOR = 'hsl(220, 20%, 16%)'  // --border
const TEXT_COLOR = 'hsl(216, 67%, 94%)'  // --foreground
const BORDER_COLOR = 'hsl(220, 18%, 20%)'  // --border-secondary

const chartStyleOverrides = ["candleStyle", "hollowCandleStyle", "haStyle"].reduce(
  (acc: Record<string, any>, cv) => {
    acc[`mainSeriesProperties.${cv}.drawWick`] = true
    acc[`mainSeriesProperties.${cv}.drawBorder`] = true
    acc[`mainSeriesProperties.${cv}.upColor`] = UP_COLOR
    acc[`mainSeriesProperties.${cv}.downColor`] = DOWN_COLOR
    acc[`mainSeriesProperties.${cv}.wickUpColor`] = UP_COLOR
    acc[`mainSeriesProperties.${cv}.wickDownColor`] = DOWN_COLOR
    acc[`mainSeriesProperties.${cv}.borderUpColor`] = UP_COLOR
    acc[`mainSeriesProperties.${cv}.borderDownColor`] = DOWN_COLOR
    return acc
  },
  {}
)

const chartOverrides = {
  "paneProperties.background": CHART_BG,
  "paneProperties.backgroundGradientStartColor": CHART_BG,
  "paneProperties.backgroundGradientEndColor": CHART_BG,
  "paneProperties.backgroundType": "solid",
  "paneProperties.vertGridProperties.color": GRID_COLOR,
  "paneProperties.vertGridProperties.style": 2,
  "paneProperties.horzGridProperties.color": GRID_COLOR,
  "paneProperties.horzGridProperties.style": 2,
  "mainSeriesProperties.priceLineColor": BORDER_COLOR,
  "scalesProperties.textColor": TEXT_COLOR,
  "scalesProperties.lineColor": GRID_COLOR,
  "mainSeriesProperties.statusViewStyle.showExchange": false,
  ...chartStyleOverrides,
}

const disabledFeatures = [
  "volume_force_overlay",
  "create_volume_indicator_by_default",
  "header_compare",
  "symbol_search_hot_key",
  "header_symbol_search",
  "header_resolutions",
  "header_chart_type",
  "header_settings",
  "header_indicators",
  "header_undo_redo",
  "header_screenshot",
  "timeframes_toolbar",
  "left_toolbar",
  "control_bar",
  "edit_buttons_in_legend",
  "context_menus",
  "border_around_the_chart",
]

const enabledFeatures = [
  "hide_left_toolbar_by_default",
  "use_localstorage_for_settings",
  "save_chart_properties_to_local_storage",
]

const TradingChart: React.FC<TradingChartProps> = ({
  symbol = 'BTCUSDT',
  timeframe = '15m',
  onTimeframeChange = () => {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [tvWidget, setTvWidget] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChartReady, setIsChartReady] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)

  // Fake loading animation
  useEffect(() => {
    if (!isChartReady && isScriptLoaded) {
      const interval = setInterval(() => {
        setLoadingPercent(prev => {
          const next = prev + Math.floor(Math.random() * 15)
          return next > 90 ? 90 : next
        })
      }, 300)
      
      return () => clearInterval(interval)
    } else if (isChartReady) {
      setLoadingPercent(100)
    }
  }, [isChartReady, isScriptLoaded])

  useEffect(() => {
    const loadTradingViewScript = () => {
      try {
        const existingScript = document.getElementById('tradingview-widget-script')
        if (existingScript) {
          setIsScriptLoaded(true)
          return
        }

        const script = document.createElement('script')
        script.id = 'tradingview-widget-script'
        script.src = '/charting_library/charting_library.standalone.js'
        script.type = 'text/javascript'
        script.async = true
        script.onload = () => {
          console.log('TradingView script loaded successfully')
          setIsScriptLoaded(true)
        }
        script.onerror = (e) => {
          console.error('Failed to load TradingView widget script:', e)
          setError('Failed to load TradingView widget')
        }
        document.head.appendChild(script)
      } catch (err) {
        console.error('Error loading TradingView script:', err)
        setError('Failed to initialize TradingView widget')
      }
    }

    loadTradingViewScript()

    return () => {
      // Cleanup widget on unmount
      if (tvWidget) {
        try {
          tvWidget.remove()
          setTvWidget(null)
        } catch (error) {
          console.error('Error removing TradingView widget:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isScriptLoaded || !window.TradingView) return

    try {
      console.log('Initializing TradingView widget with symbol:', symbol, 'timeframe:', timeframe)
      
      // Clean up previous widget if it exists
      if (tvWidget) {
        console.log('Removing previous widget')
        tvWidget.remove()
        setTvWidget(null)
        setIsChartReady(false)
      }
      
      const widgetOptions = {
        symbol: symbol,
        interval: timeframe as string,
        container: containerRef.current,
        library_path: '/charting_library/',
        locale: 'en',
        disabled_features: disabledFeatures,
        enabled_features: enabledFeatures,
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'venicefi.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        theme: 'Dark',
        overrides: chartOverrides,
        custom_css_url: '/charting_library/custom.css',
        datafeed: Datafeed,
        loading_screen: { backgroundColor: CHART_BG, foregroundColor: "hsl(32, 100%, 50%)" }, // --primary
        favorites: {
          intervals: ['1', '5', '15', '30', '60', '1D', '1W', '1M']
        },
        save_load_adapter: {
          getAllCharts: () => Promise.resolve([]),
          removeChart: () => Promise.resolve(),
          saveChart: () => Promise.resolve(),
          getChartContent: () => Promise.resolve(''),
        },
      }

      console.log('Creating new TradingView widget')
      const widget = new window.TradingView.widget(widgetOptions)
      
      widget.onChartReady(() => {
        console.log('TradingView chart is ready')
        setTvWidget(widget)
        setIsChartReady(true)
      })
    } catch (err) {
      console.error('Error initializing TradingView widget:', err)
      setError('Failed to initialize TradingView widget')
    }
  }, [isScriptLoaded, symbol, timeframe])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-card rounded-lg">
        <div className="text-destructive text-center p-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-12 h-12 mx-auto mb-4"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3 className="text-lg font-medium">Chart unavailable</h3>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!isChartReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-card">
        <div className="w-16 h-16 mb-4 relative">
          <svg className="animate-spin w-16 h-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="w-48 h-2 bg-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${loadingPercent}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
    />
  )
}

export default TradingChart 