import { Router } from 'express'
import { me, singIn, singUp } from '../controllers/auth.controller'
import MAuth from '../models/MAuth'

const R_auth: Router = Router()

R_auth.post('/singUp', singUp)
R_auth.post('/singIn', singIn)
R_auth.get('/me', MAuth.authorization, me)

export default R_auth
