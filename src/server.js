// Dependencies
import express from 'express'
import cors from 'cors'

// Other dependencies
import { logErrors } from './utils/middlewares/errorsHandler'
import { api } from './config/envServer'
import routes from './routes/index'
import exchange from './routes/exchange'
import auth from './routes/auth'

const app = express()

// Middlewares
if (api.env !== 'production') {
	app.use(cors('*'))
} else {
	const helmet = require('helmet')

	app.use(cors(api.cors))
	app.use(helmet())
	app.use(helmet.permittedCrossDomainPolicies())
	app.disable('x-powered-by')
}
app.use(express.json())

// Routes
app.get('/', (req, res, next) => {
	res.redirect('/api')
})
app.use('/api', routes)
app.use('/api/auth', auth)
app.use('/api/exchange', exchange)

// Handler Error
app.use(logErrors)

if (api.env !== 'production') {
	const log = require('./utils/network/log')

	app.listen(api.port, (err) => {
		if (err) log.default.error(err)
		else {
			if (api.server !== '') log.default.success(`=> Server on ${api.server}`)
			else log.default.success(`=> Server on http://localhost:${api.port}`)
		}
	})
}

export default app