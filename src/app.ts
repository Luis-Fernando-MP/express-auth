require('dotenv').config()
import express, {
	json,
	NextFunction,
	Request,
	Response,
	urlencoded
} from 'express'
import morgan from 'morgan'
import cors from 'cors'
import './utils/database'
import R_auth from './routers/auth..router'

const app = express()

//settings
app.set('PORT', process.env.PORT || 4000)

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(urlencoded({ extended: false }))
app.use(json())

//routers
app.use('/auth', R_auth)
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
	if (res.headersSent) {
		return next(err)
	}
	res.status(500)
	res.render('error', { error: err })
})

export default app
