import cors from 'cors'
import express from 'express'
import { authRouter } from './routes/authRoutes'
import { dareRouter } from './routes/dareRoutes'
import { userRouter } from './routes/userRoutes'

const app = express()
app.use(cors())

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/dare', dareRouter)

app.listen(7001)