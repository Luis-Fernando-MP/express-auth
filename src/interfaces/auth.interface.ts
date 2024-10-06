interface auth {
	auth: boolean
	message: string
}

interface authError {
	auth: false
	code: string
	sqlMessage: string
}

interface singUpOk extends auth {
	tokenOk: boolean
}

interface singUpNot extends auth {
	tokenOk: boolean
	more: any
}

interface singInOk extends auth {
	token: string
}

export { authError, singUpOk, singUpNot }
