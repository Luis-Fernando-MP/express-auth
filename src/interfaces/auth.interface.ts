interface IAuth {
	auth: boolean
	message: string
}

interface IAuthError {
	auth: false
	code: string
	sqlMessage: string
}

interface ISingOk extends IAuth {
	tokenOk: boolean
}
interface ISingNot<T> extends IAuth {
	tokenOk: boolean
	because: T
}

interface ISingInOk extends IAuth {
	token: string
}

interface ISingInNot extends IAuth {}

export { IAuthError, ISingOk, ISingNot, ISingInOk, ISingInNot }
