// Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings---Settings
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


// Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes---Routes
import { preRoutes } from './api/pre_station/pre.routes.js'
import { categoryRoutes } from './api/category/category.routes.js'
import { stationRoutes } from './api/station/station.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { msgRoutes } from './api/msg/msg.routes.js'
import path from 'path'

app.use('/api/pre_station', preRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/station', stationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/msg', msgRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


// Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener---Listener
import { loggerService } from './services/logger.service.js'

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    loggerService.info('Up and running on port', PORT)
})