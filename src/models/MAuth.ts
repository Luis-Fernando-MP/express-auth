import { v4 as uuid } from 'uuid'
import connect from '../utils/database'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import {
	IMysqlOk,
	IMysql_error,
	TMysql_exe
} from '../interfaces/interface.mysql'
import {
	IAuthError,
	ISingInNot,
	ISingInOk,
	ISingNot,
	ISingOk
} from '../interfaces/auth.interface'
import bcrypt from 'bcrypt'

export default class MAuth {
	private _id: string

	static get key(): string {
		return process.env.MY_SECRETE_KEY as string
	}

	constructor(
		private email?: string,
		private password?: string,
		private name?: string,
		private age?: number,
		private imgPath: string = ''
	) {
		this._id = uuid()
	}

	public async singIn(): Promise<any> {
		const sqlSingIn = `SELECT user._id FROM user WHERE user.email = ? AND user.password = ? LIMIT 1`
		const params: string[] = [
			escape(this.email as string),
			escape(this.password as string)
		]
		const res = await this.executeQueryMysql(sqlSingIn, params)
		if (res[0]) {
			console.log(res)
			console.log(res['0'])
		}
		return {
			auth: false,
			message: 'your email and password are invalid'
		} as ISingInNot
		// const token: string = jwt.sign({ id: this._id }, MAuth.key, {
		// 	expiresIn: 60 * 60 * 24
		// })
	}

	public async singUp(): Promise<ISingOk | ISingNot<string>> {
		const sqlSingUp: string = `INSERT INTO user (_id, name, age, email, password, imgPath, account_creation) 
      VALUES (?, ?, ?, ?, ?, ?, now())`
		const salt = await bcrypt.genSalt(10)
		const pass = await bcrypt.hash(this.password as string, salt)
		const params: string[] = [
			escape(this._id),
			escape(this.name as string),
			escape(this.age!.toString()),
			escape(this.email as string),
			escape(pass as string),
			escape(this.imgPath)
		]
		const res = await this.executeQueryMysql(sqlSingUp, params)
		if ((res as IMysqlOk).affectedRows)
			return {
				auth: true,
				message: 'The user was inserted correctly',
				tokenOk: true
			} as ISingOk

		return {
			auth: (res as IAuthError).auth,
			because: (res as IAuthError).sqlMessage
		} as ISingNot<string>
	}

	private executeQueryMysql: TMysql_exe<IMysqlOk | IAuthError | any> = async (
		sql: string,
		filters: string[]
	) => {
		const con = await connect()
		const options = { sql, timeout: 10000 }
		const query = con.query(options, filters)
		return query
			.then(response => {
				return response[0] as IMysqlOk
			})
			.catch(err => {
				const { code, sqlMessage } = err as IMysql_error
				return {
					auth: false,
					code,
					sqlMessage
				} as IAuthError
			})
	}
	static authorization(req: Request, res: Response, next: NextFunction) {
		const header = req.headers['x-access-token']
		if (typeof header == 'undefined') {
			return res.status(500).json({ auth: false, message: 'no token provided' })
		}
		try {
			jwt.verify(header as string, MAuth.key)
			next()
		} catch (error) {
			const { name, message } = error as JsonWebTokenError
			res.status(500).json({
				auth: false,
				name,
				message
			})
		}
	}
}
