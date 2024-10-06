import { v4 as uuid } from 'uuid'
import connect from '../utils/database'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import {
	IMysqlOk,
	IMysql_error,
	TMysql_exe
} from '../interfaces/interface.mysql'
import { authError } from '../interfaces/auth.interface'

export default class MAuth {
	private _id: string

	static get key(): string {
		return process.env.MY_SECRETE_KEY as string
	}

	constructor(
		private name?: string,
		private age?: number,
		private email?: string,
		private password?: string,
		private imgPath: string = ''
	) {
		this._id = uuid()
	}

	public async singIn(): Promise<void> {}

	public async singUp(): Promise<any> {
		const sqlSingUp: string = `INSERT INTO user (_id, name, age, email, password, imgPath, account_creation) 
      VALUES (?, ?, ?, ?, ?, ?, now())`
		const params: string[] = [
			escape(this._id),
			escape(this.name as string),
			escape(this.age!.toString()),
			escape(this.email as string),
			escape(this.password as string),
			escape(this.imgPath)
		]
		const token: string = jwt.sign({ id: this._id }, MAuth.key, {
			expiresIn: 60 * 60 * 24
		})
		const res = await this.executeQueryMysql(sqlSingUp, params)
		if ((res as IMysqlOk).affectedRows)
			return {
				auth: true,
				message: 'The user was inserted correctly',
				token
			}
		return {
			auth: false,
			...res
		}
	}

	private executeQueryMysql: TMysql_exe<IMysqlOk | IMysql_error | authError> =
		async (sql: string, filters: string[]) => {
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
					} as authError
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
