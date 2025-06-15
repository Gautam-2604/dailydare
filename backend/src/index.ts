import cors from 'cors'
import express from 'express'
import { dareRouter } from './routes/dareRoutes'
import { userRouter } from './routes/userRoutes'

const app = express()
app.use(cors())

app.use(express.json())

app.use('/api/v1/auth', userRouter)
app.use('/api/v1/dare', dareRouter)

app.listen(7001)