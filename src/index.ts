import app from './app'

app.listen(app.get('PORT'), () => {
	console.log(`server on port ${app.get('PORT')}`)
})
