import { Request, Response, NextFunction } from 'express'

type IControllers = (req: Request, res: Response, next?: NextFunction) => void

export { IControllers }
