import app from './market-data'

const port = process.env.API_PORT || 3001

app.listen(port, () => {
  console.log(`Market data API running on port ${port}`)
}) 