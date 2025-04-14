import express, { Request, Response } from 'express'
import cors from 'cors'
import WebSocket from 'ws'
import ccxt from 'ccxt'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.API_PORT || 3001

// Initialize Binance exchange
const exchange = new ccxt.binance({
  enableRateLimit: true,
  timeout: 30000,
})

// Cache for market data
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const UPDATE_INTERVAL = 1000 // 1 second

// Setup middleware
app.use(cors())
app.use(express.json())

// WebSocket server
const wss = new WebSocket.Server({ noServer: true })

// WebSocket connections
const connections = new Map()

interface Bar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Helper function to get OHLCV data
async function fetchOHLCV(symbol: string, timeframe: string, since: number, limit: number): Promise<Bar[]> {
  try {
    const data = await exchange.fetchOHLCV(symbol, timeframe, since, limit)
    return data.map((candle: number[]) => ({
      time: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }))
  } catch (error) {
    console.error('Error fetching OHLCV:', error)
    return []
  }
}

// API endpoints
app.get('/config', (_req: Request, res: Response) => {
  res.json({
    supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
    supports_group_request: false,
    supports_marks: false,
    supports_search: true,
    supports_timescale_marks: false,
  })
})

app.get('/symbols', async (_req: Request, res: Response) => {
  try {
    const markets = await exchange.loadMarkets()
    const symbols = Object.values(markets)
      .filter((market: any) => market.quote === 'USDT')
      .map((market: any) => ({
        symbol: market.id,
        full_name: market.symbol,
        description: market.symbol,
        exchange: 'Binance',
        type: 'crypto',
      }))
    res.json(symbols)
  } catch (error) {
    console.error('Error loading symbols:', error)
    res.status(500).json({ error: 'Failed to load symbols' })
  }
})

app.get('/history', async (req: Request, res: Response) => {
  const { symbol, resolution, from, to, countback } = req.query
  
  try {
    const timeframe = resolution === '1D' ? '1d' : resolution + 'm'
    const data = await fetchOHLCV(
      symbol as string,
      timeframe as string,
      parseInt(from as string) * 1000,
      parseInt(countback as string) || 1000
    )
    
    res.json({
      s: 'ok',
      t: data.map((bar: Bar) => Math.floor(bar.time / 1000)),
      o: data.map((bar: Bar) => bar.open),
      h: data.map((bar: Bar) => bar.high),
      l: data.map((bar: Bar) => bar.low),
      c: data.map((bar: Bar) => bar.close),
      v: data.map((bar: Bar) => bar.volume),
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    res.status(500).json({ s: 'error', errmsg: 'Failed to fetch history' })
  }
})

// Start server
const server = app.listen(port, () => {
  console.log(`Market data API running on port ${port}`)
})

// Handle WebSocket upgrade
server.on('upgrade', (request: any, socket: any, head: any) => {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    wss.emit('connection', ws, request)
  })
})

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection')

  ws.on('message', async (message: WebSocket.Data) => {
    try {
      const data = JSON.parse(message.toString())
      if (data.type === 'subscribe') {
        const { symbol, interval } = data
        const key = `${symbol}-${interval}`
        
        if (!connections.has(key)) {
          connections.set(key, new Set())
        }
        connections.get(key).add(ws)
        
        // Start sending real-time updates
        const binanceWs = new WebSocket(
          `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
        )
        
        binanceWs.on('message', (msg: WebSocket.Data) => {
          const binanceData = JSON.parse(msg.toString())
          if (binanceData.e === 'kline') {
            const bar = {
              time: binanceData.k.t,
              open: parseFloat(binanceData.k.o),
              high: parseFloat(binanceData.k.h),
              low: parseFloat(binanceData.k.l),
              close: parseFloat(binanceData.k.c),
              volume: parseFloat(binanceData.k.v),
            }
            
            connections.get(key).forEach((client: WebSocket) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(bar))
              }
            })
          }
        })
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
    }
  })

  ws.on('close', () => {
    // Remove connection from all subscriptions
    connections.forEach((clients, key) => {
      clients.delete(ws)
      if (clients.size === 0) {
        connections.delete(key)
      }
    })
  })
})

export default app 