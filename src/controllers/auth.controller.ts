import { Request, Response } from 'express'
import { IControllers } from '../interfaces/IControllers'
import MAuth from '../models/MAuth'

const singUp: IControllers = async (req: Request, res: Response) => {
	const { name, age, email, password } = req.body
	const model: MAuth = new MAuth(name, age, email, password)
	const response = await model.singUp()
	res.status(response.auth ? 200 : 401).json({
		response
	})
}

const singIn: IControllers = (req: Request, res: Response) => {
	res.send('hello singIn')
}

const me: IControllers = (req: Request, res: Response) => {
	// const { uuid } = req.params
	res.json({ message: 'hello me' })
}

export { singIn, singUp, me }
