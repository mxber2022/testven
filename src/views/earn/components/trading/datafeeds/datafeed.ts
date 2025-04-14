import { 
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
  ErrorCallback,
  HistoryCallback,
  Bar,
} from '../../../../../public/charting_library/charting_library'
import { subscribeOnStream, unsubscribeFromStream } from './streaming'

const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'] as ResolutionString[],
  exchanges: [
    {
      value: 'Binance',
      name: 'Binance',
      desc: 'Binance',
    }
  ],
  symbols_types: [
    {
      name: 'crypto',
      value: 'crypto',
    }
  ],
}

const BINANCE_API = 'https://api.binance.com/api/v3'

async function getAllSymbols() {
  try {
    const response = await fetch(`${BINANCE_API}/exchangeInfo`)
    const data = await response.json()
    
    return data.symbols
      .filter((symbol: any) => symbol.status === 'TRADING')
      .map((symbol: any) => {
        return {
          symbol: symbol.symbol,
          full_name: symbol.symbol,
          description: `${symbol.baseAsset}/${symbol.quoteAsset}`,
          exchange: 'Binance',
          type: 'crypto',
          currency_code: symbol.quoteAsset,
        }
      })
  } catch (error) {
    console.error('Error fetching symbols:', error)
    return []
  }
}

const supportedResolutions = new Set(configurationData.supported_resolutions)

const resolutionToInterval = (resolution: string): string => {
  if (resolution.includes('D')) return 'day'
  if (resolution.includes('W')) return 'week'
  if (resolution.includes('M')) return 'month'
  return resolution + 'm'
}

export default {
  onReady: (callback: any) => {
    console.log('[Datafeed] onReady called')
    setTimeout(() => callback(configurationData))
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: any
  ) => {
    console.log('[Datafeed] searchSymbols:', userInput)
    try {
      const symbols = await getAllSymbols()
      const searchString = userInput.toUpperCase()
      
      const results = symbols.filter((symbol: any) => 
        symbol.symbol.includes(searchString) || 
        symbol.description.includes(searchString)
      )
      
      onResultReadyCallback(results)
    } catch (error) {
      console.error('Error searching symbols:', error)
      onResultReadyCallback([])
    }
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
    extension?: any
  ) => {
    console.log('[Datafeed] resolveSymbol:', symbolName)
    
    try {
      const symbols = await getAllSymbols()
      const symbolItem = symbols.find(
        (symbol: any) => symbol.symbol === symbolName
      )

      if (!symbolItem) {
        onResolveErrorCallback('Symbol not found')
        return
      }

      const symbolInfo: LibrarySymbolInfo = {
        name: symbolItem.symbol,
        full_name: symbolItem.full_name,
        description: symbolItem.description,
        type: symbolItem.type,
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: symbolItem.exchange,
        minmov: 1,
        pricescale: 100000000, // 8 decimal places
        has_intraday: true,
        has_no_volume: false,
        has_weekly_and_monthly: true,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 8,
        data_status: 'streaming',
        currency_code: symbolItem.currency_code,
      }

      onSymbolResolvedCallback(symbolInfo)
    } catch (error) {
      console.error('Error resolving symbol:', error)
      onResolveErrorCallback('Failed to resolve symbol')
    }
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: any,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams
    console.log('[Datafeed] getBars:', symbolInfo.full_name, resolution, from, to)
    
    try {
      const interval = resolutionToInterval(resolution)
      const limit = 1000
      
      const url = `${BINANCE_API}/klines?symbol=${symbolInfo.name}&interval=${interval}&limit=${limit}&startTime=${from * 1000}&endTime=${to * 1000}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.length === 0) {
        onHistoryCallback([], { noData: true })
        return
      }
      
      const bars: Bar[] = data.map((bar: any) => ({
        time: bar[0],
        open: parseFloat(bar[1]),
        high: parseFloat(bar[2]),
        low: parseFloat(bar[3]),
        close: parseFloat(bar[4]),
        volume: parseFloat(bar[5])
      }))
      
      onHistoryCallback(bars, { noData: false })
    } catch (error) {
      console.error('Error fetching bars:', error)
      onErrorCallback('Failed to fetch bars')
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) => {
    console.log('[Datafeed] subscribeBars:', symbolInfo.name, resolution)
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      {
        resetCache: () => {
          onResetCacheNeededCallback()
        }
      }
    )
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log('[Datafeed] unsubscribeBars:', subscriberUID)
    unsubscribeFromStream(subscriberUID)
  },
} 