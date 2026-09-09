import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB} from './Config/db.js'
import authRouter from './Routes/AuthRoutes.js'
import eventRouter from './Routes/EventRouter.js'
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/auth', authRouter)
app.use('/api', eventRouter)

app.get('/', (req, res)=>{
  res.send('Server is running')
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error(`Database startup failed: ${error.message}`)
    process.exit(1)
  }
}

startServer()