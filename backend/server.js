import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import userRouter from './routes/userRoutes.js'
import itemRouter from './routes/itemRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'

const app = express()
const port = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['https://food-ordering-system-frontend-0hm1.onrender.com', 'https://food-ordering-system-admin.onrender.com']  // Fixed variable name
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        }
        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//DATABASE
connectDB()

// Static files middleware (should come before API routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/user', userRouter)
app.use('/api/items', itemRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)


app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})