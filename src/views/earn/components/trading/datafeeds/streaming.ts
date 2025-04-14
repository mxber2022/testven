import { LibrarySymbolInfo, ResolutionString, SubscribeBarsCallback } from '../../../../../public/charting_library/charting_library'

interface WebSocketConnection {
  ws: WebSocket
  symbol: string
  resolution: string
  lastBar?: {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }
  subscribeUID: string
  channelString: string
  listeners: Set<string>
}

const channelToSubscription = new Map<string, WebSocketConnection>()

function getNextDailyBarTime(barTime: number) {
  const date = new Date(barTime)
  date.setDate(date.getDate() + 1)
  return date.getTime()
}

function getNextWeeklyBarTime(barTime: number) {
  const date = new Date(barTime)
  date.setDate(date.getDate() + 7)
  return date.getTime()
}

function getNextMonthlyBarTime(barTime: number) {
  const date = new Date(barTime)
  date.setMonth(date.getMonth() + 1)
  return date.getTime()
}

function getNextBarTime(resolution: string, previousBarTime: number) {
  if (resolution === '1D') return getNextDailyBarTime(previousBarTime)
  if (resolution === '1W') return getNextWeeklyBarTime(previousBarTime)
  if (resolution === '1M') return getNextMonthlyBarTime(previousBarTime)
  return previousBarTime + parseInt(resolution) * 60 * 1000
}

export function subscribeOnStream(
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onRealtimeCallback: SubscribeBarsCallback,
  subscribeUID: string,
  onResetCacheNeededCallback: () => void,
  lastDailyBar: any,
) {
  const channelString = `${symbolInfo.name.toLowerCase()}@kline_${resolution}`
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  }
  
  let subscription = channelToSubscription.get(channelString)
  
  if (subscription) {
    // Already subscribed to the channel, just add the handler
    subscription.listeners.add(subscribeUID)
    return
  }
  
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${channelString}`)
  
  subscription = {
    ws,
    symbol: symbolInfo.name,
    resolution,
    subscribeUID,
    channelString,
    listeners: new Set([subscribeUID]),
    lastBar: lastDailyBar,
  }
  
  channelToSubscription.set(channelString, subscription)
  
  ws.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data)
      const kline = parsedData.k
      
      if (!kline) {
        console.warn('No kline data in message:', parsedData)
        return
      }
      
      const bar = {
        time: kline.t,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
      }
      
      subscription!.lastBar = bar
      
      // Notify all listeners
      subscription!.listeners.forEach(listenerId => {
        const handler = { id: listenerId, callback: onRealtimeCallback }
        handler.callback(bar)
      })
      
      if (kline.x) { // If the bar is closed
        const nextBarTime = getNextBarTime(resolution, bar.time)
        console.log(`Bar closed at ${new Date(bar.time).toISOString()}, next bar at ${new Date(nextBarTime).toISOString()}`)
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
    }
  }
  
  ws.onopen = () => {
    console.log(`WebSocket connected for ${channelString}`)
  }
  
  ws.onerror = (error) => {
    console.error(`WebSocket error for ${channelString}:`, error)
    
    // Notify about the need to reset cache
    onResetCacheNeededCallback()
    
    // Try to reconnect after a delay
    setTimeout(() => {
      if (channelToSubscription.has(channelString)) {
        console.log(`Attempting to reconnect WebSocket for ${channelString}`)
        subscribeOnStream(
          symbolInfo,
          resolution,
          onRealtimeCallback,
          subscribeUID,
          onResetCacheNeededCallback,
          subscription!.lastBar
        )
      }
    }, 5000)
  }
  
  ws.onclose = () => {
    console.log(`WebSocket closed for ${channelString}`)
  }
}

export function unsubscribeFromStream(subscriberUID: string) {
  // Find all channels this UID is subscribed to
  for (const [channelString, subscription] of channelToSubscription.entries()) {
    subscription.listeners.delete(subscriberUID)
    
    if (subscription.listeners.size === 0) {
      console.log(`Closing WebSocket for ${channelString}`)
      subscription.ws.close()
      channelToSubscription.delete(channelString)
    }
  }
} 