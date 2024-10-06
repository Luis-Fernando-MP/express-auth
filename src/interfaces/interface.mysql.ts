interface IMysqlOk {
	fieldCount: number
	affectedRows: number
	insertId: number
	info: string
	serverStatus: number
	warningStatus: number
}

interface IMysql_error {
	message: string
	code: string
	errno: number
	sql: string
	sqlState: string
	sqlMessage: string
}

type TMysql_exe<T> = (sql: string, filters: string[]) => Promise<T>

export { IMysqlOk, IMysql_error, TMysql_exe }
