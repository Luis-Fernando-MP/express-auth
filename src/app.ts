require('dotenv').config()
import express from 'express'
import morgan from 'morgan'

const app = express()

//settings
app.set('PORT', process.env.PORT || 4000)

//middleware
app.use(morgan('dev'))

//routers

export default app
