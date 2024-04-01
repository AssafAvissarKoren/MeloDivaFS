import { loggerService } from "../services/logger.service.js"

// export function log(req, res, next) {
// 	loggerService.info('Sample log request')
// 	// res.json('Hi')
// 	next()
// }

export function log(message = 'Sample log request') {
	return function(req, res, next) {
		loggerService.info(message)
		next()
	}
}
