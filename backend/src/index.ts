import cors from 'cors'
import express from 'express'
import { userRouter } from './routes/userRoutes'

const app = express()
app.use(cors())

app.use(express.json())

app.use('/api/v1/auth', userRouter)

app.listen(7001)