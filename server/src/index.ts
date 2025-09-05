import express from 'express'
import cors from 'cors'
import routes from './routes.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})