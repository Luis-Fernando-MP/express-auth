import { createPool, PoolConnection } from 'mysql2/promise'

const { DB_HOST, DB_USER, DB_PASS, DB_BASE, DB_LIMIT } = process.env

export default async function connect() {
	return await createPool({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB_BASE,
		connectionLimit: Number(DB_LIMIT)
	})
}
